import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { SystemWatchdogProvider } from './components/SystemWatchdog';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-6 z-[99999] relative font-mono">
          <div className="max-w-xl w-full bg-[#161b22] border border-[#f85149] rounded-lg p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-[#f85149] mb-3 flex items-center gap-2">
              ⚠️ Application Recovery Mode
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              An unexpected runtime error occurred. You can attempt a soft recovery or reload the studio.
            </p>
            <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded text-[11px] text-[#ff7b72] max-h-48 overflow-auto mb-4 whitespace-pre-wrap">
              {this.state.error?.toString()}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded transition"
              >
                Attempt Soft Recovery
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("omni_activeTool");
                  window.location.reload();
                }}
                className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-gray-300 text-xs font-bold rounded transition"
              >
                Reset Studio & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SystemWatchdogProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </SystemWatchdogProvider>
    </ErrorBoundary>
  </StrictMode>,
);
