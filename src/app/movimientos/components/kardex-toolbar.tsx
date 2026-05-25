"use client"

import { Download, Filter, Printer, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface KardexToolbarProps {
  filtersOpen: boolean
  onToggleFilters: () => void
  onPrint: () => void
  onExport: () => void
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onClearDates: () => void
}

export function KardexToolbar({
  filtersOpen,
  onToggleFilters,
  onPrint,
  onExport,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearDates,
}: KardexToolbarProps) {
  return (
    <div className="kardex-no-print space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filtersOpen ? "default" : "outline"}
            onClick={onToggleFilters}
            className="cursor-pointer"
          >
            <Filter className="mr-2 size-4" />
            Filtros
          </Button>

          <Button
            variant="outline"
            onClick={onPrint}
            className="cursor-pointer"
          >
            <Printer className="mr-2 size-4" />
            Imprimir
          </Button>

          <Button
            variant="outline"
            onClick={onExport}
            className="cursor-pointer"
          >
            <Download className="mr-2 size-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {filtersOpen && (
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Filtrar movimientos por fecha</CardDescription>
            <CardTitle className="text-base">Rango de fechas</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto]">
            <div className="space-y-2">
              <Label htmlFor="fecha-desde">Desde</Label>
              <Input
                id="fecha-desde"
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha-hasta">Hasta</Label>
              <Input
                id="fecha-hasta"
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button className="w-full cursor-pointer">
                <Filter className="mr-2 size-4" />
                Aplicar
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={onClearDates}
                className="w-full cursor-pointer"
              >
                <X className="mr-2 size-4" />
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
