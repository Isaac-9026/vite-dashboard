"use client"

import { useState } from "react"

import { BaseLayout } from "@/components/layouts/base-layout"

import { DataTable } from "./components/data-table"

import movimientosDataJSON from "./data.json"

interface Movimiento {
  id: number

  codigo: string
  descripcion: string

  fecha: string

  tipo_comprobante: string
  serie: string
  numero: string

  tipo_operacion: string

  ent_cantidad: number
  ent_costo_unit: number
  ent_costo_total: number

  sal_cantidad: number
  sal_costo_unit: number
  sal_costo_total: number

  saldo_cantidad: number
  saldo_costo_unit: number
  saldo_costo_total: number
}

export default function MovimientosPage() {

  // DATA INICIAL
  const [movimientos, setMovimientos] = useState<Movimiento[]>(
    movimientosDataJSON.map((movimiento, index) => ({
      id: index + 1,

      ...movimiento,

      codigo: String(movimiento.codigo),
    }))
  )

  // EDITAR
  const handleEditMovimiento = (
    movimiento: Movimiento
  ) => {
    console.log("Editar movimiento:", movimiento)
  }

  // ELIMINAR
  const handleDeleteMovimiento = (
    id: number
  ) => {
    setMovimientos((prev) =>
      prev.filter((m) => m.id !== id)
    )
  }

  return (
    <BaseLayout
      title="Movimientos Kardex"
      description="Visualización y control de movimientos de inventario procesados desde Excel."
    >
      <div className="flex flex-col gap-4">

        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-1">

          {/* KPIs */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">

            <div className="rounded-2xl border border-slate-800 bg-[#020817] p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Total movimientos
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {movimientos.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
              <p className="text-xs uppercase tracking-widest text-emerald-500">
                Entradas
              </p>

              <h2 className="mt-2 text-3xl font-bold text-emerald-400">
                {
                  movimientos.filter(
                    (m) => m.ent_cantidad > 0
                  ).length
                }
              </h2>
            </div>

            <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-5">
              <p className="text-xs uppercase tracking-widest text-red-500">
                Salidas
              </p>

              <h2 className="mt-2 text-3xl font-bold text-red-400">
                {
                  movimientos.filter(
                    (m) => m.sal_cantidad > 0
                  ).length
                }
              </h2>
            </div>

            <div className="rounded-2xl border border-sky-900/40 bg-sky-950/20 p-5">
              <p className="text-xs uppercase tracking-widest text-sky-500">
                Productos
              </p>

              <h2 className="mt-2 text-3xl font-bold text-sky-400">
                {
                  new Set(
                    movimientos.map(
                      (m) => m.codigo
                    )
                  ).size
                }
              </h2>
            </div>
          </div>

          {/* TABLA */}
          <DataTable
            movimientos={movimientos}
            onDelete={handleDeleteMovimiento}
            onEdit={handleEditMovimiento}
          />
        </div>
      </div>
    </BaseLayout>
  )
}