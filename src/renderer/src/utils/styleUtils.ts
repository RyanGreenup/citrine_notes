/**
 * Creates a style tag with the given CSS content and appends it to the document head.
 * This is used in components like NotePreview to inject custom CSS that overrides
 * third-party styling (e.g., making highlight.js backgrounds transparent in markdown code blocks)
 * without modifying the original library styles.
 * 
 * @param css The CSS content to add
 * @returns The created style element
 */
export function createStyleTag(css: string): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}
