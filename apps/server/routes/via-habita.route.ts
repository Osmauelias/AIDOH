import { Hono, type Context } from "hono";
import { z } from "zod";
import { apiFailure, apiSuccess } from "@repo/shared/http";
import { DatabaseError, executeSql } from "../_core/db";

export const isPublic = true;
export const viaHabitaRouter = new Hono();

const LeadSchema = z.object({
  nombre: z.string().trim().min(1),
  whatsapp: z.string().trim().min(8),
  email_optional: z.string().trim().optional().default(""),
  ciudad_zona: z.string().trim().min(1),
  motivo_compra: z.string().trim().optional().default(""),
  tipo_inmueble: z.string().trim().optional().default(""),
  etapa_actual: z.string().trim().optional().default(""),
  presupuesto_rango: z.string().trim().optional().default(""),
  tiene_credito: z.string().trim().optional().default(""),
  tipo_credito: z.array(z.string()).optional().default([]),
  credito_individual_o_conyugal: z.string().trim().optional().default(""),
  broker_contactado: z.string().trim().optional().default(""),
  estatus_evaluacion: z.string().trim().optional().default(""),
  bloqueo_principal: z.array(z.string()).optional().default([]),
  miedo_principal: z.string().trim().optional().default(""),
  desarrollos_visitados: z.string().trim().optional().default(""),
  que_no_gusto_otros: z.string().trim().optional().default(""),
  razon_no_compra: z.string().trim().optional().default(""),
  condicion_para_comprar: z.string().trim().optional().default(""),
  comentario_libre: z.string().trim().optional().default(""),
  consent_privacy: z.boolean(),
  consent_whatsapp: z.boolean().optional().default(true),
  utm_source: z.string().trim().optional().default(""),
  utm_medium: z.string().trim().optional().default(""),
  utm_campaign: z.string().trim().optional().default(""),
  utm_content: z.string().trim().optional().default(""),
  utm_term: z.string().trim().optional().default(""),
});

function databaseStatus(error: DatabaseError) {
  return error.status === 503 ? 503 : error.status === 404 ? 404 : 502;
}

function adminAuthorized(c: Context) {
  const adminKey = (c.env as { ADMIN_KEY?: string } | undefined)?.ADMIN_KEY;
  return Boolean(adminKey && c.req.header("X-Admin-Key") === adminKey);
}

