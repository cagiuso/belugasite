const scriptId = "beluga-vlibras";
let widgetPromise;

// O script oficial inicia o widget. A mesma promessa evita carregar duas vezes.

export function loadVLibras({ retry = false } = {}) {
  if (retry) {
    document.getElementById(scriptId)?.remove();
    widgetPromise = undefined;
  }
  if (widgetPromise) return widgetPromise;
  widgetPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("VLibras unavailable"));
    document.body.appendChild(script);
  });
  return widgetPromise;
}
