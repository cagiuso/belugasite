import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  AudioLines,
  ScanLine,
  Volume2,
  Wrench,
  Hammer,
} from "lucide-react";
import { Button } from "./Button";
import { useTour } from "../../tour/TourContext";
import {
  applyNarrationVoice,
  selectNarrationVoice,
} from "../../tour/narrationVoice";

export function RecognitionDemo() {
  const tour = useTour();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [audioError, setAudioError] = useState("");
  const scanTimeoutRef = useRef(null);
  const resultSpeechRef = useRef(null);
  const stopResultAudio = () => {
    const resultMessage = resultSpeechRef.current;
    resultSpeechRef.current = null;
    if (resultMessage) {
      resultMessage.onend = null;
      resultMessage.onerror = null;
      window.speechSynthesis?.cancel();
    }
  };
  useEffect(() => {
    if (tour?.stage === "demo") {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      stopResultAudio();
      setScanned(false);
      setScanning(false);
      setPlaying(false);
      setHasListened(false);
      setAudioError("");
    }
  }, [tour?.stage]);
  useEffect(
    () => () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      stopResultAudio();
    },
    [],
  );
  // A espera representa uma análise ilustrativa; esta página não abre a câmera.
  const scan = () => {
    tour?.stopNarration();
    tour?.onScan();
    setAudioError("");
    setScanned(false);
    setHasListened(false);
    setScanning(true);
    scanTimeoutRef.current = setTimeout(() => {
      tour?.onResult();
      setScanned(true);
      setScanning(false);
    }, 1500);
  };
  const speak = () => {
    tour?.stopNarration();
    if (
      !window.speechSynthesis ||
      typeof SpeechSynthesisUtterance === "undefined"
    ) {
      setAudioError(
        "Seu navegador não oferece leitura em voz. Resultado: dois alicates, um martelo, três peças.",
      );
      return;
    }
    stopResultAudio();
    tour?.onAudio(true);
    const resultMessage = new SpeechSynthesisUtterance(
      "A conferência desta simulação encontrou dois alicates e um martelo, somando três peças ao todo.",
    );
    applyNarrationVoice(
      resultMessage,
      selectNarrationVoice(window.speechSynthesis.getVoices?.() || []),
    );
    resultSpeechRef.current = resultMessage;
    resultMessage.onend = () => {
      if (resultSpeechRef.current !== resultMessage) return;
      resultSpeechRef.current = null;
      setPlaying(false);
      setHasListened(true);
      tour?.onAudio(false);
    };
    resultMessage.onerror = () => {
      if (resultSpeechRef.current !== resultMessage) return;
      resultSpeechRef.current = null;
      tour?.onAudio(false);
      setPlaying(false);
      setAudioError(
        "Não foi possível reproduzir. Resultado: dois alicates, um martelo, três peças.",
      );
    };
    setPlaying(true);
    if (window.speechSynthesis.paused) window.speechSynthesis.resume?.();
    window.speechSynthesis.speak(resultMessage);
  };
  const suggestedAction =
    scanning || playing ? null : !scanned ? "scan" : !hasListened ? "audio" : null;
  return (
    <div
      className={`demo-window ${tour?.stage === "demo" && !scanning ? "demo-awaiting" : ""}`}
    >
      <div className="demo-topbar">
        <span className="flex items-center gap-2">
          <span className="status-dot" /> BELUGA · CONFERÊNCIA
        </span>
        <span>DEMONSTRAÇÃO ILUSTRATIVA</span>
      </div>
      <div className="demo-body">
        <div
          className={`scanner ${scanning ? "is-scanning" : ""} ${scanned ? "is-complete" : ""}`}
        >
          <div className="scanner-grid" />
          <span className="camera-label">
            <ScanLine size={13} /> VISÃO DO SISTEMA
          </span>
          <div className="scan-object object-one">
            <Wrench strokeWidth={1.2} />
            <span>Alicate · 01</span>
          </div>
          <div className="scan-object object-two">
            <Wrench strokeWidth={1.2} />
            <span>Alicate · 02</span>
          </div>
          <div className="scan-object object-three">
            <Hammer strokeWidth={1.2} />
            <span>Martelo · 01</span>
          </div>
          {scanning && <div className="scan-beam" />}
          <div className="scanner-bottom">
            <span className="status-dot" />{" "}
            {scanning
              ? "Analisando objetos..."
              : scanned
                ? "Conferência concluída"
                : "Pronto para conferir"}
            <span>SIMULAÇÃO</span>
          </div>
        </div>
        <div className="demo-result">
          {tour?.stage === "demo" && (
            <div className="demo-guide">
              <span className="guide-beacon" />
              <span>
                {scanning
                  ? "O sistema está conferindo as peças…"
                  : "Sua vez: clique em “Simular identificação” abaixo. A apresentação espera por você."}
              </span>
            </div>
          )}
          <span className="eyebrow">Resultado da conferência</span>
          <h3>
            Do objeto <br />à sua voz.
          </h3>
          <p>
            Uma prévia de como o Beluga transforma a conferência de peças em
            informação acessível.
          </p>
          <div className="result-list" aria-live="polite">
            <div>
              <span>
                <Wrench size={16} /> Alicates
              </span>
              <strong>{scanned ? "02" : "—"}</strong>
            </div>
            <div>
              <span>
                <Hammer size={16} /> Martelos
              </span>
              <strong>{scanned ? "01" : "—"}</strong>
            </div>
            <div className="total">
              <span>Total de peças</span>
              <strong>{scanned ? "03" : "—"}</strong>
            </div>
          </div>
          <div className="demo-actions">
            <div
              className={`demo-action-step ${suggestedAction === "scan" ? "is-suggested" : ""}`}
            >
              {suggestedAction === "scan" && (
                <span className="demo-click-cue">
                  Comece por aqui <ArrowDownRight aria-hidden="true" />
                </span>
              )}
              <Button
                onClick={scan}
                disabled={scanning || playing || (scanned && tour?.active)}
                aria-busy={scanning}
                aria-describedby="demo-action-hint"
                className="w-full demo-action demo-action-scan"
              >
                <ScanLine aria-hidden="true" />
                <span>
                  {scanning
                    ? "Identificando..."
                    : scanned
                      ? "Simular novamente"
                      : "Simular identificação"}
                </span>
                <ArrowUpRight className="ml-auto" aria-hidden="true" />
              </Button>
            </div>
            <div
              className={`demo-action-step ${suggestedAction === "audio" ? "is-suggested" : ""}`}
            >
              {suggestedAction === "audio" && (
                <span className="demo-click-cue">
                  Agora, ouça o resultado <ArrowDownRight aria-hidden="true" />
                </span>
              )}
              <Button
                onClick={speak}
                disabled={!scanned || scanning || playing}
                aria-busy={playing}
                aria-describedby="demo-action-hint"
                className="w-full demo-action demo-action-audio"
              >
                <Volume2 aria-hidden="true" />
                <span>{playing ? "Reproduzindo áudio..." : "Ouvir resultado"}</span>
                <AudioLines className="ml-auto" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <p className="demo-action-hint" id="demo-action-hint">
            {scanning
              ? "Aguarde a conferência das peças."
              : playing
                ? "O resultado está sendo lido em voz alta."
                : scanned
                  ? hasListened
                    ? "Você pode simular novamente quando quiser."
                    : "Conferência concluída. Toque em “Ouvir resultado”."
                  : "Simule a identificação para liberar a leitura do resultado."}
          </p>
          {playing && (
            <Button
              variant="link"
              onClick={() => {
                stopResultAudio();
                setPlaying(false);
                tour?.onAudio(false);
              }}
            >
              Parar áudio
            </Button>
          )}
          {audioError && <p role="status">{audioError}</p>}
          <span className="demo-footnote">
            <AudioLines size={14} /> Exemplo visual, sem acesso à câmera.
            <span
              className={`audio-wave ${playing ? "is-playing" : ""}`}
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
