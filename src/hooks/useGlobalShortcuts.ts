import { useState, useEffect } from 'react';

export interface ShortcutDef {
  id: string;
  actionName: string;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  isMacro?: boolean;
  macroSequence?: string[];
}

export const defaultShortcuts: ShortcutDef[] = [
  { id: 'CodeEditor', actionName: 'Open Code Editor', key: 'c', ctrl: false, shift: false, alt: false, meta: false },
  { id: 'MapEdit', actionName: 'Open Map Editor', key: 'm', ctrl: false, shift: false, alt: false, meta: false },
  { id: 'UIUXEditor', actionName: 'Open UI/UX Editor', key: 'u', ctrl: false, shift: false, alt: false, meta: false },
  { id: 'AudioMixingConsole', actionName: 'Open Audio Mixing Console', key: 'a', ctrl: false, shift: false, alt: false, meta: false },
  { id: 'VisualScriptEditor', actionName: 'Open Visual Script Editor', key: 'v', ctrl: false, shift: false, alt: false, meta: false },
  { id: 'TextureEditor', actionName: 'Open Texture Editor', key: 't', ctrl: false, shift: false, alt: false, meta: false },
  { id: 'ModelingEditor', actionName: 'Open 3D Modeling Editor', key: '3', ctrl: false, shift: false, alt: false, meta: false },
  { id: 'CinematicSequencerEditor', actionName: 'Open Cinematic Sequencer', key: '3', ctrl: true, shift: true, alt: false, meta: false }, // ctrl+shift+3
];

export function useGlobalShortcuts(setActiveTool: (tool: string) => void) {
  const [shortcuts, setShortcuts] = useState<ShortcutDef[]>(defaultShortcuts);

  useEffect(() => {
    const loadShortcuts = () => {
      const saved = localStorage.getItem('omni_shortcuts');
      if (saved) {
        try {
          setShortcuts(JSON.parse(saved));
        } catch(e) {
          console.error("Failed to parse shortcuts", e);
        }
      } else {
        setShortcuts(defaultShortcuts);
      }
    };

    loadShortcuts();

    window.addEventListener('shortcuts_updated', loadShortcuts);
    return () => window.removeEventListener('shortcuts_updated', loadShortcuts);
  }, []);

  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')) {
        return;
      }
      
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey;
      const shift = e.shiftKey;
      const alt = e.altKey;
      const meta = e.metaKey;

      const matchingShortcut = shortcuts.find(
        (s) => s.key.toLowerCase() === key && s.ctrl === ctrl && s.shift === shift && s.alt === alt && s.meta === meta
      );

      if (matchingShortcut) {
        e.preventDefault();
        
        if (matchingShortcut.isMacro && matchingShortcut.macroSequence) {
          let delay = 0;
          matchingShortcut.macroSequence.forEach((stepId) => {
            setTimeout(() => {
              setActiveTool(stepId);
              window.dispatchEvent(new CustomEvent('switch-tool', { detail: stepId }));
            }, delay);
            delay += 400; // 400ms visual delay between macro steps
          });
        } else {
          setActiveTool(matchingShortcut.id);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [shortcuts, setActiveTool]);

  return shortcuts;
}
