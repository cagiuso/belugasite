import { useEffect, useState } from "react";
import { loadVLibras } from "./vlibras";

export function AccessibilityTools() {
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  useEffect(() => {
    let isMounted = true;
    setLoadingStatus("loading");
    loadVLibras({
      retry: loadAttempt > 0,
    }).then(
      () => {
        if (isMounted) setLoadingStatus("loaded");
      },
      () => {
        if (isMounted) setLoadingStatus("error");
      },
    );
    return () => {
      isMounted = false;
    };
  }, [loadAttempt]);
  return (
    <div className="accessibility-note page-width">
      {loadingStatus === "error" ? (
        <p role="status">
          O VLibras não carregou. Verifique a conexão.{" "}
          <button
            type="button"
            onClick={() => setLoadAttempt((value) => value + 1)}
          >
            Tentar novamente
          </button>
        </p>
      ) : (
        <p>
          {loadingStatus === "loading"
            ? "Carregando o VLibras…"
            : "Para traduzir o texto para Libras, use o botão do VLibras na lateral da página."}
        </p>
      )}
    </div>
  );
}
