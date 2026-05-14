"use client"

import { useState } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { DataTable } from "./components/data-table"

interface Saldo {
  id: number
  codigo: string
  descripcion: string
  fecha: string
  cantidad: number
  costo_unitario: number
  costo_total: number
}

// Aquí va tu JSON de saldos
const initialSaldosData = [
  { codigo: "001", descripcion: "Producto A", fecha: "2024-05-01", cantidad: 10, costo_unitario: 50, costo_total: 500 },
  { codigo: "002", descripcion: "Producto B", fecha: "2024-05-02", cantidad: 5, costo_unitario: 100, costo_total: 500 },
  { codigo: "003", descripcion: "Producto C", fecha: "2024-05-03", cantidad: 20, costo_unitario: 25, costo_total: 500 },
].map((s, index) => ({ id: index + 1, ...s })) // Generamos IDs automáticos

export default function SaldosPage() {
  const [saldos, setSaldos] = useState<Saldo[]>(initialSaldosData)

  const handleEditSaldo = (saldo: Saldo) => {
    console.log("Editar saldo:", saldo)
  }

  const handleDeleteSaldo = (id: number) => {
    setSaldos(prev => prev.filter(s => s.id !== id))
  }

  return (
    <BaseLayout title="Saldos" description="Gestiona tus saldos">
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-1">
          <DataTable
            saldos={saldos}
            onEdit={handleEditSaldo}
            onDelete={handleDeleteSaldo}
          />
        </div>
      </div>
    </BaseLayout>
  )
}