// Consultation modal: service options, Escape-to-close and the close
// button's accessible name. Run with `npm test` (Node's built-in runner).
// The component itself is rendered through Vite's SSR loader so the real
// JSX is tested without adding a browser test framework.

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

import {
  MARKETING_SERVICES,
  DIVISIONS,
  CONSULTATION_SERVICES,
} from "../src/components/Consultation/consultationServices.js";
import { escapeToClose } from "../src/components/Consultation/escapeToClose.js";

// Must match the backend's CONSULTATION_SERVICES
// (validators/consultation.validator.js) value for value.
const BACKEND_CONSULTATION_SERVICES = [
  "SEO",
  "Google Ads",
  "Social Media Marketing",
  "Website Development",
  "Email Marketing",
  "Branding",
  "Complete Digital Marketing",
  "Digital Marketing",
  "Event Management",
  "Business & Technology Solutions",
  "AuraWork",
];

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

let vite;
let ConsultationModal;

before(async () => {
  // Own cache dir, no dependency optimisation, no watcher/HMR: the test must
  // never touch node_modules/.vite, which a running `npm run dev` relies on.
  vite = await createServer({
    appType: "custom",
    logLevel: "error",
    cacheDir: path.join(os.tmpdir(), "d6-frontend-test-vite"),
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, watch: null },
  });
  ({ default: ConsultationModal } = await vite.ssrLoadModule("/src/components/Consultation/ConsultationModal.jsx"));
});

after(async () => {
  await vite?.close();
});

const render = (props) => renderToStaticMarkup(createElement(ConsultationModal, { onClose() {}, ...props }));

describe("service options", () => {
  test("keeps the original seven marketing services", () => {
    assert.deepEqual(MARKETING_SERVICES, BACKEND_CONSULTATION_SERVICES.slice(0, 7));
  });

  test("adds the four D6 Global divisions", () => {
    assert.deepEqual(DIVISIONS, ["Digital Marketing", "Event Management", "Business & Technology Solutions", "AuraWork"]);
  });

  test("the rendered option values match the backend list exactly", () => {
    const html = render({ isOpen: true });
    const select = html.match(/<select[^>]*name="service"[\s\S]*?<\/select>/)[0];
    const values = [...select.matchAll(/<option value="([^"]*)"/g)].map((m) => decode(m[1]));
    assert.equal(values[0], "", "placeholder option first");
    assert.deepEqual(values.slice(1), BACKEND_CONSULTATION_SERVICES);
    assert.deepEqual(CONSULTATION_SERVICES, BACKEND_CONSULTATION_SERVICES);
  });

  test("the service select stays required (an empty choice can't be submitted)", () => {
    assert.match(render({ isOpen: true }), /<select[^>]*name="service"[^>]*required/);
  });
});

describe("close button", () => {
  test("has an accessible name and doesn't submit the form", () => {
    const html = render({ isOpen: true });
    const button = html.match(/<button[^>]*class="close-btn"[^>]*>/)[0];
    assert.match(button, /aria-label="Close consultation form"/);
    assert.match(button, /type="button"/);
  });

  test("nothing renders while closed", () => {
    assert.equal(render({ isOpen: false }), "");
  });
});

describe("Escape key", () => {
  const key = (k) => Object.assign(new Event("keydown"), { key: k });

  test("Escape calls onClose; other keys don't", () => {
    const target = new EventTarget();
    let closed = 0;
    const cleanup = escapeToClose(target, () => { closed += 1; });

    target.dispatchEvent(key("Enter"));
    target.dispatchEvent(key("a"));
    assert.equal(closed, 0);

    target.dispatchEvent(key("Escape"));
    assert.equal(closed, 1);
    cleanup();
  });

  test("cleanup removes the listener", () => {
    const target = new EventTarget();
    let closed = 0;
    const cleanup = escapeToClose(target, () => { closed += 1; });
    cleanup();
    target.dispatchEvent(key("Escape"));
    assert.equal(closed, 0);
  });
});
