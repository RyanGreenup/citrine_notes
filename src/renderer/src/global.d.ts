interface Window {
  editorControls?: {
    toggleVim: () => void;
    isVimEnabled: () => boolean;
  };
  saveTimeout?: number;
}
