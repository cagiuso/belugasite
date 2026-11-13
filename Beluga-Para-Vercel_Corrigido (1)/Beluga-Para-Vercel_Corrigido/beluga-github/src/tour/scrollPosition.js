// Limita a rolagem ao conteúdo para não parar no espaço abaixo do último card.

export function contentScrollTop(targetElement, contentBoundary, offset = 60) {
  const presentationControls = document.querySelector(".tour-controls");
  const readingHeight = Math.max(
    160,
    innerHeight -
      (presentationControls?.getBoundingClientRect().height || 0) -
      40,
  );
  const targetScrollTop =
    targetElement.getBoundingClientRect().top + window.scrollY - offset;
  const contentBottom =
    contentBoundary.getBoundingClientRect().bottom + window.scrollY;
  return Math.max(0, Math.min(targetScrollTop, contentBottom - readingHeight));
}
