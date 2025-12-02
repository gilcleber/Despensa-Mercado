
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-red-100">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Ops! Algo deu errado.</h1>
            <p className="text-gray-500 mb-6 text-sm">
              Ocorreu um erro inesperado ao carregar o aplicativo.
            </p>
            <div className="bg-gray-100 p-3 rounded mb-6 text-left overflow-auto max-h-32">
                <code className="text-xs text-red-600 font-mono break-all">
                    {this.state.error?.message}
                </code>
            </div>
            <button
              onClick={() => {
                  localStorage.clear(); // Limpa cache se for erro de dados
                  window.location.reload();
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              <RefreshCw size={18} />
              Reiniciar App
            </button>
            <p className="mt-4 text-xs text-gray-400">Isso limpará os dados locais para tentar corrigir.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
