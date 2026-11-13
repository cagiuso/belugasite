export const tourScenes = {
  purpose: {
    target: "#projeto",
    title: "Todos avançam juntos.",
    detail: "Conheça o problema que motivou o Beluga e a escolha do projeto.",
    narration:
      "A tecnologia só avança quando todos avançam juntos. Fizemos a aplicação para apoiar a autonomia de pessoas com deficiência visual em tarefas no âmbito do almoxarifado, nas conferências de objetos em diferentes ambientes. O Beluga reconhece as peças em tempo real e transforma o resultado em áudio.",
    duration: 20,
    mobileDuration: 32,
    next: "demo",
    transition: "blocks",
    label: "01 / O propósito",
  },
  demo: {
    target: "#demonstracao",
    title: "Agora é com você.",
    narration:
      "Agora, você pode experimentar uma prévia. Toque em Simular identificação para ver como as peças aparecem na conferência. Esta demonstração é ilustrativa, e você pode fazer o teste no seu tempo.",
    detail:
      "Clique em “Simular identificação” para experimentar a conferência ilustrativa.",
    duration: null,
    next: "result",
    transition: "circle",
    label: "02 / Experimente",
  },
  result: {
    target: "#demonstracao",
    title: "Dois alicates e um martelo.",
    narration:
      "Aqui, a conferência encontrou dois alicates e um martelo, somando três peças. No Beluga, esse resultado chega por áudio para ajudar na conferência. Se quiser ouvir a contagem de novo, é só tocar em Ouvir resultado.",
    detail:
      "A conferência encontrou três peças. Se quiser, ouça o resultado; a apresentação espera o áudio terminar.",
    duration: 12,
    next: "features",
    transition: "dissolve",
    label: "03 / O resultado",
  },
  features: {
    target: "#capacidades",
    title: "Os recursos do sistema.",
    narration:
      "Além de reconhecer as peças em tempo real, o Beluga permite ouvir o resultado, conferir os itens e consultar o estoque. Os perfis de acesso organizam o que cada pessoa pode fazer, enquanto a informação por áudio ajuda a dar mais independência nessa rotina.",
    detail:
      "Áudio, conferência, cadastro e perfis de acesso se conectam para apoiar a autonomia.",
    duration: 24,
    mobileDuration: 32,
    next: "journey",
    transition: "slide",
    label: "04 / A solução",
  },
  journey: {
    target: "#jornada",
    title: "Como chegamos até aqui.",
    narration:
      "O trabalho começou com a pesquisa, as primeiras telas e o banco de dados. Depois, fotografamos as peças e treinamos a detecção com o YOLO. Esse é o modelo de visão computacional que identifica os objetos e mostra onde eles estão na imagem. Conseguir resultados confiáveis exigiu muitos testes. Hoje, o Beluga está concluído e em fase de apresentação.",
    detail: "Da pesquisa e das primeiras telas ao treinamento e à integração.",
    duration: 36,
    next: "final",
    transition: "blocks",
    label: "05 / Nossa jornada",
  },
  final: {
    target: "#encerramento",
    title: "Obrigado por conhecer o Beluga.",
    narration:
      "Esse foi o Beluga, o projeto que desenvolvemos em equipe para apoiar a conferência de peças. Eduarda Mazzari, Guilherme Hideki, Carlos Vicente e Henzo Montanari participaram desse trabalho, das fotos e do código à documentação. Agradecemos por conhecer o nosso projeto.",
    detail:
      "Um projeto de Eduarda Mazzari, Guilherme Hideki, Carlos Vicente e Henzo Montanari, concluído e em fase de apresentação.",
    duration: 10,
    next: "complete",
    transition: "circle",
    label: "06 / O Beluga hoje",
  },
};

export function tourReducer(state, action) {
  if (action.type === "START")
    return {
      ...initialTourState,
      stage: "purpose",
    };
  if (action.type === "EXIT") return initialTourState;
  if (action.type === "PAUSE")
    return {
      ...state,
      paused: !state.paused,
    };
  if (action.type === "SCAN" && state.stage === "demo")
    return {
      ...state,
      scanning: true,
    };
  if (action.type === "RESULT" && state.stage === "demo")
    return {
      ...state,
      stage: "result",
      scanning: false,
    };
  if (action.type === "AUDIO")
    return {
      ...state,
      audio: action.playing,
    };
  if (action.type === "NEXT") {
    // A demonstração precisa do clique antes de mostrar o resultado.
    if (!tourScenes[state.stage] || state.stage === "demo") return state;
    return {
      ...state,
      stage: tourScenes[state.stage].next,
      audio: false,
    };
  }
  return state;
}

export const initialTourState = {
  stage: "idle",
  paused: false,
  scanning: false,
  audio: false,
};

export function getTourScene(stage, width = 1024) {
  const scene = tourScenes[stage];
  return scene
    ? {
        ...scene,
        duration:
          width <= 760 && scene.mobileDuration
            ? scene.mobileDuration
            : scene.duration,
      }
    : undefined;
}
