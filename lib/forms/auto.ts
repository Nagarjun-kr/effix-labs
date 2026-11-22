// Browser bundle for the service pages (plain scripts, no React): binds every <form data-effix-form="Name"> to the
// strict checks and the Worker. Built to public/js/form-guard.js by `npm run build:forms` (runs before every build).
import { bindForm } from "./guard";

const WORKER = "https://effix-search.effix-labs.workers.dev";
const api = location.hostname === "localhost" && location.port === "3000" ? "" : WORKER;

function bindAll() {
  document.querySelectorAll<HTMLFormElement>("form[data-effix-form]").forEach((f) => bindForm(f, { name: f.dataset.effixForm || "Website form", api }));
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindAll);
else bindAll();
