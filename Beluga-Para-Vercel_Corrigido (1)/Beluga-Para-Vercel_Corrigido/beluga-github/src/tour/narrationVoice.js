// Substitua TODO o conteúdo de src/tour/narrationVoice.js por este código.
// A naturalidade depende das vozes disponíveis no navegador e no aparelho.

const normalize = (text = "") =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function selectNarrationVoice(voices = []) {
  const brazilian = voices.filter((voice) => /^pt[-_]br$/i.test(voice.lang));
  const candidates = brazilian.length
    ? brazilian
    : voices.filter((voice) => /^pt(?:[-_]|$)/i.test(voice.lang));

  const priority = (voice) => {
    const name = normalize(`${voice.name || ""} ${voice.voiceURI || ""}`);
    let score = 0;

    // Prioriza a qualidade da voz antes das demais preferências.
    if (/natural|neural|enhanced|premium|aprimorada/.test(name)) score += 300;
    if (/google/.test(name)) score += 150;
    if (/francisca|thalita|luciana|maria|leticia|female|feminina/.test(name))
      score += 40;
    if (voice.default) score += 5;

    return score;
  };

  return [...candidates].sort((a, b) => priority(b) - priority(a))[0];
}

export function applyNarrationVoice(utterance, voice) {
  utterance.lang = voice?.lang || "pt-BR";

  if (voice) utterance.voice = voice;

  // Mantém o tom e o ritmo originais da voz, evitando distorções.
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;

  return utterance;
}

export function whenNarrationVoiceReady(synthesis, ready) {
  const getVoice = () =>
    selectNarrationVoice(synthesis.getVoices?.() || []);

  const availableVoice = getVoice();

  if (availableVoice) {
    ready(availableVoice);
    return () => {};
  }

  let finished = false;
  let timeout;

  const cleanup = () => {
    clearTimeout(timeout);
    synthesis.removeEventListener?.("voiceschanged", handleVoicesChanged);
  };

  const finish = (voice) => {
    if (finished) return;
    finished = true;
    cleanup();
    ready(voice);
  };

  const handleVoicesChanged = () => {
    const voice = getVoice();
    if (voice) finish(voice);
  };

  synthesis.addEventListener?.("voiceschanged", handleVoicesChanged);
  timeout = setTimeout(() => finish(getVoice()), 1500);

  // Confere novamente caso as vozes tenham chegado durante a preparação.
  handleVoicesChanged();

  return () => {
    finished = true;
    cleanup();
  };
}