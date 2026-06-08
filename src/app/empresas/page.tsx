"use client"

import { useState } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { DataTable } from "./components/data-table"
import initialEmpresasDataJSON from "./data.json"

interface Empresa {
  id: number 
  codigo: string
  ruc: string // <--- Agregado
  descripcion: string
}

interface EmpresaFormValues {
  codigo: string
  ruc: string // <--- Agregado
  descripcion: string
}

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>(
    initialEmpresasDataJSON.map((empresa, index) => ({
      id: index + 1,
      codigo: String(empresa.codigo),
      ruc: String(empresa.ruc || ""), // <--- Mapeamos el ruc como string seguro
      descripcion: empresa.descripcion
    }))
  )

  const handleAddEmpresa = (empresaData: EmpresaFormValues) => {
    const newEmpresa: Empresa = {
      id: empresas.length > 0 ? Math.max(...empresas.map(e => e.id)) + 1 : 1,
      ...empresaData
    }
    setEmpresas(prev => [newEmpresa, ...prev])
  }

  const handleEditEmpresa = (empresa: Empresa) => {
    console.log("Editar empresa:", empresa)
  }

  const handleDeleteEmpresa = (id: number) => {
    setEmpresas(prev => prev.filter(e => e.id !== id))
  }

  return (
    <BaseLayout 
      title="Empresas" 
      description="Configura los datos de empresa por código de producto."
    >
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-1">
          <DataTable 
            empresas={empresas}
            onDelete={handleDeleteEmpresa}
            onEdit={handleEditEmpresa}
            onAddEmpresa={handleAddEmpresa}
          />
        </div>
      </div>
    </BaseLayout>
  )
}