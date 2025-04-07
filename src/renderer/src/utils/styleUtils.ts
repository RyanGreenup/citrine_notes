/**
 * Creates a style tag with the given CSS content and appends it to the document head
 * @param css The CSS content to add
 * @returns The created style element
 */
export function createStyleTag(css: string): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}
