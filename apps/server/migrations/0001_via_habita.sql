-- businesses
CREATE TABLE IF NOT EXISTS businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  external_id TEXT UNIQUE,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO businesses (name, external_id) VALUES ('Vía Habita Pachuca', 'via-habita-pachuca-001');

-- campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER REFERENCES businesses(id),
  name TEXT,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  content TEXT,
  term TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- developments
CREATE TABLE IF NOT EXISTS developments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER REFERENCES businesses(id),
  external_id TEXT UNIQUE,
  name TEXT,
  status TEXT DEFAULT 'active',
  metadata_json TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO developments (business_id, external_id, name) VALUES (1, 'dev-pachuca-001', 'Desarrollo Pachuca');

-- leads
DROP TABLE IF EXISTS leads;
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT UNIQUE,
  business_id INTEGER REFERENCES businesses(id),
  development_id INTEGER REFERENCES developments(id),
  campaign_id INTEGER,
  nombre TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email_optional TEXT,
  ciudad_zona TEXT,
  origen TEXT DEFAULT 'landing',
  landing_id TEXT DEFAULT 'via-habita-v1',
  consent_privacy INTEGER DEFAULT 0,
  consent_whatsapp INTEGER DEFAULT 0,
  status TEXT DEFAULT 'nuevo',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_vh_leads_external_id ON leads (external_id);
CREATE INDEX IF NOT EXISTS idx_vh_leads_whatsapp ON leads (whatsapp);
CREATE INDEX IF NOT EXISTS idx_vh_leads_business ON leads (business_id);

-- lead_profile
CREATE TABLE IF NOT EXISTS lead_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER UNIQUE REFERENCES leads(id),
  motivo_compra TEXT,
  tipo_inmueble TEXT,
  etapa_actual TEXT,
  presupuesto_rango TEXT,
  urgencia_estimada TEXT,
  decisores TEXT,
  influencia_pareja INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- credit_profile
CREATE TABLE IF NOT EXISTS credit_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER UNIQUE REFERENCES leads(id),
  tiene_credito TEXT,
  tipo_credito TEXT,
  credito_individual_o_conyugal TEXT,
  broker_contactado INTEGER DEFAULT 0,
  estatus_evaluacion TEXT,
  documentos_pendientes TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- journey_context
CREATE TABLE IF NOT EXISTS journey_context (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER UNIQUE REFERENCES leads(id),
  desarrollos_visitados TEXT,
  que_gusto_otros TEXT,
  que_no_gusto_otros TEXT,
  razon_no_compra TEXT,
  bloqueo_principal TEXT,
  miedo_principal TEXT,
  objecion_actual TEXT,
  condicion_para_comprar TEXT,
  comentario_libre TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- follow_up
CREATE TABLE IF NOT EXISTS follow_up (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER REFERENCES leads(id),
  responsable TEXT DEFAULT 'vendedor',
  ultima_interaccion TEXT,
  siguiente_accion TEXT,
  fecha_siguiente_contacto TEXT,
  prioridad TEXT DEFAULT 'normal',
  estatus_lead TEXT DEFAULT 'nuevo',
  comentario TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT
);

-- events
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER REFERENCES businesses(id),
  lead_id INTEGER REFERENCES leads(id),
  event_type TEXT NOT NULL,
  event_source TEXT DEFAULT 'landing',
  event_at TEXT DEFAULT (datetime('now')),
  metadata_json TEXT
);
