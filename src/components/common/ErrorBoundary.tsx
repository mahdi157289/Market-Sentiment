import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, message: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  override componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('ErrorBoundary caught', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="glass p-6 m-4 border border-error/30 text-error rounded-xl">
          <h2 className="text-lg font-semibold mb-2">Something went wrong.</h2>
          <p className="text-sm text-white/80">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}


