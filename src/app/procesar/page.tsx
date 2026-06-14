"use client"

import { useState, useEffect } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Upload,
  Loader2,
  Building2,
  Plus,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react"

interface Empresa {
  id: number
  nombre: string
}

export default function HomePage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [empresaId, setEmpresaId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)

  const [nombreSaldo, setNombreSaldo] = useState<string | null>(null)
  const [nombresMovimientos, setNombresMovimientos] = useState<string[]>([])

  useEffect(() => {
    const empresasSimuladas: Empresa[] = [
      { id: 2, nombre: "Inversiones EPSON S.A.C." },
      { id: 3, nombre: "Distribuidora San Juan" },
      { id: 4, nombre: "Corporación Logística del Sur" },
    ]
    setEmpresas(empresasSimuladas)
  }, [])

  const handleProcesarSimulado = () => {
    if (nombresMovimientos.length === 0) return

    setUploading(true)
    setTimeout(() => {
      alert(
        `¡Plantilla Interactiva!\nKardex procesado con éxito para los archivos seleccionados.`
      )
      setUploading(false)
    }, 1500)
  }

  const listo = nombresMovimientos.length > 0
  const empresaSeleccionada = empresas.find((e) => e.id === empresaId)

  return (
    <BaseLayout
      title="Procesar Kardex"
      description="Importa tus archivos Excel — los productos nuevos se asignan automáticamente."
      actions={
        /* Selector de Empresa Adaptativo */
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider hidden md:inline">
              Empresa
            </span>
          </div>

          <Select
            value={empresaId ? String(empresaId) : "default"}
            onValueChange={(val) =>
              setEmpresaId(val === "default" ? null : Number(val))
            }
          >
            <SelectTrigger className="w-[210px] font-mono text-xs cursor-pointer shadow-sm border-border/60 bg-background hover:bg-muted/40 transition-colors">
              <SelectValue placeholder="⚠️ Sin asignar (default)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="default"
                className="font-mono text-xs text-amber-500 font-medium"
              >
                ⚠️ Sin asignar (default)
              </SelectItem>
              {empresas.map((emp) => (
                <SelectItem
                  key={emp.id}
                  value={String(emp.id)}
                  className="font-mono text-xs"
                >
                  🏢 {emp.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {empresaId && empresaSeleccionada && (
            <Badge
              variant="secondary"
              className="font-mono text-[11px] px-2.5 py-0.5 gap-1.5 animate-in fade-in duration-200 bg-foreground/[0.04] text-foreground border-border/40"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {empresaSeleccionada.nombre}
            </Badge>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-6 p-4 lg:p-6 w-full max-w-5xl mx-auto">
        {/* Zona de Carga de Archivos Avanzada (Dual-Theme Opacity Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tarjeta: Saldos Iniciales (Opcional - Ahora sincronizado a color primary) */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-primary/80 hover:shadow-md hover:border-foreground/10 duration-200">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                >
                  Opcional
                </Badge>
                <CardTitle className="text-base font-semibold mt-2.5 text-foreground/90">
                  Saldos iniciales
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground/80">
                  Stock base al inicio del período
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  alert("Abriendo Modal de Saldo Inicial (Simulado)")
                }
                className="h-8 text-xs font-semibold text-primary border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Manual
              </Button>
            </CardHeader>
            <CardContent>
              <div
                onClick={() =>
                  setNombreSaldo(nombreSaldo ? null : "saldo_inicial_2026.xlsx")
                }
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  nombreSaldo
                    ? "border-primary/40 bg-primary/[0.03]"
                    : "border-muted-foreground/20 bg-background/30 hover:bg-muted/40 hover:border-muted-foreground/40"
                }`}
              >
                <FileSpreadsheet
                  className={`h-8 w-8 mx-auto mb-2 transition-transform duration-200 group-hover:scale-105 ${nombreSaldo ? "text-primary" : "text-muted-foreground/40"}`}
                />
                {nombreSaldo ? (
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-bold text-foreground/90">
                      {nombreSaldo}
                    </p>
                    <p className="text-[10px] text-destructive font-medium hover:underline">
                      Haga clic para remover
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground font-medium">
                    Haga clic para simular subida de{" "}
                    <span className="font-bold text-primary">Saldos</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta: Movimientos (Requerido) */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-primary/80 hover:shadow-md hover:border-foreground/10 duration-200">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                >
                  Requerido
                </Badge>
                <CardTitle className="text-base font-semibold mt-2.5 text-foreground/90">
                  Movimientos
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground/80">
                  Ventas, compras y devoluciones
                </CardDescription>
              </div>
              <div className="p-2 bg-foreground/[0.04] text-foreground/70 rounded-lg border border-border/40">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                onClick={() => {
                  if (nombresMovimientos.length > 0) setNombresMovimientos([])
                  else
                    setNombresMovimientos([
                      "movimientos_mayo.xlsx",
                      "movimientos_junio.xlsx",
                    ])
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  listo
                    ? "border-primary/40 bg-primary/[0.03]"
                    : "border-muted-foreground/20 bg-background/30 hover:bg-muted/40 hover:border-muted-foreground/40"
                }`}
              >
                <Upload
                  className={`h-8 w-8 mx-auto mb-2 transition-transform duration-200 group-hover:scale-105 ${listo ? "text-primary" : "text-muted-foreground/40"}`}
                />
                {listo ? (
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-bold text-primary">
                      {nombresMovimientos.length} archivos cargados
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-xs mx-auto font-mono">
                      {nombresMovimientos.join(", ")}
                    </p>
                    <p className="text-[10px] text-destructive font-medium hover:underline mt-1">
                      Haga clic para limpiar
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground font-medium">
                    Haga clic para simular subida de{" "}
                    <span className="font-bold text-primary">Movimientos</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de Procesamiento Final */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t pt-5 border-dashed border-border/60 mt-2">
          <Button
            size="lg"
            onClick={handleProcesarSimulado}
            disabled={!listo || uploading}
            className="font-semibold gap-2 shadow-sm cursor-pointer w-full sm:w-auto"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Procesar Kardex
              </>
            )}
          </Button>

          {/* Mensaje de validación condicional */}
          {!listo && !uploading && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              Agrega al menos un archivo de movimientos haciendo clic en la
              tarjeta requerida.
            </p>
          )}

          {listo && !uploading && empresaId && (
            <p className="text-xs font-mono text-foreground/90 font-semibold bg-foreground/[0.03] border border-border/40 px-3 py-1.5 rounded-lg animate-in fade-in duration-200">
              &rarr; Los productos nuevos se asignarán a:{" "}
              <span className="underline font-bold text-primary">
                {empresaSeleccionada?.nombre}
              </span>
            </p>
          )}
        </div>
      </div>
    </BaseLayout>
  )
}
