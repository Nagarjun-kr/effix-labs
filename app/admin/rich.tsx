"use client";

// Visual post editor (the Gutenberg part): what you see is what readers get. Stores Markdown, the format the blog
// renders, by converting HTML <-> Markdown on load and on every change.
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

// ---------- Markdown <-> HTML ----------
const toHTML = (md: string) => marked.parse(md || "", { async: false, gfm: true }) as string;

const cellPrefix = (node: Node) => (Array.prototype.indexOf.call(node.parentNode?.childNodes ?? [], node) === 0 ? "| " : " ");
const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
  strongDelimiter: "**",
  // Empty elements: an empty table cell is still a cell; an empty paragraph inside a cell is nothing.
  blankReplacement: (_content, node) => {
    const n = node as unknown as Node & { isBlock?: boolean };
    if (n.nodeName === "TD" || n.nodeName === "TH") return `${cellPrefix(n)} |`;
    if (n.parentNode?.nodeName === "TD" || n.parentNode?.nodeName === "TH") return "";
    return n.isBlock ? "\n\n" : "";
  },
});
// Table cells on one line (empty cells included). Added before the GFM plugin so it takes precedence.
turndown.addRule("tableCellOneLine", {
  filter: ["th", "td"],
  replacement: (content, node) => {
    return `${cellPrefix(node)}${content.replace(/\s*\n+\s*/g, " ").replace(/\|/g, "\\|").trim()} |`;
  },
});
turndown.use(gfm);
// Tight list items: <li><p>text</p></li> -> "- text"
turndown.addRule("listParagraph", {
  filter: (node) => node.nodeName === "P" && node.parentNode?.nodeName === "LI" && (node.parentNode as Element).children.length === 1,
  replacement: (content) => content,
});
// Tables: TipTap puts <p> inside cells
turndown.addRule("cellParagraph", {
  filter: (node) => node.nodeName === "P" && (node.parentNode?.nodeName === "TD" || node.parentNode?.nodeName === "TH"),
  replacement: (content) => content,
});
// TipTap adds <colgroup> and inline widths to tables, which stop the GFM converter from making a Markdown table.
const toMD = (html: string) =>
  turndown.turndown(html.replace(/<colgroup>[\s\S]*?<\/colgroup>/g, "").replace(/ style="[^"]*"/g, "")).replace(/\n{3,}/g, "\n\n").trim();

// ---------- blocks for the "+ Add block" menu ----------
type Block = { label: string; hint: string; icon: string; run: (e: Editor) => void };
/** Like WordPress: a new block goes after the current top-level block (outside quotes, lists and tables), unless the
 *  cursor is already in an empty paragraph. */
const after = (e: Editor) => {
  const { $from } = e.state.selection;
  const top = $from.depth >= 1 ? $from.node(1) : null;
  if (!top || (top.type.name === "paragraph" && !top.textContent.trim())) return e.chain().focus();
  const pos = $from.after(1);
  return e.chain().focus().insertContentAt(pos, { type: "paragraph" }).setTextSelection(pos + 1);
};
const BLOCKS = (pickImage: () => void): Block[] => [
  { label: "Heading", hint: "Main section (H2)", icon: "H2", run: (e) => after(e).setHeading({ level: 2 }).run() },
  { label: "Sub-heading", hint: "Section inside a section (H3)", icon: "H3", run: (e) => after(e).setHeading({ level: 3 }).run() },
  { label: "Paragraph", hint: "Plain text", icon: "¶", run: (e) => after(e).setParagraph().run() },
  { label: "Bulleted list", hint: "Points without order", icon: "•", run: (e) => after(e).toggleBulletList().run() },
  { label: "Numbered list", hint: "Steps in order", icon: "1.", run: (e) => after(e).toggleOrderedList().run() },
  { label: "Quote", hint: "Pull quote in italics", icon: "❝", run: (e) => after(e).toggleBlockquote().run() },
  { label: "Tip box", hint: "Green highlighted tip", icon: "✓", run: (e) => after(e).insertContent("<blockquote><p><strong>Tip:</strong> </p></blockquote>").run() },
  { label: "Note box", hint: "Purple highlighted note", icon: "i", run: (e) => after(e).insertContent("<blockquote><p><strong>Note:</strong> </p></blockquote>").run() },
  { label: "Warning box", hint: "Orange highlighted warning", icon: "!", run: (e) => after(e).insertContent("<blockquote><p><strong>Warning:</strong> </p></blockquote>").run() },
  { label: "Table", hint: "3 columns with a header row", icon: "▦", run: (e) => after(e).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { label: "Image", hint: "Upload a picture or screenshot", icon: "🖼", run: () => pickImage() },
  { label: "Divider", hint: "Horizontal line", icon: "—", run: (e) => after(e).setHorizontalRule().run() },
  { label: "Code", hint: "Code block (e.g. HTML tags)", icon: "</>", run: (e) => after(e).toggleCodeBlock().run() },
];

export default function RichEditor({ value, onChange, onImage }: { value: string; onChange: (md: string) => void; onImage: (file: File) => Promise<{ src: string; alt: string } | null> }) {
  const [menu, setMenu] = useState(false);
  const [, force] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastMD = useRef(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: null, target: null } } }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: "Start writing, or click “+ Add block”. Tip: type ## and a space for a heading." }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: toHTML(value),
    editorProps: { attributes: { class: "cm-prose", spellcheck: "true" } },
    onUpdate: ({ editor }) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const md = toMD(editor.getHTML());
        lastMD.current = md;
        onChange(md);
      }, 250);
    },
    onSelectionUpdate: () => force((n) => n + 1),
    onTransaction: () => force((n) => n + 1),
  });

  // Replace content when a different post is loaded (not on our own edits)
  useEffect(() => {
    if (editor && value !== lastMD.current) {
      lastMD.current = value;
      editor.commands.setContent(toHTML(value), { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return <div className="cm-editor-loading">Loading editor…</div>;

  const pickImage = () => fileRef.current?.click();
  const block = editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : editor.isActive("heading", { level: 4 }) ? "h4" : "p";
  const btn = (label: string, active: boolean, run: () => void, title: string) => (
    <button type="button" className={active ? "is-on" : ""} onMouseDown={(e) => e.preventDefault()} onClick={run} title={title} aria-label={title} aria-pressed={active}>{label}</button>
  );
  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link address (e.g. /services/seo-aeo-services or https://…). Leave empty to remove.", prev ?? "");
    if (url === null) return;
    if (!url.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className="cm-rich">
      <div className="cm-toolbar" role="toolbar" aria-label="Formatting">
        <div className="cm-add">
          <button type="button" className="cm-add-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>+ Add block</button>
          {menu && (
            <div className="cm-add-menu" role="menu">
              {BLOCKS(pickImage).map((b) => (
                <button key={b.label} type="button" role="menuitem" onMouseDown={(e) => e.preventDefault()} onClick={() => { b.run(editor); setMenu(false); }}>
                  <i>{b.icon}</i><span><b>{b.label}</b><small>{b.hint}</small></span>
                </button>
              ))}
            </div>
          )}
        </div>
        <select
          value={block}
          aria-label="Text style"
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: Number(v.slice(1)) as 2 | 3 | 4 }).run();
          }}
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading (H2)</option>
          <option value="h3">Sub-heading (H3)</option>
          <option value="h4">Small heading (H4)</option>
        </select>
        <span className="cm-sep" />
        {btn("B", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), "Bold")}
        {btn("I", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), "Italic")}
        {btn("S", editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), "Strikethrough")}
        {btn("🔗", editor.isActive("link"), setLink, "Add or edit link")}
        <span className="cm-sep" />
        {btn("•", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), "Bulleted list")}
        {btn("1.", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), "Numbered list")}
        {btn("❝", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), "Quote")}
        {btn("▦", editor.isActive("table"), () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), "Insert table")}
        {btn("🖼", false, pickImage, "Insert image")}
        {btn("—", false, () => editor.chain().focus().setHorizontalRule().run(), "Divider")}
        <span className="cm-sep" />
        {btn("↶", false, () => editor.chain().focus().undo().run(), "Undo")}
        {btn("↷", false, () => editor.chain().focus().redo().run(), "Redo")}
        {editor.isActive("image") && (
          <span className="cm-table-tools">
            {btn(editor.getAttributes("image").alt ? "Alt text ✓" : "Add alt text", false, () => {
              const alt = window.prompt("Describe this image (alt text):", (editor.getAttributes("image").alt as string) ?? "");
              if (alt !== null) editor.chain().focus().updateAttributes("image", { alt: alt.trim() }).run();
            }, "Edit image alt text")}
          </span>
        )}
        {editor.isActive("table") && (
          <span className="cm-table-tools">
            {btn("+ row", false, () => editor.chain().focus().addRowAfter().run(), "Add row below")}
            {btn("+ col", false, () => editor.chain().focus().addColumnAfter().run(), "Add column right")}
            {btn("− row", false, () => editor.chain().focus().deleteRow().run(), "Delete row")}
            {btn("− col", false, () => editor.chain().focus().deleteColumn().run(), "Delete column")}
            {btn("✕ table", false, () => editor.chain().focus().deleteTable().run(), "Delete table")}
          </span>
        )}
      </div>
      <EditorContent editor={editor} />
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const img = await onImage(file);
          if (img) editor.chain().focus().setImage({ src: img.src, alt: img.alt }).run();
        }}
      />
    </div>
  );
}
