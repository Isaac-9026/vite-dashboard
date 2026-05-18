"use client"

import { useState } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { DataTable } from "./components/data-table"
import { SaldoFormDialog } from "./components/user-form-dialog" //MODAL para agregar saldo
import initialSaldosDataJSON from "./data.json"

interface Saldo {
  id: number 
  codigo: string
  descripcion: string
  fecha: string
  cantidad: number
  costo_unitario: number
  costo_total: number
}

interface SaldoFormValues {
  descripcion: string
  cantidad: number
  costo_unitario: number
  costo_total: number
}

export default function SaldosPage() {
  // Cargamos los datos iniciales del JSON y agregamos ID automático
  const [saldos, setSaldos] = useState<Saldo[]>(
  initialSaldosDataJSON.map((saldo, index) => ({
    id: index + 1,
    ...saldo,
    codigo: String(saldo.codigo)//ahora es string
  }))
)

  const handleAddSaldo = (saldoData: SaldoFormValues) => {
  const newSaldo: Saldo = {
    id: saldos.length > 0 ? Math.max(...saldos.map(s => s.id)) + 1 : 1,
    codigo: saldos.length > 0 ? String(Math.max(...saldos.map(s => Number(s.codigo))) + 1) : "1",
    fecha: new Date().toISOString().split("T")[0],
    ...saldoData
  }
  setSaldos(prev => [newSaldo, ...prev])
}

  const handleEditSaldo = (saldo: Saldo) => {
    console.log("Editar saldo:", saldo)
  }

  const handleDeleteSaldo = (id: number) => {
    setSaldos(prev => prev.filter(s => s.id !== id))
  }

   return (
    <BaseLayout 
      title="Saldos Anteriores" 
      description="Registro de saldos iniciales para iniciar el procesamiento de Excels."
    >
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-1">
         
          <DataTable 
            saldos={saldos}
            onDelete={handleDeleteSaldo}
            onEdit={handleEditSaldo}
            onAddSaldo={handleAddSaldo}
          />
        </div>
      </div>
    </BaseLayout>
  )
}