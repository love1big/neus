import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PopOutPanelProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export default function PopOutPanel({ children, title, onClose }: PopOutPanelProps) {
  const [externalWindow, setExternalWindow] = useState<Window | null>(null);
  const containerEl = useRef(document.createElement('div'));

  useEffect(() => {
    const win = window.open('', '', 'width=1024,height=768,left=200,top=200');
    if (!win) {
       alert("Pop-up blocker prevented opening a new window. Please allow pop-ups and try again.");
       onClose();
       return;
    }
    
    win.document.title = title;
    // Set some basic dark theme styles
    win.document.body.style.margin = '0';
    win.document.body.style.padding = '0';
    win.document.body.style.backgroundColor = '#0a0a0a';
    win.document.body.style.color = '#c9d1d9';
    win.document.body.style.height = '100vh';
    win.document.body.style.width = '100vw';
    win.document.body.style.overflow = 'hidden';
    
    containerEl.current.style.height = '100%';
    containerEl.current.style.width = '100%';
    containerEl.current.style.display = 'flex';
    containerEl.current.style.flexDirection = 'column';
    
    win.document.body.appendChild(containerEl.current);
    
    // Copy stylesheets
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(styleNode => {
      win.document.head.appendChild(styleNode.cloneNode(true));
    });
    
    const handleBeforeUnload = () => {
      onClose();
    };
    
    win.addEventListener('beforeunload', handleBeforeUnload);
    setExternalWindow(win);
    
    return () => {
      win.removeEventListener('beforeunload', handleBeforeUnload);
      win.close();
    };
  }, [title]);

  if (!externalWindow) {
    return null;
  }

  return createPortal(children, containerEl.current);
}
