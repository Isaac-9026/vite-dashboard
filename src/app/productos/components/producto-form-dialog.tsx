"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface Empresa {
  id: number
  nombre: string
}

// 1. Esquema de Validación Estricto con Zod
const ProductoFormSchema = z.object({
  codigo: z.string().min(1, { message: "El código es obligatorio." }),
  descripcion: z.string().min(3, { message: "Ingrese al menos 3 caracteres." }),
  empresa_id: z.string().min(1, { message: "Debe seleccionar una empresa." }),
  unidad_medida: z.string().default("NIU"),
  codigo_existencia: z.string().default("01"),
})

type ProductoFormValues = z.infer<typeof ProductoFormSchema>

interface ProductoFormDialogProps {
  onAddProducto: (producto: any) => void
}

export function ProductoFormDialog({ onAddProducto }: ProductoFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  // Cargar catálogo de empresas dinámicamente para el Select
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await fetch(`${API}/api/v1/empresa/`)
        if (res.ok) setEmpresas(await res.json())
      } catch (e) {
        console.error("Error al cargar empresas en el modal", e)
      }
    }
    if (open) fetchEmpresas()
  }, [open])

  // 2. Configuración de React Hook Form
  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(ProductoFormSchema),
    defaultValues: {
      codigo: "",
      descripcion: "",
      empresa_id: "",
      unidad_medida: "NIU",
      codigo_existencia: "01",
    },
  })

  function onSubmit(data: ProductoFormValues) {
    // Convertimos el empresa_id a número para que el backend de FastAPI lo reciba correctamente
    onAddProducto({
      ...data,
      empresa_id: Number(data.empresa_id)
    })
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Producto</DialogTitle>
          <DialogDescription>
            Ingrese los datos técnicos y fiscales del producto para el control del Kardex Valorizado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              {/* Campo: Código */}
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. MAT-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo: Empresa Asignada */}
              <FormField
                control={form.control}
                name="empresa_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa Asignada</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Seleccione empresa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {empresas.map((emp) => (
                          <SelectItem key={emp.id} value={String(emp.id)}>
                            {emp.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campo: Descripción */}
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Completa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Cable de Cobre N2XOH 3x10 mm²" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Campo: Unidad de Medida (SUNAT) */}
              <FormField
                control={form.control}
                name="unidad_medida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad de Medida</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Seleccione U.M." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NIU">NIU - Unidades</SelectItem>
                        <SelectItem value="KGM">KGM - Kilogramos</SelectItem>
                        <SelectItem value="MTR">MTR - Metros</SelectItem>
                        <SelectItem value="LT">LT - Litros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo: Tipo de Existencia (Código SUNAT) */}
              <FormField
                control={form.control}
                name="codigo_existencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo Existencia (SUNAT)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Seleccione Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="01">01 - Mercadería</SelectItem>
                        <SelectItem value="02">02 - Materia Prima</SelectItem>
                        <SelectItem value="04">04 - Envases y Embalajes</SelectItem>
                        <SelectItem value="05">05 - Suministros Diversos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" className="w-full cursor-pointer">
                Guardar Producto
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}