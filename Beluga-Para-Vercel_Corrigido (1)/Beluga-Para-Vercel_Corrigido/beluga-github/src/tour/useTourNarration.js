import { useCallback, useEffect, useRef, useState } from "react";
import { applyNarrationVoice, whenNarrationVoiceReady } from "./narrationVoice";

export function useTourNarration() {
  const speechSupported =
    !!window.speechSynthesis &&
    typeof window.SpeechSynthesisUtterance === "function";
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState("idle");
  const utteranceRef = useRef(null);
  const cancelVoiceWaitRef = useRef(null);
  const speechPausedRef = useRef(false);
  // Remove os callbacks para uma fala cancelada não avançar a apresentação.
  const stop = useCallback(() => {
    cancelVoiceWaitRef.current?.();
    cancelVoiceWaitRef.current = null;
    const utterance = utteranceRef.current;
    utteranceRef.current = null;
    if (utterance) {
      utterance.onend = null;
      utterance.onerror = null;
      window.speechSynthesis?.cancel();
    }
    setStatus("idle");
  }, []);
  const speak = useCallback(
    (text) => {
      stop();
      if (!enabled || !text) return;
      if (
        !window.speechSynthesis ||
        typeof window.SpeechSynthesisUtterance !== "function"
      ) {
        setStatus("unavailable");
        return;
      }
      try {
        const utterance = new window.SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        const finishNarration = (result) => {
          if (utteranceRef.current !== utterance) return;
          utteranceRef.current = null;
          setStatus(result);
        };
        utterance.onend = () => finishNarration("idle");
        utterance.onerror = () => finishNarration("error");
        setStatus("speaking");
        cancelVoiceWaitRef.current = whenNarrationVoiceReady(
          window.speechSynthesis,
          (voice) => {
            if (utteranceRef.current !== utterance) return;
            try {
              applyNarrationVoice(utterance, voice);
              if (window.speechSynthesis.paused)
                window.speechSynthesis.resume?.();
              // Envia o parágrafo inteiro para a voz manter a continuidade da fala.
              window.speechSynthesis.speak(utterance);
              if (speechPausedRef.current) window.speechSynthesis.pause?.();
            } catch {
              finishNarration("error");
            }
          },
        );
      } catch {
        utteranceRef.current = null;
        setStatus("error");
      }
    },
    [enabled, stop],
  );
  const setPaused = useCallback((value) => {
    speechPausedRef.current = value;
    if (!utteranceRef.current) return;
    if (value) window.speechSynthesis?.pause?.();
    else window.speechSynthesis?.resume?.();
  }, []);
  useEffect(() => {
    window.speechSynthesis?.getVoices?.();
  }, []);
  useEffect(
    () => () => {
      cancelVoiceWaitRef.current?.();
      cancelVoiceWaitRef.current = null;
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
        utteranceRef.current = null;
        window.speechSynthesis?.cancel();
      }
    },
    [],
  );
  return {
    enabled,
    setEnabled,
    supported: speechSupported,
    status,
    speak,
    stop,
    setPaused,
    isSpeaking: () => !!utteranceRef.current,
  };
}
