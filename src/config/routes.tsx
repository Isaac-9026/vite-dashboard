import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Dashboard = lazy(() => import('@/app/dashboard/page'))
const Dashboard2 = lazy(() => import('@/app/dashboard-2/page'))
const Movimientos = lazy(() => import('@/app/movimientos/page'))
const Users = lazy(() => import('@/app/users/page'))

export interface RouteConfig {
  path: string
  element: React.ReactNode
  children?: RouteConfig[]
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Navigate to="dashboard" replace />
  },

  {
    path: "/dashboard",
    element: <Dashboard />
  },

  {
    path: "/dashboard-2",
    element: <Dashboard2 />
  },

  {
    path: "/movimientos",
    element: <Movimientos />
  },

  {
    path: "/users",
    element: <Users />
  },

  {
    path: "*",
    element: <div>404</div>
  }
]