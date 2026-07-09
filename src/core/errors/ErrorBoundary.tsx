import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, error.stack, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-page)]">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-danger-100)] flex items-center justify-center">
              <span className="text-2xl text-[var(--color-danger-600)]">!</span>
            </div>
            <h2 className="text-size-h5 font-semibold text-[var(--gray-900)] mb-2">
              Algo deu errado
            </h2>
            <p className="text-size-body-small text-[var(--gray-500)] mb-2">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <p className="text-size-caption text-[var(--color-danger-500)] mb-6 font-mono max-w-md mx-auto truncate">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-[var(--radius-md)] bg-[var(--color-primary-900)] text-white text-size-body-small font-medium hover:bg-[var(--color-primary-800)] transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
