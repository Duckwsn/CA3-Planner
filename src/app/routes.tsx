import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { AppLayout } from '../shared/layouts/MainLayout'

const HomePage = lazy(() => import('../modules/home/HomePage'))
const LoginPage = lazy(() => import('../modules/login/LoginPage'))
const RegisterPage = lazy(() => import('../modules/register/RegisterPage'))
const DashboardPage = lazy(() => import('../modules/dashboard/DashboardPage'))
const BoardsPage = lazy(() => import('../modules/boards/BoardsPage'))
const BoardDetailsPage = lazy(() => import('../modules/board-details/BoardDetailsPage'))
const CalendarPage = lazy(() => import('../modules/calendar/CalendarPage'))
const TeamsPage = lazy(() => import('../modules/teams/TeamsPage'))
const ReportsPage = lazy(() => import('../modules/reports/ReportsPage'))
const SettingsPage = lazy(() => import('../modules/settings/SettingsPage'))
const NotFoundPage = lazy(() => import('../modules/not-found/NotFoundPage'))

export const publicRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/registrar', element: <RegisterPage /> },
  { path: '/', element: <HomePage /> },
]

export const privateRoutes = {
  element: <AppLayout />,
  children: [
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    { path: '/dashboard', element: <DashboardPage /> },
    { path: '/boards', element: <BoardsPage /> },
    { path: '/boards/:id', element: <BoardDetailsPage /> },
    { path: '/calendar', element: <CalendarPage /> },
    { path: '/teams', element: <TeamsPage /> },
    { path: '/reports', element: <ReportsPage /> },
    { path: '/settings', element: <SettingsPage /> },
    { path: '*', element: <NotFoundPage /> },
  ],
}
