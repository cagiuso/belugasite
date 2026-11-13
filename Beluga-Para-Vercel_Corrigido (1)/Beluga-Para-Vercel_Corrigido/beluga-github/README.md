# Beluga

Site de apresentação do projeto, com demonstração ilustrativa, apresentação guiada, equipe e galeria da aplicação.

## Executar

Use Node.js 20.19 ou superior. Na pasta do projeto:

```bash
npm ci
npm run dev
```

## Vercel

Importe a pasta `beluga-github` como raiz. Framework: Vite. Build: `npm run build`. Saída: `dist`.

## Mídia e acessibilidade

As mídias estão em `public/media`; os cards em `src/sections/ApplicationGallery.jsx`. O vídeo mantém a resolução e a duração, foi compactado e está sem áudio. Só é carregado após clicar para assistir e pausa ao sair da área visível ou ocultar a aba.

Os prints ampliados preservam os pixels originais. A galeria aceita teclado, Escape, ampliação e navegação entre telas. Os efeitos mais custosos usam uma política conservadora: celular, economia de dados, redução de movimento e indícios de hardware modesto recebem a imagem estática da logo e dispensam partículas, luz seguindo o cursor e rolagem artificial. Os dados de hardware do navegador são aproximados; desempenho em um aparelho físico de 6 GB ainda precisa ser medido.
