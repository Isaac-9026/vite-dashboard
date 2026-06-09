import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Dashboard = lazy(() => import('@/app/dashboard/page'))
const Dashboard2 = lazy(() => import('@/app/dashboard-2/page'))
const Movimientos = lazy(() => import('@/app/movimientos/page'))
const Empresas = lazy(() => import('@/app/empresas/page'))
const Saldos = lazy(() => import('@/app/saldos/page'))
const Productos = lazy(() => import('@/app/productos/page'))

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
    path: "/empresas",
    element: <Empresas />
  },

  {
    path: "/saldos",
    element: <Saldos />
  },

  {
    path: "/productos",
    element: <Productos />
  },

  {
    path: "*",
    element: <div>404</div>
  }
]