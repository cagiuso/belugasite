// Arquivos locais: coloque em public/images e use `${import.meta.env.BASE_URL}images/nome.jpg`.

export const media = {
  team: {
    "Eduarda Mazzari": {
      src: `${import.meta.env.BASE_URL}images/eduarda-foto.png`,
      type: "photo",
    },
    "Guilherme Hideki": {
      src: `${import.meta.env.BASE_URL}images/guilherme-foto.png`,
      type: "photo",
    },
    "Carlos Vicente": {
      src: `${import.meta.env.BASE_URL}images/carlos-foto.png`,
      type: "photo",
    },
    "Henzo Montanari": {
      src: `${import.meta.env.BASE_URL}images/henzo-foto.png`,
      type: "photo",
    },
  },
};

// Links diretos dos perfis, sem os parâmetros de compartilhamento.
export const teamProfiles = {
  "Eduarda Mazzari": {
    github: "https://github.com/eduardaPmazzari",
    linkedin: "https://www.linkedin.com/in/eduarda-mazzari-257316358/",
    instagram: "https://www.instagram.com/duda.mazzari/",
  },
  "Guilherme Hideki": {
    github: "https://github.com/GuilhermeHkp",
    linkedin: "https://www.linkedin.com/in/guilherme-hideki-b28271434/",
    instagram: "https://www.instagram.com/guikodama_/",
  },
  "Carlos Vicente": {
    github: "https://github.com/cagiuso",
    linkedin: "https://www.linkedin.com/in/carlos-eduardo-vicente-934176337/",
    instagram: "https://www.instagram.com/cagiuso2/",
  },
  "Henzo Montanari": {
    github: "https://github.com/henzomr",
    linkedin: "https://www.linkedin.com/in/henzo-montanari-rodrigues-707691447",
    instagram: "https://www.instagram.com/henzo_mr/",
  },
};
