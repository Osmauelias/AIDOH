import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Logo } from "@/components/ViaHabitaExperience";

type DashboardMetrics = {
  total_leads: number;
  leads_por_origen: Record<string, number>;
  leads_por_etapa: Record<string, number>;
  estudios_credito: number;
  seguimientos_pendientes: number;
  objeciones_top: { razon_no_compra: string; total: number }[];
};

type LeadRow = {
  id: number;
  external_id: string;
  nombre: string;
  whatsapp: string;
  ciudad_zona: string;
  status: string;
  created_at: string;
  motivo_compra?: string;
  etapa_actual?: string;
  presupuesto_rango?: string;
  tiene_credito?: string;
  tipo_credito?: string;
  bloqueo_principal?: string;
  siguiente_accion?: string;
  prioridad?: string;
};

function Navbar({ current }: { current: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(216,200,174,.18)] bg-[#173C43]/95 backdrop-blur-md text-[#F6F3ED]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          <Logo dark />
          <span className="text-sm text-[#D8C8AE]/80">Panel interno</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-[#D8C8AE]">
            Landing
          </Link>
          <span className="rounded-full bg-[#D8C8AE]/20 px-3 py-1 text-xs text-[#D8C8AE]">
            {current}
          </span>
        </div>
      </nav>
    </header>
  );
}

function MetricCard({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: string }) {
  return (
    <div className={`rounded-[1.25rem] border border-[#D8C8AE]/20 p-5 ${accent || "bg-[#173C43]"}`}>
      <p className="text-sm text-[#F6F3ED]/60">{label}</p>
      <p className="mt-2 font-heading text-3xl text-[#F6F3ED]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[#D8C8AE]/70">{sub}</p>}
    </div>
  );
}

function StageBar({ etapa, count, max }: { etapa: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 truncate text-sm text-[#F6F3ED]/80">{etapa || "Sin dato"}</span>
      <div className="flex-1">
        <div className="h-2.5 rounded-full bg-[#D8C8AE]/15">
          <div
            className="h-2.5 rounded-full bg-[#D8C8AE] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="w-8 text-right text-sm font-semibold text-[#F6F3ED]">{count}</span>
    </div>
  );
}

function PriorityBadge({ prioridad }: { prioridad: string }) {
  const styles: Record<string, string> = {
    alta: "bg-[#9B3A3A] text-[#F6D0D0]",
    normal: "bg-[#647D68]/30 text-[#D8C8AE]",
    baja: "bg-[#D8C8AE]/20 text-[#D8C8AE]",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles[prioridad] || styles.normal}`}>
      {prioridad}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    nuevo: "bg-[#D8C8AE] text-[#173C43]",
    contacto: "bg-[#647D68] text-[#F6F3ED]",
    en_proceso: "bg-[#173C43] text-[#D8C8AE] ring-1 ring-[#D8C8AE]/40",
    convertido: "bg-[#2E7D61] text-[#F6F3ED]",
    perdido: "bg-[#9B3A3A] text-[#F6D0D0]",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles[status] || styles.nuevo}`}>
      {status}
    </span>
  );
}

