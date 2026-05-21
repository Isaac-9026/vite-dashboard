"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  ChevronDown,
  Download,
  Pencil,
  Trash2,
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"

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
  onDelete: (id: number) => void
  onEdit: (movimiento: Movimiento) => void
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

export function DataTable({
  movimientos,
  onDelete,
  onEdit,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<Movimiento>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() &&
                "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) =>
              row.toggleSelected(!!value)
            }
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },

    {
      accessorKey: "codigo",
      header: "Código",
      cell: ({ row }) => (
        <span className="font-semibold text-sky-400">
          {row.original.codigo}
        </span>
      ),
    },

    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => (
        <div className="max-w-[250px] truncate text-slate-300">
          {row.original.descripcion}
        </div>
      ),
    },

    {
      accessorKey: "fecha",
      header: "Fecha",
    },

    {
      accessorKey: "tipo_comprobante",
      header: "Tipo",
    },

    {
      accessorKey: "serie",
      header: "Serie",
    },

    {
      accessorKey: "numero",
      header: "Número",
    },

    {
      accessorKey: "tipo_operacion",
      header: "Operación",
      cell: ({ row }) => {
        const tipo = row.original.tipo_operacion

        const esEntrada =
          tipo.toLowerCase().includes("compra")

        return (
          <div
            className={`inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium border
            ${
              esEntrada
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {esEntrada ? (
              <ArrowDownCircle className="size-3.5" />
            ) : (
              <ArrowUpCircle className="size-3.5" />
            )}

            {tipo}
          </div>
        )
      },
    },

    {
      accessorKey: "ent_cantidad",
      header: "Entrada",
      cell: ({ row }) => (
        <div className="text-emerald-400 font-medium text-right">
          {row.original.ent_cantidad > 0
            ? fmtCant(row.original.ent_cantidad)
            : "-"}
        </div>
      ),
    },

    {
      accessorKey: "sal_cantidad",
      header: "Salida",
      cell: ({ row }) => (
        <div className="text-red-400 font-medium text-right">
          {row.original.sal_cantidad > 0
            ? fmtCant(row.original.sal_cantidad)
            : "-"}
        </div>
      ),
    },

    {
      accessorKey: "saldo_cantidad",
      header: "Saldo",
      cell: ({ row }) => (
        <div className="text-sky-300 font-semibold text-right">
          {fmtCant(row.original.saldo_cantidad)}
        </div>
      ),
    },

    {
      accessorKey: "saldo_costo_total",
      header: "Costo Total",
      cell: ({ row }) => (
        <div className="text-right text-slate-300">
          S/.{" "}
          {fmtTotal(row.original.saldo_costo_total)}
        </div>
      ),
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const movimiento = row.original

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-sky-500/10 hover:text-sky-400"
              onClick={() => onEdit(movimiento)}
            >
              <Pencil className="size-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-red-400"
                  onClick={() =>
                    onDelete(movimiento.id)
                  }
                >
                  <Trash2 className="mr-2 size-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: movimientos,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel:
      getFilteredRowModel(),

    onColumnVisibilityChange:
      setColumnVisibility,

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
    <div className="space-y-4">

      {/* TOP BAR */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

          <Input
            placeholder="Buscar movimientos..."
            value={globalFilter}
            onChange={(e) =>
              setGlobalFilter(e.target.value)
            }
            className="pl-9 bg-[#0f172a] border-slate-800 text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-slate-800 bg-[#0f172a]"
              >
                Columnas
                <ChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) =>
                  column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(
                        !!value
                      )
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="border-slate-800 bg-[#0f172a]"
          >
            <Download className="mr-2 size-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#020817]">

        <div className="overflow-auto">
          <Table>

            <TableHeader>

              {/* HEADER GRUPOS */}
              <TableRow className="border-slate-800 bg-[#061120] hover:bg-[#061120]">

                <TableHead
                  colSpan={7}
                  className="h-10 text-center text-[11px] uppercase tracking-widest text-slate-500"
                >
                  Comprobante
                </TableHead>

                <TableHead
                  colSpan={2}
                  className="h-10 text-center text-[11px] uppercase tracking-widest text-emerald-400"
                >
                  Movimientos
                </TableHead>

                <TableHead
                  colSpan={2}
                  className="h-10 text-center text-[11px] uppercase tracking-widest text-sky-400"
                >
                  Saldo
                </TableHead>

                <TableHead />
              </TableRow>

              {table
                .getHeaderGroups()
                .map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-slate-800 bg-[#0b1220] hover:bg-[#0b1220]"
                  >
                    {headerGroup.headers.map(
                      (header) => (
                        <TableHead
                          key={header.id}
                          className="h-11 text-slate-400"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column
                                  .columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(
                  (row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={
                        row.getIsSelected() &&
                        "selected"
                      }
                      className={`
                        border-slate-900
                        hover:bg-sky-500/5
                        ${
                          index % 2 === 0
                            ? "bg-[#020817]"
                            : "bg-[#06101d]"
                        }
                      `}
                    >
                      {row
                        .getVisibleCells()
                        .map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="py-3 text-slate-300"
                          >
                            {flexRender(
                              cell.column.columnDef
                                .cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-slate-500"
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="text-sm text-slate-500">
          {table.getFilteredRowModel().rows.length} movimientos
        </div>

        <div className="flex items-center gap-4">

          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) =>
              table.setPageSize(Number(value))
            }
          >
            <SelectTrigger className="w-24 border-slate-800 bg-[#0f172a]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {[10, 20, 30, 50].map((size) => (
                <SelectItem
                  key={size}
                  value={`${size}`}
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm text-slate-400">
            Página{" "}
            <strong>
              {table.getState().pagination
                .pageIndex + 1}
            </strong>{" "}
            de{" "}
            <strong>
              {table.getPageCount()}
            </strong>
          </div>

          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                table.previousPage()
              }
              disabled={
                !table.getCanPreviousPage()
              }
              className="border-slate-800 bg-[#0f172a]"
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-slate-800 bg-[#0f172a]"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}