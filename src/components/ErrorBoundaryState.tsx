import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Atualiza o estado para exibir a interface de fallback em caso de erro
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Você pode registrar o erro em um serviço de monitoramento de erros aqui
    console.error("Erro capturado pelo Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer interface de fallback aqui
      return <h1>Algo deu errado.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
