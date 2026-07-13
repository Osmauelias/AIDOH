import { Hono, type Context } from "hono";
import { z } from "zod";
import { apiFailure, apiSuccess } from "@repo/shared/http";
import { DatabaseError, executeSql } from "../_core/db";

export const isPublic = true;
export const leadsRouter = new Hono();

const LeadSchema = z.object({
  nombre: z.string().trim().min(1),
  negocio: z.string().trim().min(1),
  vertical: z.string().trim().min(1),
  whatsapp: z.string().trim().min(1),
  ubicacion_zona: z.string().trim().optional().default(""),
  canal_principal_entrada: z.string().trim().optional().default(""),
  producto_servicio_mas_consumido: z.string().trim().optional().default(""),
  tiene_sistema_automatizado: z.union([z.boolean(), z.string()]).optional().default(false),
  conoce_producto_mas_consumido: z.union([z.boolean(), z.string()]).optional().default(false),
  conoce_habitos_de_compra: z.union([z.boolean(), z.string()]).optional().default(false),
  sabe_por_que_no_regresan: z.union([z.boolean(), z.string()]).optional().default(false),
  tiene_programa_referidos: z.union([z.boolean(), z.string()]).optional().default(false),
  que_quiere_ver_pantalla: z.string().trim().optional().default(""),
  que_quiere_automatizar: z.string().trim().optional().default(""),
  comentarios_libres: z.string().trim().optional().default(""),
  source_page: z.string().trim().optional().default("landing"),
});

function databaseStatus(error: DatabaseError) {
  if (error.status === 503) return 503;
  return 502;
}

function toFlag(value: boolean | string | undefined) {
  if (typeof value === "boolean") return value ? 1 : 0;
  const normalized = String(value ?? "").trim().toLowerCase();
  return ["sí", "si", "yes", "true", "1", "parcialmente", "más o menos", "mas o menos", "estoy pensándolo", "estoy pensandolo"].includes(normalized) ? 1 : 0;
}

async function createLead(c: Context) {
  const parsed = LeadSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ ok: false, error: "MISSING_REQUIRED_FIELDS", message: "Nombre, negocio, giro y WhatsApp son obligatorios." }, 422);
  }

  const lead = parsed.data;
  try {
    const result = await executeSql(
      `INSERT INTO leads (
        nombre,
        negocio,
        vertical,
        whatsapp,
        ubicacion_zona,
        canal_principal_entrada,
        producto_servicio_mas_consumido,
        tiene_sistema_automatizado,
        conoce_producto_mas_consumido,
        conoce_habitos_de_compra,
        sabe_por_que_no_regresan,
        tiene_programa_referidos,
        que_quiere_ver_pantalla,
        que_quiere_automatizar,
        comentarios_libres,
        status,
        source_page
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nuevo', ?)`,
      [
        lead.nombre,
        lead.negocio,
        lead.vertical,
        lead.whatsapp,
        lead.ubicacion_zona,
        lead.canal_principal_entrada,
        lead.producto_servicio_mas_consumido,
        toFlag(lead.tiene_sistema_automatizado),
        toFlag(lead.conoce_producto_mas_consumido),
        toFlag(lead.conoce_habitos_de_compra),
        toFlag(lead.sabe_por_que_no_regresan),
        toFlag(lead.tiene_programa_referidos),
        lead.que_quiere_ver_pantalla,
        lead.que_quiere_automatizar,
        lead.comentarios_libres,
        lead.source_page,
      ]
    );
    return c.json({ ok: true, id: Number(result.lastInsertRowid) }, 200);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return c.json(apiFailure(error.code, error.message), databaseStatus(error));
    }
    throw error;
  }
}

async function listLeads(c: Context) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || c.req.header("X-Admin-Key") !== adminKey) {
    return c.json(apiFailure("UNAUTHORIZED", "Admin key required"), 401);
  }

  try {
    const result = await executeSql("SELECT * FROM leads ORDER BY created_at DESC, id DESC");
    return c.json(apiSuccess({ leads: result.rows }), 200);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return c.json(apiFailure(error.code, error.message), databaseStatus(error));
    }
    throw error;
  }
}

leadsRouter.post("", createLead);
leadsRouter.post("/", createLead);
leadsRouter.get("", listLeads);
leadsRouter.get("/", listLeads);
