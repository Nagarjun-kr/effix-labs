// Realistic platform logos, drawn the way each brand presents its app icon: YouTube's red play button on white,
// Instagram's camera on its gradient, Facebook's blue "f" circle, LinkedIn's blue "in", Reddit's orange alien, X, Quora,
// Threads, and Google's four-colour G. Vector, so they stay sharp at any size. Marks: Font Awesome Free brands (CC BY 4.0);
// logos are trademarks of their owners.
import type { CSSProperties } from "react";

import { BRAND_ICONS } from "./brand-icons";

type Look = { bg: string; fill: string; scale: number };
const LOOK: Record<string, Look> = {
  YouTube: { bg: "#ffffff", fill: "#FF0000", scale: 0.64 },
  Instagram: { bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)", fill: "#ffffff", scale: 0.56 },
  Facebook: { bg: "#ffffff", fill: "#0866FF", scale: 0.7 },
  LinkedIn: { bg: "#ffffff", fill: "#0A66C2", scale: 0.66 },
  X: { bg: "#000000", fill: "#ffffff", scale: 0.5 },
  Reddit: { bg: "#ffffff", fill: "#FF4500", scale: 0.72 },
  Quora: { bg: "#B92B27", fill: "#ffffff", scale: 0.56 },
  Threads: { bg: "#000000", fill: "#ffffff", scale: 0.54 },
  Google: { bg: "#ffffff", fill: "", scale: 0.6 },
};

function GoogleG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** A platform's app-icon style logo. `float` adds the gentle bob used on cards and banners. */
export default function AppIcon({ name, size = 48, float = false, className = "", style }: { name: string; size?: number; float?: boolean; className?: string; style?: CSSProperties }) {
  const look = LOOK[name];
  const mark = BRAND_ICONS[name];
  if (!look) return null;
  const glyph = Math.round(size * look.scale);
  return (
    <span
      className={`app-icon ${float ? "is-float" : ""} ${className}`}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.26), background: look.bg, ...style }}
      aria-hidden="true"
    >
      {name === "Google" ? (
        <GoogleG size={glyph} />
      ) : mark ? (
        <svg width={glyph} height={glyph} viewBox={`0 0 ${mark.w} ${mark.h}`}>
          <path d={mark.d} fill={look.fill} />
        </svg>
      ) : null}
    </span>
  );
}
