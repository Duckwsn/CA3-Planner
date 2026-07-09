import { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '../core/errors/ErrorBoundary'
import { ToastContainer } from '../shared/components/Toast'
import { useUIStore } from '../stores/core/uiStore'
import { useAuthStore } from '../stores/core/authStore'
import { publicRoutes, privateRoutes } from './routes'

function PrivateGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function ToastRenderer() {
  const toasts = useUIStore((s) => s.toasts)
  const removeToast = useUIStore((s) => s.removeToast)
  return <ToastContainer toasts={toasts} onDismiss={removeToast} />
}

export default function App() {
  const loadUser = useAuthStore((s) => s.loadUser)

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-page)]">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary-900)] border-t-transparent rounded-[var(--radius-full)]" />
            </div>
          }
        >
          <Routes>
            {publicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            <Route
              path="/*"
              element={
                <PrivateGuard>
                  <Routes>
                    <Route element={privateRoutes.element}>
                      {privateRoutes.children.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                      ))}
                    </Route>
                  </Routes>
                </PrivateGuard>
              }
            />
          </Routes>
        </Suspense>
        <ToastRenderer />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
