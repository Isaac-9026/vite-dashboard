"use client"

import { useEffect, useState } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { DataTable, type Producto } from "./components/data-table"
import initialProductosDataJSON from "./data.json"

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface ProductoFormValues {
  empresa_id: number
  codigo: string
  descripcion: string
  codigo_existencia: string
  unidad_medida: string
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProductos = async () => {
  setLoading(true)
  try {
    // Simulamos la carga del archivo JSON local
    setProductos(initialProductosDataJSON)
  } catch (e) {
    console.error("Error cargando productos:", e)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchProductos()
  }, [])

  const handleAddProducto = async (productoData: ProductoFormValues) => {
    try {
      const res = await fetch(`${API}/api/v1/productos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoData)
      })
      if (!res.ok) throw new Error("Error al registrar el producto")
      
      fetchProductos()
    } catch (e) {
      console.error("Error al agregar:", e)
    }
  }

  const handleEditProducto = (producto: Producto) => {
    console.log("Reasignar / Editar producto:", producto)
  }

  const handleEliminarProducto = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este producto? Solo procederá si no cuenta con movimientos registrados en el Kardex.')) return
    try {
      const res = await fetch(`${API}/api/v1/productos/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Error al eliminar el ítem')
      
      fetchProductos()
    } catch (e) {
      console.error("Error al eliminar:", e)
    }
  }

  return (
    <BaseLayout 
      title="Maestro de Productos" 
      description="Catálogo maestro y asignación corporativa de existencias."
    >
      <div className="flex flex-col gap-4 px-4 lg:px-6 mt-4">
        <div className="@container/main mt-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm font-mono">Cargando catálogo...</p>
            </div>
          ) : (
            <DataTable 
              productos={productos}
              onDelete={handleEliminarProducto}
              onEdit={handleEditProducto}
              onAddProducto={handleAddProducto}
            />
          )}
        </div>
      </div>
    </BaseLayout>
  )
}