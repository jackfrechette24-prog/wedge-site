// Browser only. Loads the ROASForm embed script with the same stub and `_l` guard as the official snippet.
//
// What the script (roasform-embed.js v1.7) actually does, so the code below stays honest:
// - Before it loads, window.ROASForm is the snippet's stub: { q: [...options], _l: 1 }.
// - Once loaded it replaces that with { createForm, q: { push }, _l: 1, _claims }. Queued options are
//   mounted on load, and later q.push(options) calls mount immediately.
// - createForm(options) returns { iframe, destroy } or null. destroy() removes the iframe, its message
//   listener, and its claim on the container, so the same container can be mounted again later.
// - q.push() calls createForm but throws away the returned instance, so a form mounted that way can never
//   be cleaned up. That is why mountRoasForm() waits for the script and calls createForm directly.
// - It listens only for resize, redirect, expand (full screen), and scroll-top messages from the form.
//   There is no submit or completion event.
import { ROASFORM } from "@/content/site";

export type RoasFormOptions = {
  formId: string;
  mode: "inline";
  inheritBackground: boolean;
  container: string | HTMLElement;
};

export type RoasFormInstance = { iframe: HTMLIFrameElement; destroy: () => void };

type RoasFormGlobal = {
  q: RoasFormOptions[] | { push: (options: RoasFormOptions) => void };
  _l?: number;
  createForm?: (options: RoasFormOptions) => RoasFormInstance | null;
};

declare global {
  interface Window {
    ROASForm?: RoasFormGlobal;
  }
}

type CreateForm = NonNullable<RoasFormGlobal["createForm"]>;

let loading: Promise<CreateForm> | null = null;

function api(): CreateForm | null {
  const createForm = window.ROASForm?.createForm;
  return typeof createForm === "function" ? createForm : null;
}

/** Starts loading the embed script (once per page session) and resolves when createForm is available. */
export function loadRoasForm(): Promise<CreateForm> {
  const ready = api();
  if (ready) return Promise.resolve(ready);
  if (loading) return loading;

  loading = new Promise<CreateForm>((resolve, reject) => {
    const w = window;
    w.ROASForm = w.ROASForm || { q: [] };

    let script: HTMLScriptElement | null = null;
    if (!w.ROASForm._l) {
      w.ROASForm._l = 1;
      script = document.createElement("script");
      script.src = ROASFORM.scriptSrc;
      script.async = true;
      document.head.appendChild(script);
    } else {
      // Something else on the page already injected it, so wait on that tag.
      script = document.querySelector<HTMLScriptElement>(`script[src="${ROASFORM.scriptSrc}"]`);
    }

    const fail = () => {
      loading = null;
      // Clear the guard so a later attempt injects a fresh tag.
      script?.remove();
      if (w.ROASForm && !api()) w.ROASForm._l = 0;
      reject(new Error("ROASForm embed script failed to load"));
    };

    const settle = () => {
      const createForm = api();
      if (createForm) resolve(createForm);
      else fail();
    };

    if (script) {
      script.addEventListener("load", settle, { once: true });
      script.addEventListener("error", fail, { once: true });
    } else {
      // Guard was set but no tag is found: poll briefly rather than inject a second copy.
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        if (api() || tries > 100) {
          window.clearInterval(timer);
          settle();
        }
      }, 100);
    }
  });

  return loading;
}

/** Warm up on hover/focus/touch of a qualify button. Errors surface later, when the form mounts. */
export function preloadRoasForm() {
  loadRoasForm().catch(() => {});
}

export function roasFormOptions(): RoasFormOptions {
  return {
    formId: ROASFORM.formId,
    mode: "inline",
    inheritBackground: false,
    container: `#${ROASFORM.containerId}`,
  };
}
