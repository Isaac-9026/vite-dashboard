"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"

interface HistorialToolbarProps {
  procesamientosLength: number
  allSelected: boolean
  toggleSelectAll: () => void
  hasSelection: boolean
  eliminando: boolean
  selectedCount: number
  onEliminar: () => void
}

export function HistorialToolbar({
  procesamientosLength,
  allSelected,
  toggleSelectAll,
  hasSelection,
  eliminando,
  selectedCount,
  onEliminar,
}: HistorialToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        {procesamientosLength > 0 && (
          <div className="flex items-center space-x-2 bg-muted px-3 py-1.5 rounded-md border">
            <Checkbox
              id="select-all-historial"
              checked={allSelected}
              onCheckedChange={toggleSelectAll}
            />
            <label
              htmlFor="select-all-historial"
              className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground cursor-pointer select-none"
            >
              Seleccionar Todo
            </label>
          </div>
        )}
        {hasSelection && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onEliminar}
            disabled={eliminando}
            className="gap-2 animate-in fade-in zoom-in-95 duration-150"
          >
            <Trash2 className="h-4 w-4" />
            {eliminando ? "Eliminando..." : `Eliminar (${selectedCount})`}
          </Button>
        )}
      </div>

      <Button
        size="sm"
        onClick={() => console.log("Nuevo proceso click")}
        className="gap-2 font-semibold"
      >
        <Plus className="h-4 w-4" /> Nuevo proceso
      </Button>
    </div>
  )
}
