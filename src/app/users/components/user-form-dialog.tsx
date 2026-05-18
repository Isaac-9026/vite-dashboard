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
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const SaldoFormSchema = z.object({
  codigo: z.string().min(3, {
    message: "Por favor ingrese al menos 3 carácteres.",
  }),
  descripcion: z.string().min(3, {
    message: "Por favor ingrese al menos 3 carácteres.",
  }),
  cantidad: z.number().min(1, {
    message: "Por favor ingrese la cantidad.",
  }),
  costo_unitario: z.number().min(1, {
    message: "Por favor ingrese el costo unitario.",
  }),
  costo_total: z.number().min(1, {
    message: "Por favor, ingrese el saldo total.",
  }),
})

type SaldoFormValues = z.infer<typeof SaldoFormSchema>

interface SaldoFormDialogProps {
  onAddSaldo: (Saldo: SaldoFormValues) => void
}

export function SaldoFormDialog({ onAddSaldo }: SaldoFormDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<SaldoFormValues>({
    resolver: zodResolver(SaldoFormSchema),
    defaultValues: {
      codigo: "",
      descripcion: "",
      cantidad: 0,
      costo_unitario: 0,
      costo_total: 0,
    },
  })

    // Observa cantidad y costoUnitario y actualiza saldoTotal automáticamente
  const cantidad = form.watch("cantidad") || 0
  const costo_unitario = form.watch("costo_unitario") || 0

  useEffect(() => {
    form.setValue("costo_total", cantidad * costo_unitario)
  }, [cantidad, costo_unitario, form])

  function onSubmit(data: SaldoFormValues) {
    onAddSaldo(data)
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Saldo Inicial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo Saldo Inicial</DialogTitle>
          <DialogDescription>
            Agregar un nuevo saldo inicial para iniciar el procesamiento
            correcto de los registros.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa el código del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa el nombre del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
              control={form.control}
              name="cantidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ingrese la cantidad" {...field}onChange={e => field.onChange(parseFloat(e.target.value))}
  value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="costo_unitario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo Unitario</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ingrese el costo unitario" {...field}onChange={e => field.onChange(parseFloat(e.target.value))}
  value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
              control={form.control}
              name="costo_total"
              render={() => (
                <FormItem>
                  <FormLabel>Costo Total</FormLabel>
                  <FormControl>
                    <Input type="number"
                        placeholder="..."
                        value={cantidad * costo_unitario}
                        readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <DialogFooter>
              <Button type="submit" className="cursor-pointer">
                Guardar Saldo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