function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filtered = leads.filter((l) => {
    const matchesText = !filter ||
      l.nombre.toLowerCase().includes(filter.toLowerCase()) ||
      l.ciudad_zona.toLowerCase().includes(filter.toLowerCase()) ||
      l.motivo_compra?.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = !statusFilter || l.status === statusFilter;
    return matchesText && matchesStatus;
  });

  const statuses = [...new Set(leads.map((l) => l.status))];

  return (
    <div className="rounded-[1.5rem] border border-[#D8C8AE]/20 bg-[#173C43] p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-heading text-xl text-[#F6F3ED]">Leads</h3>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <input
            type="text"
            placeholder="Buscar nombre, zona, motivo..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-[#D8C8AE]/25 bg-[#0F2A2F] px-3 py-2 text-sm text-[#F6F3ED] placeholder-[#D8C8AE]/40"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#D8C8AE]/25 bg-[#0F2A2F] px-3 py-2 text-sm text-[#F6F3ED]"
          >
            <option value="">Todos los estados</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg bg-[#0F2A2F] p-6 text-center text-sm text-[#D8C8AE]/60">
          No hay leads que mostrar.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D8C8AE]/15 text-left text-xs uppercase tracking-wider text-[#D8C8AE]/60">
                <th className="pb-3 pr-4">Nombre</th>
                <th className="pb-3 pr-4">Zona</th>
                <th className="pb-3 pr-4">Etapa</th>
                <th className="pb-3 pr-4">Presupuesto</th>
                <th className="pb-3 pr-4">Crédito</th>
                <th className="pb-3 pr-4">Siguiente acción</th>
                <th className="pb-3 pr-4">Prioridad</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-[#D8C8AE]/8 hover:bg-[#0F2A2F]/50">
                  <td className="py-3 pr-4 font-medium text-[#F6F3ED]">{lead.nombre}</td>
                  <td className="py-3 pr-4 text-[#D8C8AE]">{lead.ciudad_zona}</td>
                  <td className="py-3 pr-4 text-[#F6F3ED]">{lead.etapa_actual || "—"}</td>
                  <td className="py-3 pr-4 text-[#D8C8AE]">{lead.presupuesto_rango || "—"}</td>
                  <td className="py-3 pr-4 text-[#D8C8AE]">{lead.tipo_credito || lead.tiene_credito || "—"}</td>
                  <td className="py-3 pr-4 text-[#F6F3ED]">{lead.siguiente_accion || "—"}</td>
                  <td className="py-3 pr-4"><PriorityBadge prioridad={lead.prioridad || "normal"} /></td>
                  <td className="py-3"><StatusBadge status={lead.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-[#D8C8AE]/40">
        Mostrando {filtered.length} de {leads.length} leads
      </p>
    </div>
  );
}

function ObjecionesChart({ objeciones, maxTotal }: { objeciones: { razon_no_compra: string; total: number }[]; maxTotal: number }) {
  if (!objeciones.length) return null;
  return (
    <div className="rounded-[1.25rem] border border-[#D8C8AE]/20 bg-[#173C43] p-5">
      <h4 className="mb-4 text-sm font-semibold text-[#D8C8AE]">Objeciones más repetidas</h4>
      <div className="space-y-3">
        {objeciones.map((o) => {
          const pct = maxTotal > 0 ? (o.total / maxTotal) * 100 : 0;
          return (
            <div key={o.razon_no_compra}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-[#F6F3ED]/80">{o.razon_no_compra}</span>
                <span className="text-[#D8C8AE]">{o.total}</span>
              </div>
              <div className="h-2 rounded-full bg-[#D8C8AE]/15">
                <div className="h-2 rounded-full bg-[#9B3A3A]" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ViaHabitaDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [metricsRes, leadsRes] = await Promise.all([
          apiFetch("/via-habita/metrics", { auth: false }),
          apiFetch("/via-habita/leads", { auth: false }),
        ]);

        if (!metricsRes.ok || !leadsRes.ok) {
          setError("No se pudieron cargar los datos del dashboard.");
          return;
        }

        const [metricsData, leadsData] = await Promise.all([
          metricsRes.json() as Promise<DashboardMetrics>,
          leadsRes.json() as Promise<{ leads: LeadRow[] }>,
        ]);

        setMetrics(metricsData);
        setLeads(leadsData.leads || []);
      } catch {
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalLeads = metrics?.total_leads ?? leads.length;
  const etapaEntries = metrics ? Object.entries(metrics.leads_por_etapa) : [];
  const maxEtapa = etapaEntries.reduce((m, [, v]) => Math.max(m, v), 0);
  const maxObjecion = metrics?.objeciones_top?.[0]?.total ?? 0;

  return (
    <main className="min-h-screen bg-[#0F1C1F] text-[#F6F3ED]">
      <Navbar current="Dashboard" />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-[#F6F3ED]">Vía Habita — Panel</h1>
          <p className="mt-1 text-sm text-[#D8C8AE]/70">
            Pachuca, Hidalgo · Última actualización: {new Date().toLocaleString("es-MX")}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8C8AE] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-[1.25rem] border border-[#9B3A3A]/50 bg-[#9B3A3A]/10 p-8 text-center text-[#F6D0D0]">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Metrics row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Total leads"
                value={totalLeads}
                sub="Desde landing"
              />
              <MetricCard
                label="Estudios de crédito"
                value={metrics?.estudios_credito ?? 0}
                sub="En proceso o evaluados"
                accent="bg-[#183C34]"
              />
              <MetricCard
                label="Seguimientos pendientes"
                value={metrics?.seguimientos_pendientes ?? 0}
                sub="Sin completar"
                accent="bg-[#3A2A1A]"
              />
              <MetricCard
                label="Conversiones"
                value={leads.filter((l) => l.status === "convertido").length}
                sub="Leads cerrados"
                accent="bg-[#1A3A2A]"
              />
            </div>

            {/* Stages + Objeciones */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[1.25rem] border border-[#D8C8AE]/20 bg-[#173C43] p-5">
                <h4 className="mb-4 text-sm font-semibold text-[#D8C8AE]">Leads por etapa</h4>
                {etapaEntries.length === 0 ? (
                  <p className="text-sm text-[#D8C8AE]/40">Sin datos de etapa.</p>
                ) : (
                  <div className="space-y-3">
                    {etapaEntries.map(([etapa, count]) => (
                      <StageBar key={etapa} etapa={etapa} count={count} max={maxEtapa} />
                    ))}
                  </div>
                )}
              </div>
              <ObjecionesChart objeciones={metrics?.objeciones_top ?? []} maxTotal={maxObjecion} />
            </div>

            {/* Leads table */}
            <LeadsTable leads={leads} />

            {/* Quick actions */}
            <div className="rounded-[1.25rem] border border-[#D8C8AE]/20 bg-[#173C43] p-5">
              <h4 className="mb-3 text-sm font-semibold text-[#D8C8AE]">Acciones rápidas</h4>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="rounded-full border border-[#D8C8AE]/40 px-4 py-2 text-sm font-semibold text-[#F6F3ED] hover:bg-[#D8C8AE]/10"
                >
                  Ver landing
                </Link>
                <a
                  href={`https://wa.me/525520692645?text=Revisando%20leads%20de%20V%C3%ADa%20Habita`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#647D68]/40 px-4 py-2 text-sm font-semibold text-[#647D68] hover:bg-[#647D68]/10"
                >
                  Contactar asesor
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
