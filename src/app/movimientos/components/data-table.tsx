"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Row,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { ChevronDown, Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface Movimiento {
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

  error?: boolean
}

interface DataTableProps {
  movimientos: Movimiento[]
}

const fmtCant = (n: number) =>
  new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(n)

const fmtUnit = (n: number) =>
  new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(n)

const fmtTotal = (n: number) =>
  new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)

export function DataTable({ movimientos }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<Movimiento>[] = [
    { accessorKey: "estado", header: "Est" },
    { accessorKey: "codigo", header: "Código" },
    { accessorKey: "descripcion", header: "Descripción" },

    { accessorKey: "fecha", header: "Fecha" },
    { accessorKey: "tipo_comprobante", header: "Tipo" },
    { accessorKey: "serie", header: "Serie" },
    { accessorKey: "numero", header: "Número" },

    { accessorKey: "tipo_operacion", header: "Operación" },

    { accessorKey: "ent_cantidad", header: "Cant." },
    { accessorKey: "ent_costo_unit", header: "C.Unit" },
    { accessorKey: "ent_costo_total", header: "Total" },

    { accessorKey: "sal_cantidad", header: "Cant." },
    { accessorKey: "sal_costo_unit", header: "C.Unit" },
    { accessorKey: "sal_costo_total", header: "Total" },

    { accessorKey: "saldo_cantidad", header: "Cant." },
    { accessorKey: "saldo_costo_unit", header: "C.Unit" },
    { accessorKey: "saldo_costo_total", header: "Total" },
  ]

  const table = useReactTable({
    data: movimientos,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,

    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <div className="w-full space-y-4">
      {/* TOP BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

          <Input
            placeholder="Buscar movimientos..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" className="cursor-pointer">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild id="column-visibility">
              <Button variant="outline" className="cursor-pointer">
                Columnas
                <ChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border ">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              {/* HEADER GRUPOS */}
              <TableRow>
                <TableHead
                  colSpan={3}
                  className="text-center text-[11px] uppercase tracking-widest text-slate-500"
                >
                  Información
                </TableHead>

                <TableHead
                  colSpan={4}
                  className="text-center text-[11px] uppercase tracking-widest text-sky-400"
                >
                  Comprobante
                </TableHead>

                <TableHead
                  colSpan={1}
                  className="text-center text-[11px] uppercase tracking-widest text-emerald-400"
                >
                  Operación
                </TableHead>

                <TableHead
                  colSpan={3}
                  className="text-center text-[11px] uppercase tracking-widest text-emerald-400"
                >
                  Entradas
                </TableHead>

                <TableHead
                  colSpan={3}
                  className="text-center text-[11px] uppercase tracking-widest text-red-400"
                >
                  Salidas
                </TableHead>

                <TableHead
                  colSpan={3}
                  className="text-center text-[11px] uppercase tracking-widest text-sky-400"
                >
                  Saldo Final
                </TableHead>
              </TableRow>

              {/* SUBHEADERS */}
              <TableRow>
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No hay movimientos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="page-size" className="text-sm font-medium">
            Show
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-20 cursor-pointer" id="page-size">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>

            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2 hidden sm:flex">
            <p className="text-sm font-medium">Page</p>
            <strong className="text-sm">
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
