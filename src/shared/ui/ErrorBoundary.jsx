import React from 'react'

/**
 * Top-level render-error catcher. Without this, any uncaught error in the
 * component tree (a bad prop, a null dereference in lesson content, etc.)
 * crashes React to a blank white screen with zero recovery path — the
 * worst possible error state. Wraps <App /> in main.jsx.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center bg-surface-950">
          <div className="text-6xl" aria-hidden="true">⚠️</div>
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="text-slate-400 text-sm max-w-sm">
            This page hit an unexpected error. Reloading usually fixes it — your
            progress is saved on the server, not in this page.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <button type="button" onClick={() => window.location.reload()} className="btn-primary">
              Reload page
            </button>
            <a href="/" className="btn-secondary">
              Back to home
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
