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

  return (
    <BaseLayout
      title="Movimientos Kardex"
      description="Visualización y control de movimientos de inventario procesados desde Excel."
    >
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-1">
          {/* TABLA */}
          <DataTable movimientos={movimientos} />
        </div>
      </div>
    </BaseLayout>
  )
}
