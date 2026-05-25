"use client"

import { useMemo, useState } from "react"

import { BaseLayout } from "@/components/layouts/base-layout"
import { DataTable } from "./components/data-table"
import { KardexMetricsCards } from "./components/kardex-metrics-cards"
import { KardexToolbar } from "./components/kardex-toolbar"
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
  const [movimientos] = useState<Movimiento[]>(
    movimientosDataJSON.map((movimiento, index) => ({
      id: index + 1,
      ...movimiento,
      codigo: String(movimiento.codigo),
    }))
  )

  const [filtersOpen, setFiltersOpen] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const filteredMovimientos = useMemo(() => {
    return movimientos.filter((movimiento) => {
      const fecha = movimiento.fecha

      const cumpleDesde = !startDate || fecha >= startDate
      const cumpleHasta = !endDate || fecha <= endDate

      return cumpleDesde && cumpleHasta
    })
  }, [movimientos, startDate, endDate])

  const totalRegistros = filteredMovimientos.length

  const totalEntradas = useMemo(() => {
    return filteredMovimientos.reduce(
      (acc, movimiento) => acc + (Number(movimiento.ent_costo_total) || 0),
      0
    )
  }, [filteredMovimientos])

  const totalSalidas = useMemo(() => {
    return filteredMovimientos.reduce(
      (acc, movimiento) => acc + (Number(movimiento.sal_costo_total) || 0),
      0
    )
  }, [filteredMovimientos])

  const saldoFinal = useMemo(() => {
    if (filteredMovimientos.length === 0) return 0
    return Number(filteredMovimientos[filteredMovimientos.length - 1].saldo_costo_total) || 0
  }, [filteredMovimientos])

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    if (filteredMovimientos.length === 0) return

    const headers = [
      "codigo",
      "descripcion",
      "fecha",
      "tipo_comprobante",
      "serie",
      "numero",
      "tipo_operacion",
      "ent_cantidad",
      "ent_costo_unit",
      "ent_costo_total",
      "sal_cantidad",
      "sal_costo_unit",
      "sal_costo_total",
      "saldo_cantidad",
      "saldo_costo_unit",
      "saldo_costo_total",
    ]

    const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`

    const rows = filteredMovimientos.map((movimiento) =>
      [
        movimiento.codigo,
        movimiento.descripcion,
        movimiento.fecha,
        movimiento.tipo_comprobante,
        movimiento.serie,
        movimiento.numero,
        movimiento.tipo_operacion,
        movimiento.ent_cantidad,
        movimiento.ent_costo_unit,
        movimiento.ent_costo_total,
        movimiento.sal_cantidad,
        movimiento.sal_costo_unit,
        movimiento.sal_costo_total,
        movimiento.saldo_cantidad,
        movimiento.saldo_costo_unit,
        movimiento.saldo_costo_total,
      ]
        .map(quote)
        .join(",")
    )

    const csv = [headers.map(quote).join(","), ...rows].join("\n")
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "movimientos_kardex.csv"
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <BaseLayout
      title="Movimientos Kardex"
      description="Visualización y control de movimientos de inventario procesados desde Excel."
    >
      <div className="flex flex-col gap-6">
        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-1 space-y-6">
          <KardexToolbar
            filtersOpen={filtersOpen}
            onToggleFilters={() => setFiltersOpen((value) => !value)}
            onPrint={handlePrint}
            onExport={handleExport}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClearDates={() => {
              setStartDate("")
              setEndDate("")
            }}
          />

          <KardexMetricsCards
            totalRegistros={totalRegistros}
            totalEntradas={totalEntradas}
            totalSalidas={totalSalidas}
            saldoFinal={saldoFinal}
          />

          <DataTable movimientos={filteredMovimientos} />
        </div>
      </div>
    </BaseLayout>
  )
}