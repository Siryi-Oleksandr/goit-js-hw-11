export function smoothPageScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2 - 62,
    behavior: 'smooth',
  });
}

export function up() {
  const top = Math.max(
    document.body.scrollTop,
    document.documentElement.scrollTop
  );
  if (top > 0) {
    window.scrollBy(0, (top + 1) / -10);
    t = setTimeout(up, 20);
  } else clearTimeout(t);
  return false;
}