function normalizeWhatsapp(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function csv(values: string[]) {
  return values.filter(Boolean).join(", ");
}

function plusOneDayIsoDate() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

async function getOrCreateCampaign(input: z.infer<typeof LeadSchema>) {
  const hasUtm = Boolean(input.utm_source || input.utm_medium || input.utm_campaign || input.utm_content || input.utm_term);
  if (!hasUtm) return null;
  const name = input.utm_campaign || input.utm_source || "landing";
  const result = await executeSql(
    `INSERT INTO campaigns (business_id, name, source, medium, campaign, content, term)
     VALUES (1, ?, ?, ?, ?, ?, ?)`,
    [name, input.utm_source, input.utm_medium, input.utm_campaign, input.utm_content, input.utm_term]
  );
  return Number(result.lastInsertRowid);
}

async function upsertLead(c: Context) {
  const parsed = LeadSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success || !parsed.data.consent_privacy) {
    return c.json(apiFailure("INVALID_INPUT", "Nombre, WhatsApp, ciudad/zona y aviso de privacidad son obligatorios."), 422);
  }

  const input = parsed.data;
  const whatsapp = normalizeWhatsapp(input.whatsapp);
  if (whatsapp.length < 10) {
    return c.json(apiFailure("INVALID_INPUT", "El WhatsApp debe incluir al menos 10 dígitos."), 422);
  }

  try {
    const campaignId = await getOrCreateCampaign(input);
    const existing = await executeSql("SELECT id, external_id FROM leads WHERE whatsapp = ? ORDER BY id DESC LIMIT 1", [whatsapp]);
    const duplicate = existing.rows.length > 0;
    let leadId: number;
    let externalId: string;

    if (duplicate) {
      const row = existing.rows[0] as unknown as { id: number; external_id?: string };
      leadId = Number(row.id);
      externalId = String(row.external_id || `vh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
      await executeSql(
        `UPDATE leads SET campaign_id = ?, nombre = ?, email_optional = ?, ciudad_zona = ?, consent_privacy = ?, consent_whatsapp = ?, updated_at = datetime('now') WHERE id = ?`,
        [campaignId, input.nombre, input.email_optional, input.ciudad_zona, input.consent_privacy ? 1 : 0, input.consent_whatsapp ? 1 : 0, leadId]
      );
    } else {
      externalId = `vh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const inserted = await executeSql(
        `INSERT INTO leads (external_id, business_id, development_id, campaign_id, nombre, whatsapp, email_optional, ciudad_zona, origen, landing_id, consent_privacy, consent_whatsapp, status)
         VALUES (?, 1, 1, ?, ?, ?, ?, ?, 'landing', 'via-habita-v1', ?, ?, 'nuevo')`,
        [externalId, campaignId, input.nombre, whatsapp, input.email_optional, input.ciudad_zona, input.consent_privacy ? 1 : 0, input.consent_whatsapp ? 1 : 0]
      );
      leadId = Number(inserted.lastInsertRowid);
    }

    await executeSql(
      `INSERT INTO lead_profile (lead_id, motivo_compra, tipo_inmueble, etapa_actual, presupuesto_rango, decisores, influencia_pareja, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(lead_id) DO UPDATE SET motivo_compra=excluded.motivo_compra, tipo_inmueble=excluded.tipo_inmueble, etapa_actual=excluded.etapa_actual, presupuesto_rango=excluded.presupuesto_rango, decisores=excluded.decisores, influencia_pareja=excluded.influencia_pareja, updated_at=datetime('now')`,
      [leadId, input.motivo_compra, input.tipo_inmueble, input.etapa_actual, input.presupuesto_rango, input.credito_individual_o_conyugal, input.credito_individual_o_conyugal === "Con pareja" ? 1 : 0]
    );

    await executeSql(
      `INSERT INTO credit_profile (lead_id, tiene_credito, tipo_credito, credito_individual_o_conyugal, broker_contactado, estatus_evaluacion, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(lead_id) DO UPDATE SET tiene_credito=excluded.tiene_credito, tipo_credito=excluded.tipo_credito, credito_individual_o_conyugal=excluded.credito_individual_o_conyugal, broker_contactado=excluded.broker_contactado, estatus_evaluacion=excluded.estatus_evaluacion, updated_at=datetime('now')`,
      [leadId, input.tiene_credito, csv(input.tipo_credito), input.credito_individual_o_conyugal, input.broker_contactado === "Sí" ? 1 : 0, input.estatus_evaluacion]
    );

    await executeSql(
      `INSERT INTO journey_context (lead_id, desarrollos_visitados, que_no_gusto_otros, razon_no_compra, bloqueo_principal, miedo_principal, objecion_actual, condicion_para_comprar, comentario_libre, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(lead_id) DO UPDATE SET desarrollos_visitados=excluded.desarrollos_visitados, que_no_gusto_otros=excluded.que_no_gusto_otros, razon_no_compra=excluded.razon_no_compra, bloqueo_principal=excluded.bloqueo_principal, miedo_principal=excluded.miedo_principal, objecion_actual=excluded.objecion_actual, condicion_para_comprar=excluded.condicion_para_comprar, comentario_libre=excluded.comentario_libre, updated_at=datetime('now')`,
      [leadId, input.desarrollos_visitados, input.que_no_gusto_otros, input.razon_no_compra, csv(input.bloqueo_principal), input.miedo_principal, input.razon_no_compra, input.condicion_para_comprar, input.comentario_libre]
    );

    await executeSql(
      `INSERT INTO follow_up (lead_id, responsable, siguiente_accion, fecha_siguiente_contacto, prioridad, estatus_lead, comentario)
       VALUES (?, 'vendedor', 'Primer contacto', ?, 'alta', 'nuevo', ?)`,
      [leadId, plusOneDayIsoDate(), duplicate ? "Lead duplicado actualizado desde landing" : "Lead creado desde landing"]
    );

    await executeSql("INSERT INTO events (business_id, lead_id, event_type, event_source, metadata_json) VALUES (1, ?, 'form.completed', 'landing', ?)", [leadId, JSON.stringify({ campaign_id: campaignId })]);
    const lifecycleEvent = duplicate ? "lead.updated" : "lead.created";
    await executeSql("INSERT INTO events (business_id, lead_id, event_type, event_source, metadata_json) VALUES (1, ?, ?, 'landing', ?)", [leadId, lifecycleEvent, JSON.stringify({ is_duplicate: duplicate, campaign_id: campaignId })]);

    return c.json({ ok: true, lead_id: leadId, external_id: externalId, is_duplicate: duplicate }, 200);
  } catch (error) {
    if (error instanceof DatabaseError) return c.json(apiFailure(error.code, error.message), databaseStatus(error));
    throw error;
  }
}

async function listLeads(c: Context) {
  if (!adminAuthorized(c)) return c.json(apiFailure("UNAUTHORIZED", "Admin key required"), 401);
  try {
    const result = await executeSql(
      `SELECT l.*, lp.motivo_compra, lp.tipo_inmueble, lp.etapa_actual, lp.presupuesto_rango,
              cp.tiene_credito, cp.tipo_credito, cp.credito_individual_o_conyugal, cp.estatus_evaluacion,
              jc.bloqueo_principal, jc.miedo_principal, jc.razon_no_compra, jc.condicion_para_comprar,
              fu.siguiente_accion, fu.fecha_siguiente_contacto, fu.prioridad
       FROM leads l
       LEFT JOIN lead_profile lp ON lp.lead_id = l.id
       LEFT JOIN credit_profile cp ON cp.lead_id = l.id
       LEFT JOIN journey_context jc ON jc.lead_id = l.id
       LEFT JOIN follow_up fu ON fu.lead_id = l.id
       ORDER BY l.created_at DESC, l.id DESC`
    );
    return c.json(apiSuccess({ leads: result.rows }), 200);
  } catch (error) {
    if (error instanceof DatabaseError) return c.json(apiFailure(error.code, error.message), databaseStatus(error));
    throw error;
  }
}

async function leadSummary(c: Context) {
  const id = c.req.param("id") || "";
  try {
    const result = await executeSql(
      `SELECT l.nombre, lp.motivo_compra, cp.tipo_credito, cp.credito_individual_o_conyugal, jc.razon_no_compra, jc.bloqueo_principal, fu.siguiente_accion, fu.prioridad
       FROM leads l
       LEFT JOIN lead_profile lp ON lp.lead_id = l.id
       LEFT JOIN credit_profile cp ON cp.lead_id = l.id
       LEFT JOIN journey_context jc ON jc.lead_id = l.id
       LEFT JOIN follow_up fu ON fu.lead_id = l.id
       WHERE l.id = ?
       ORDER BY fu.id DESC LIMIT 1`,
      [id]
    );
    if (!result.rows[0]) return c.json(apiFailure("NOT_FOUND", "Lead not found"), 404);
    const row = result.rows[0] as Record<string, string>;
    const credito = [row.tipo_credito, row.credito_individual_o_conyugal].filter(Boolean).join(" + ") || "Por revisar";
    const objecion = row.razon_no_compra || row.bloqueo_principal || "Por aclarar";
    return c.json({
      nombre: row.nombre,
      motivo: row.motivo_compra || "Por definir",
      credito,
      objecion,
      siguiente_accion: row.siguiente_accion || "Primer contacto",
      prioridad: row.prioridad || "alta",
      resumen_vendedor: `${row.nombre} busca ${row.motivo_compra || "casa"}. Crédito: ${credito}. Punto a resolver: ${objecion}. Siguiente acción: ${row.siguiente_accion || "Primer contacto"}.`
    }, 200);
  } catch (error) {
    if (error instanceof DatabaseError) return c.json(apiFailure(error.code, error.message), databaseStatus(error));
    throw error;
  }
}

async function metrics(c: Context) {
  if (!adminAuthorized(c)) return c.json(apiFailure("UNAUTHORIZED", "Admin key required"), 401);
  try {
    const [total, origen, etapa, estudios, pendientes, objeciones] = await Promise.all([
      executeSql("SELECT COUNT(*) as total FROM leads"),
      executeSql("SELECT origen, COUNT(*) as total FROM leads GROUP BY origen"),
      executeSql("SELECT etapa_actual, COUNT(*) as total FROM lead_profile GROUP BY etapa_actual"),
      executeSql("SELECT COUNT(*) as total FROM credit_profile WHERE estatus_evaluacion IN ('En proceso', 'Ya fui evaluado', 'Tengo preautorización')"),
      executeSql("SELECT COUNT(*) as total FROM follow_up WHERE completed_at IS NULL"),
      executeSql("SELECT razon_no_compra, COUNT(*) as total FROM journey_context WHERE razon_no_compra IS NOT NULL AND razon_no_compra <> '' GROUP BY razon_no_compra ORDER BY total DESC LIMIT 5"),
    ]);
    const toMap = (rows: unknown[]) => Object.fromEntries(rows.map((r) => {
      const row = r as Record<string, string | number>;
      return [String(row.origen || row.etapa_actual || "Sin dato"), Number(row.total || 0)];
    }));
    return c.json({
      total_leads: Number((total.rows[0] as { total?: number })?.total || 0),
      leads_por_origen: toMap(origen.rows as unknown[]),
      leads_por_etapa: toMap(etapa.rows as unknown[]),
      estudios_credito: Number((estudios.rows[0] as { total?: number })?.total || 0),
      seguimientos_pendientes: Number((pendientes.rows[0] as { total?: number })?.total || 0),
      objeciones_top: objeciones.rows,
    }, 200);
  } catch (error) {
    if (error instanceof DatabaseError) return c.json(apiFailure(error.code, error.message), databaseStatus(error));
    throw error;
  }
}

viaHabitaRouter.post("/leads", upsertLead);
viaHabitaRouter.get("/leads", listLeads);
viaHabitaRouter.get("/leads/:id/summary", leadSummary);
viaHabitaRouter.get("/metrics", metrics);
