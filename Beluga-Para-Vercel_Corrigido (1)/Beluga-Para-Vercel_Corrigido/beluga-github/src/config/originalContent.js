import {
  ScanLine,
  AudioLines,
  Box,
  Mic,
  Layers3,
  ShieldCheck,
} from "lucide-react";

export const navigation = [
  {
    href: "#projeto",
    label: "O projeto",
  },
  {
    href: "#solucao",
    label: "A solução",
  },
  {
    href: "#jornada",
    label: "Desenvolvimento",
  },
  {
    href: "#equipe",
    label: "Equipe",
  },
];

export const features = [
  {
    icon: ScanLine,
    name: "Visão computacional",
    text: "Reconhece e faz a contagem dos produtos em tempo real.",
    highlight: "em tempo real",
  },
  {
    icon: AudioLines,
    name: "Informação por áudio",
    text: "Identifica o nome, o tipo e a quantidade de cada produto.",
  },
  {
    icon: Box,
    name: "Conferência de Produtos",
    text: "Faz a checagem dos produtos comprados pelo cliente.",
  },
  {
    icon: Mic,
    name: "Acessibilidade",
    text: "Auxílio aos colaboradores com deficiência visual, promovendo maior autonomia e reduzindo a dependência de terceiros.",
  },
  {
    icon: Layers3,
    name: "Gestão de estoque",
    text: "Registra os cadastros das peças e as demais informações do estoque.",
  },
  {
    icon: ShieldCheck,
    name: "Perfis de acesso",
    text: "Define o que cada perfil pode consultar e alterar.",
  },
];

export const journey = [
  {
    period: "MAR — ABR",
    title: "Escolha do problema e primeiros rascunhos.",
    text: "Escolhemos o problema, criamos a identidade do Beluga e organizamos os requisitos e os primeiros rascunhos das telas.",
    tags: ["Pesquisa", "Identidade", "Wireframes"],
  },
  {
    period: "MAI — JUN",
    title: "As primeiras telas e o banco de dados.",
    text: "Desenvolvemos as interfaces e o banco de dados. Também começamos os testes de áudio e de integração.",
    tags: ["Interface", "Banco de dados", "Primeiro pitch"],
  },
  {
    period: "JUL — SET",
    title: "Reconhecer bem deu trabalho.",
    text: "Fotografamos e anotamos as peças, treinamos o modelo e testamos a detecção em tempo real. Usamos o YOLO, um modelo de visão computacional que identifica os objetos e indica onde eles estão na imagem. A confiabilidade dos resultados e as decisões sobre esse modelo foram os maiores desafios dessa etapa.",
    tags: ["Detecção em tempo real", "YOLO", "Confiabilidade"],
  },
  {
    period: "OUTUBRO",
    title: "O Beluga ficou pronto.",
    text: "Concluímos a integração entre interface, back-end e banco de dados. Agora estamos apresentando o sistema e contando o que aprendemos, inclusive as dificuldades que tivemos no desenvolvimento.",
    tags: ["Integração", "Testes", "Apresentação"],
  },
];

export const team = [
  {
    initials: "ED",
    name: "Eduarda Mazzari",
    role: "Liderança & Front-end",
    contribution:
      "Cuidou da maior parte da documentação e também trabalhou na liderança e no front-end.",
  },
  {
    initials: "GU",
    name: "Guilherme Hideki",
    role: "Análise & Front-end",
    contribution:
      "Trabalhou na análise e no front-end. Também ajudou a tirar a maior parte das fotos usadas no projeto.",
  },
  {
    initials: "CA",
    name: "Carlos Vicente",
    role: "Full-Stack",
    contribution:
      "Conectou o front-end ao back-end, trabalhou no back-end de forma geral e contribuiu com uma parte do banco de dados.",
  },
  {
    initials: "HE",
    name: "Henzo Montanari",
    role: "Banco de dados & Back-end",
    contribution:
      "Trabalhou no banco de dados e no back-end. Desenvolveu a maior parte da detecção dos objetos.",
  },
];
