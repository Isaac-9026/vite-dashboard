"use client"

import { useState } from "react"
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
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// 1. Esquema de Validación enfocado en Empresas (con RUC de 11 dígitos)
const EmpresaFormSchema = z.object({
  codigo: z.string().min(1, {
    message: "El código es obligatorio.",
  }),
  ruc: z.string()
    .length(11, { message: "El RUC debe tener exactamente 11 dígitos." })
    .regex(/^\d+$/, { message: "El RUC solo debe contener números." }),
  descripcion: z.string().min(3, {
    message: "Por favor ingrese al menos 3 caracteres para la descripción.",
  }),
})

type EmpresaFormValues = z.infer<typeof EmpresaFormSchema>

interface EmpresaFormDialogProps {
  onAddEmpresa: (empresa: EmpresaFormValues) => void
}

export function EmpresaFormDialog({ onAddEmpresa }: EmpresaFormDialogProps) {
  const [open, setOpen] = useState(false)

  // 2. Inicialización del formulario con los campos de Empresa
  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(EmpresaFormSchema),
    defaultValues: {
      codigo: "",
      ruc: "",
      descripcion: "",
    },
  })

  function onSubmit(data: EmpresaFormValues) {
    onAddEmpresa(data)
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Empresa</DialogTitle>
          <DialogDescription>
            Agrega los datos de la empresa para asociarlos al control de productos en el Kardex.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Campo: Código */}
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. EMP-01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: RUC */}
            <FormField
              control={form.control}
              name="ruc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RUC</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={11}
                      placeholder="Ej. 20123456789"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Descripción / Razón Social */}
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción / Razón Social</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Distribuidora de Alimentos S.A.C."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="submit" className="w-full cursor-pointer">
                Guardar Empresa
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}