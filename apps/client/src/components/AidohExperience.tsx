import { useEffect, useState } from "react";

const heroImage = "/images/aidoh-hero-tech_2.png";

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

type DemoKey = "barberia" | "cafeteria" | "consultorio";

const demoData: Record<DemoKey, {
  label: string;
  clientTitle: string;
  ownerTitle: string;
  messages: Array<{ from: "client" | "aidoh"; text: string }>;
  metrics: Array<{ label: string; value: string }>;
  contacts: Array<{ name: string; need: string; status: string }>;
}> = {
  barberia: {
    label: "Barbería",
    clientTitle: "Reserva de corte + barba",
    ownerTitle: "Control de agenda",
    messages: [
      { from: "client", text: "Hola, ¿tienen lugar hoy para corte y barba?" },
      { from: "aidoh", text: "Sí. Tenemos 5:40 y 7:10 pm. ¿Prefieres fade, clásico o arreglo completo?" },
      { from: "client", text: "Fade y barba. 7:10." },
      { from: "aidoh", text: "Listo, Miguel. Te esperamos a las 7:10. ¿Quieres que te confirme por aquí 1 hora antes?" },
    ],
    metrics: [
      { label: "Citas hoy", value: "18" },
      { label: "Tiempo de respuesta", value: "< 2 min" },
      { label: "Citas sin confirmar", value: "3" },
      { label: "Ingresos del día (demo)", value: "~$8–12k" },
    ],
    contacts: [
      { name: "Miguel R.", need: "Fade + barba", status: "confirmado" },
      { name: "Alan C.", need: "Pregunta precio", status: "seguimiento" },
      { name: "Diego P.", need: "Quiere reagendar", status: "nuevo" },
    ],
  },
  cafeteria: {
    label: "Cafetería",
    clientTitle: "Pedido + recurrencia",
    ownerTitle: "Ventas repetibles",
    messages: [
      { from: "client", text: "¿Tienen cold brew y pan dulce hoy?" },
      { from: "aidoh", text: "Sí. Cold brew de la casa y rol de canela. ¿Lo quieres para recoger o para quedarte?" },
      { from: "client", text: "Para recoger en unos 20 minutos." },
      { from: "aidoh", text: "Listo, Ana. Queda apartado. ¿Quieres que te avise cuando esté listo?" },
    ],
    metrics: [
      { label: "Pedidos del día", value: "42" },
      { label: "Clientes nuevos", value: "~23" },
      { label: "Segunda visita (demo)", value: "en proceso" },
      { label: "Ingresos estimados", value: "demo" },
    ],
    contacts: [
      { name: "Ana S.", need: "Cold brew", status: "convertido" },
      { name: "Marco L.", need: "Catering 12 personas", status: "seguimiento" },
      { name: "Sofía N.", need: "Opciones veganas", status: "nuevo" },
    ],
  },
  consultorio: {
    label: "Consultorio",
    clientTitle: "Perfilado antes de agendar",
    ownerTitle: "Pipeline clínico-comercial",
    messages: [
      { from: "client", text: "Quiero una valoración, ¿cuánto cuesta?" },
      { from: "aidoh", text: "Con gusto te oriento. ¿Es primera vez, seguimiento o buscas algo específico?" },
      { from: "client", text: "Primera vez. Tengo dolor recurrente en rodilla." },
      { from: "aidoh", text: "Entendido. Te hago 2 preguntas rápidas para mandarte con el especialista que te corresponde." },
    ],
    metrics: [
      { label: "Valoraciones hoy", value: "12" },
      { label: "Perfilados completos", value: "9 de 12" },
      { label: "Citas confirmadas", value: "9" },
      { label: "Ingresos estimados", value: "demo" },
    ],
    contacts: [
      { name: "Laura M.", need: "Primera valoración", status: "nuevo" },
      { name: "Héctor G.", need: "Plan de tratamiento", status: "seguimiento" },
      { name: "Patricia A.", need: "Control mensual", status: "confirmado" },
    ],
  },
};

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);
  return <div className={cn("transition-all duration-700 motion-reduce:transition-none", ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0", className)}>{children}</div>;
}

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#0D1117]/78 backdrop-blur-xl">
      {/* @section: navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#inicio" className="font-heading text-2xl font-bold tracking-[0.18em] text-[var(--electric)]">AIDOH</a>
        <div className="hidden items-center gap-8 text-sm text-[var(--steel)] md:flex">
          <a className="transition hover:text-[var(--bone)]" href="#journey">Cómo funciona</a>
          <a className="transition hover:text-[var(--bone)]" href="#demos">Demos</a>
          <a className="transition hover:text-[var(--bone)]" href="#bi">Business Intelligence</a>
        </div>
        <a href="#contacto" className="rounded-full bg-[var(--green-money)] px-4 py-2 font-heading text-sm font-bold text-[#08110e] transition hover:bg-[var(--electric)] hover:shadow-[0_0_32px_rgba(126,240,195,0.28)]">Hablar con AIDOH</a>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative isolate min-h-screen overflow-hidden bg-[var(--background)] px-5 pt-28 lg:px-8">
      {/* @section: hero */}
      <div className="absolute inset-0 -z-20 tech-grid opacity-70" />
      <div className="absolute right-[-12%] top-16 -z-10 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(126,240,195,0.16),transparent_62%)] blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <Reveal>
          <div className="max-w-5xl">
            <div className="mb-8 inline-flex rounded-full border border-[var(--electric)]/25 bg-[var(--green-deep)]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--electric)]">Negocios que venden, pero siguen perdiendo dinero por desorden comercial</div>
            <h1 className="font-heading text-[clamp(2.8rem,8.5vw,7.8rem)] font-bold leading-[0.9] tracking-[-0.065em] text-[var(--bone)]">
              No siempre te faltan clientes. Muchas veces se te están yendo y ni cuenta te estás dando.
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-[var(--steel)] md:text-xl md:leading-9">Si respondes tarde, das seguimiento a medias, dependes de tu memoria o de alguien del equipo para no perder prospectos, no te falta tráfico: te falta orden comercial.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a className="group rounded-full bg-[var(--green-money)] px-7 py-4 text-center font-heading text-base font-bold text-[#07100d] transition hover:bg-[var(--electric)] hover:shadow-[0_0_44px_rgba(126,240,195,0.24)]" href="#contacto">Quiero ver dónde se me está yendo el dinero <span className="inline-block transition group-hover:translate-x-1">→</span></a>
              <a className="rounded-full border border-[var(--steel)]/35 px-7 py-4 text-center font-heading text-base font-bold text-[var(--steel)] transition hover:border-[var(--electric)] hover:text-[var(--electric)]" href="#demos">Ver una demo</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={180} className="relative lg:-mr-20 lg:mt-28">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--electric)]/18 bg-[var(--surface)]/80 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            <img src={heroImage} alt="Textura técnica abstracta de datos para AIDOH" className="h-[24rem] w-full rounded-[1.35rem] object-cover opacity-90 md:h-[34rem]" />
            <div className="absolute bottom-6 left-6 right-6 grid gap-3 rounded-3xl border border-white/10 bg-[#0D1117]/76 p-4 backdrop-blur-md sm:grid-cols-3">
              {["fuga visible", "seguimiento activo", "cierre medible"].map((item, index) => <div key={item} className="border-l border-[var(--electric)]/35 pl-3"><p className="font-heading text-2xl text-[var(--electric)]">0{index + 1}</p><p className="text-xs uppercase tracking-[0.18em] text-[var(--steel)]">{item}</p></div>)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function JourneyLie() {
  const steps = ["Descubrimiento", "Contacto", "Seguimiento", "Conversión", "Recurrencia"];
  return (
    <section id="journey" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-32">
      {/* @section: growth-lie */}
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.85fr_1.15fr]">
        <Reveal>
          <p className="mb-5 font-heading text-sm font-bold uppercase tracking-[0.25em] text-[var(--electric)]">El error más caro del crecimiento</p>
          <h2 className="font-heading text-4xl font-bold leading-tight tracking-[-0.04em] text-[var(--bone)] md:text-5xl">Meter más clientes a un negocio desordenado no arregla nada. Solo hace más grande la fuga.</h2>
          <div className="mt-7 space-y-5 text-xl leading-9 text-[var(--steel)]">
            <p>Muchos negocios creen que su problema es conseguir más gente.</p>
            <p className="font-heading text-2xl font-bold text-[var(--bone)]">No.</p>
            <p>Su problema es que lo poco o mucho que ya llega, se enfría, se olvida, se responde tarde o se atiende sin criterio.</p>
            <p>Cuando la experiencia del cliente está rota, más tráfico no te salva.<br /><span className="text-[var(--bone)]">Solo te hace perder más en grande.</span></p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D1117] p-6 md:p-10">
            <svg viewBox="0 0 900 410" className="h-auto w-full" role="img" aria-label="Embudo con fugas de customer journey">
              <defs><linearGradient id="funnel" x1="0" x2="1"><stop offset="0" stopColor="#7EF0C3" stopOpacity=".22"/><stop offset="1" stopColor="#2E7D61" stopOpacity=".64"/></linearGradient></defs>
              <path d="M65 50 H835 L690 165 H210 Z" fill="url(#funnel)" stroke="#7EF0C3" strokeOpacity=".45"/>
              <path d="M210 175 H690 L585 285 H315 Z" fill="#183C34" stroke="#7EF0C3" strokeOpacity=".35"/>
              <path d="M315 295 H585 L520 370 H380 Z" fill="#2E7D61" fillOpacity=".48" stroke="#7EF0C3" strokeOpacity=".35"/>
              {[150,315,450,585,745].map((x, i) => <g key={x}><circle cx={x} cy={i < 2 ? 116 : i < 4 ? 228 : 331} r="8" fill="#7EF0C3"/><text x={x} y={i < 2 ? 96 : i < 4 ? 208 : 311} textAnchor="middle" fill="#B8C4D6" fontSize="22" fontFamily="Space Grotesk">{steps[i]}</text></g>)}
              {[260,515,665].map((x, i) => <g key={x}><path d={`M${x} ${i === 0 ? 132 : 246} C${x + 20} ${i === 0 ? 175 : 285}, ${x + 65} ${i === 0 ? 174 : 302}, ${x + 82} ${i === 0 ? 218 : 338}`} stroke="#7EF0C3" strokeWidth="3" strokeDasharray="7 9" fill="none"/><text x={x + 92} y={i === 0 ? 226 : 346} fill="#F4F0E8" fontSize="20" fontFamily="Inter">fuga de dinero</text></g>)}
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function LocalScenes() {
  const scenes = [
    ["Barbería", "La gente sí pregunta. El problema es que respondes tarde, no das seguimiento y cuando quieres reaccionar, ya se fue con otra barbería."],
    ["Consultorio", "No todo paciente vale lo mismo. Si no perfilas, mezclas curiosos con buenos casos, saturas agenda y dejas dinero tirado sin darte cuenta."],
    ["Cafetería", "Te visitan una vez, les gustó, pero nunca vuelven. No porque el producto sea malo, sino porque no tienes manera de convertir una visita en recurrencia."],
  ];
  return (
    <section className="bg-[var(--background)] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Escenas donde el dinero se escapa sin hacer ruido.</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {scenes.map((s, i) => (
            <Reveal key={s[0]} delay={i * 110} className={cn("rounded-[2rem] border border-white/10 bg-[var(--surface)] p-7 transition hover:-translate-y-1 hover:border-[var(--electric)]/35", i === 0 && "lg:col-span-5 lg:row-span-2", i === 1 && "lg:col-span-7", i === 2 && "lg:col-span-7")}>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--electric)]/25 bg-[var(--green-deep)]">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-[var(--electric)]" strokeWidth="1.8"><path d="M4 17c4-1 5-4 6-8 1 5 3 8 10 8"/><path d="M4 7h16"/></svg>
              </div>
              <p className="font-heading text-sm uppercase tracking-[0.2em] text-[var(--steel)]">{s[0]}</p>
              <p className="mt-6 text-xl leading-8 text-[var(--steel)]">{s[1]}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GoodJourney() {
  const steps = [
    ["Captura", "Nada se pierde desde el primer contacto."],
    ["Perfilado", "No todos preguntan por lo mismo ni valen lo mismo."],
    ["Seguimiento", "El prospecto no se enfría por olvido o desorden."],
    ["Conversión", "Dejas de vender por suerte y empiezas a vender con proceso."],
  ];
  return (
    <section className="bg-[var(--background)] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Una buena experiencia del cliente no se ve "tecnológica". Se siente como control.</h2>
        </Reveal>
        <div className="relative mt-16 grid gap-6 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-[var(--electric)]/35 md:block" />
          {steps.map((step, i) => (
            <Reveal key={step[0]} delay={i * 90} className="relative rounded-[1.6rem] border border-white/10 bg-[var(--surface)] p-6">
              <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--electric)]/45 bg-[#0D1117] font-heading text-2xl font-bold text-[var(--electric)]">0{i + 1}</div>
              <h3 className="font-heading text-2xl font-bold text-[var(--bone)]">{step[0]}</h3>
              <p className="mt-3 leading-7 text-[var(--steel)]">{step[1]}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Capabilities() {
  const items = [
    ["Customer Journey completo", "Para que sepas qué pasa desde que alguien pregunta hasta que compra o regresa."],
    ["CRM operativo ligero", "Para que tu negocio deje de vivir solo en tu cabeza o en chats perdidos."],
    ["Automatización de seguimiento", "Para que lo importante no se quede sin respuesta, sin recordatorio o sin siguiente paso."],
    ["Lectura de fugas y conversión", "Para que no solo veas cuánta gente llega, sino dónde se te está cayendo el dinero."],
    ["Formulación comercial", "Para que no ofrezcas todo igual a todos."],
    ["Implementación sin humo", "Para que esto empiece a moverse esta semana, no en tres meses."],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">AIDOH no te mete más cosas. Te quita fugas, desorden y puntos ciegos.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, desc], i) => (
            <Reveal key={title} delay={i * 70} className="border-l-2 border-[var(--green-money)] bg-[#0D1117]/66 p-6 transition hover:border-[var(--electric)] hover:bg-[#0D1117]">
              <h3 className="font-heading text-xl font-bold text-[var(--bone)]">{title}</h3>
              <p className="mt-3 text-[var(--steel)]">{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DemoSelector() {
  const [active, setActive] = useState<DemoKey>("barberia");
  const data = demoData[active];
  return (
    <section id="demos" className="bg-[var(--background)] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-[0.25em] text-[var(--electric)]">Micrositios demo</p>
              <h2 className="mt-4 font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Cliente más fluido. Dueño con más control.</h2>
              <p className="mt-4 max-w-2xl text-lg text-[var(--steel)]">No se trata de "verse moderno". Se trata de que el cliente avance más fácil y el dueño deje de operar a ciegas.</p>
            </div>
          </div>
          <p className="mt-8 text-sm text-[var(--steel)]">Elige un ejemplo y mira cómo cambia la experiencia del cliente y la del dueño del negocio.</p>
          <div className="mt-4 flex rounded-full border border-white/10 bg-[var(--surface)] p-1 w-fit">
            {(Object.keys(demoData) as DemoKey[]).map((key) => (
              <button key={key} onClick={() => setActive(key)} className={cn("rounded-full px-4 py-2 font-heading text-sm font-bold transition", active === key ? "bg-[var(--electric)] text-[#07100d]" : "text-[var(--steel)] hover:text-[var(--bone)]")}>{demoData[key].label}</button>
            ))}
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-[2rem] border border-white/10 bg-[var(--surface)] p-5 md:p-7">
            <p className="mb-5 font-heading text-xl font-bold text-[var(--bone)]">Vista del cliente · {data.clientTitle}</p>
            <div className="space-y-4">
              {data.messages.map((m, i) => (
                <div key={i} className={cn("max-w-[88%] rounded-3xl px-5 py-4 text-sm leading-6", m.from === "client" ? "bg-[#0D1117] text-[var(--steel)]" : "ml-auto bg-[var(--green-deep)] text-[var(--bone)] border border-[var(--electric)]/20")}>{m.text}</div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-[var(--electric)]/20 bg-[#0D1117] p-4 text-sm text-[var(--electric)]">Siguiente acción: confirmar, perfilar y registrar en CRM.</div>
          </Reveal>
          <Reveal delay={120} className="rounded-[2rem] border border-white/10 bg-[var(--surface)] p-5 md:p-7">
            <p className="mb-5 font-heading text-xl font-bold text-[var(--bone)]">Vista del dueño · {data.ownerTitle}</p>
            <div className="grid grid-cols-2 gap-3">
              {data.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-[#0D1117] p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--steel)]">{metric.label}</p>
                  <p className="mt-2 font-heading text-3xl font-bold text-[var(--electric)]">{metric.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {data.contacts.map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#0D1117]/70 p-4">
                  <div>
                    <p className="font-heading font-bold text-[var(--bone)]">{c.name}</p>
                    <p className="text-sm text-[var(--steel)]">{c.need}</p>
                  </div>
                  <span className="rounded-full border border-[var(--electric)]/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-[var(--electric)]">{c.status}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function BusinessIntelligence() {
  const metrics = [["Tasa de conversión", "28.7%"], ["Tiempo de respuesta promedio", "3m 18s"], ["Clientes activos", "1,284"], ["Fugas detectadas esta semana", "17"]];
  const rows = [["Seguimiento", "Barbería", "alto impacto"], ["Perfilado", "Consultorio", "alto impacto"], ["Recurrencia", "Cafetería", "impacto moderado"]];
  return (
    <section id="bi" className="bg-[var(--background)] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-heading text-sm font-bold uppercase tracking-[0.25em] text-[var(--electric)]">Lo que empieza a aparecer cuando ordenas tu operación</p>
          <h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Cuando dejas de improvisar, tu negocio empieza a hablar.</h2>
        </Reveal>
        <div className="mt-12 rounded-[2rem] border border-white/10 bg-[var(--surface)] p-5 md:p-8">
          <div className="grid gap-4 md:grid-cols-4">
            {metrics.map((m) => (
              <div key={m[0]} className="rounded-2xl bg-[#0D1117] p-5">
                <p className="text-sm text-[var(--steel)]">{m[0]}</p>
                <p className="mt-4 font-heading text-4xl font-bold text-[var(--electric)]">{m[1]}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-lg leading-8 text-[var(--steel)]">Empiezas a ver qué preguntas se repiten, dónde se cae la gente, qué servicio convierte más, qué cliente vuelve y qué parte del negocio sigue drenando tiempo, dinero o atención.</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-3 bg-[#0D1117] p-4 font-heading text-sm uppercase tracking-[0.16em] text-[var(--steel)]"><span>Etapa</span><span>Negocio tipo</span><span>Nivel de impacto</span></div>
            {rows.map((r) => <div key={r.join("")} className="grid grid-cols-3 border-t border-white/8 p-4 text-[var(--bone)]"><span>{r[0]}</span><span className="text-[var(--steel)]">{r[1]}</span><span className="font-heading text-[var(--electric)]">{r[2]}</span></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

const fugaOptions = [
  "Seguimiento",
  "Respuesta a prospectos",
  "Agenda o citas",
  "Conversión",
  "Recompra",
  "No sé, pero siento desorden",
];

const giroOptions = [
  "Salud y bienestar",
  "Alimentos y bebidas",
  "Belleza y cuidado personal",
  "Servicios profesionales",
  "Comercio local",
  "Educación",
  "Otro",
];

export function FinalCta() {
  const [form, setForm] = useState({ nombre: "", negocio: "", giro: "", whatsapp: "", fuga: "", orden: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contacto" className="bg-[linear-gradient(145deg,#183C34_0%,#0D1117_60%)] px-5 py-24 lg:px-8">
      {/* @section: contact-form */}
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="font-heading text-4xl font-bold leading-tight tracking-[-0.045em] text-[var(--bone)] md:text-6xl">
            Si hoy tu negocio depende de tu memoria, de tus chats o de responder como se pueda, ya te está costando dinero.
          </h2>
          <p className="mt-6 text-xl leading-9 text-[var(--steel)]">No hace falta que llegues con todo resuelto. Solo necesito ver qué tipo de negocio tienes y dónde sientes que más se rompe.</p>
        </Reveal>

        {sent ? (
          <Reveal className="mt-12 rounded-[2rem] border border-[var(--electric)]/25 bg-[var(--surface)] p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--electric)]/40 bg-[var(--green-deep)]">
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-[var(--electric)]" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <p className="font-heading text-2xl font-bold text-[var(--bone)]">Recibido.</p>
            <p className="mt-3 text-[var(--steel)]">Lo reviso y te escribo directo. Sin pitch raro. Sin llamada eterna.</p>
          </Reveal>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-[var(--steel)]" htmlFor="nombre">Nombre</label>
                <input id="nombre" required type="text" placeholder="Tu nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className="w-full rounded-2xl border border-white/12 bg-[var(--surface)] px-5 py-4 text-[var(--bone)] placeholder-[var(--steel)]/50 outline-none transition focus:border-[var(--electric)]/50 focus:ring-2 focus:ring-[var(--electric)]/20" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-[var(--steel)]" htmlFor="negocio">Negocio — ¿cómo se llama o a qué se dedica?</label>
                <input id="negocio" required type="text" placeholder="Nombre o giro del negocio" value={form.negocio} onChange={e => setForm(f => ({ ...f, negocio: e.target.value }))} className="w-full rounded-2xl border border-white/12 bg-[var(--surface)] px-5 py-4 text-[var(--bone)] placeholder-[var(--steel)]/50 outline-none transition focus:border-[var(--electric)]/50 focus:ring-2 focus:ring-[var(--electric)]/20" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-[var(--steel)]" htmlFor="giro">¿En qué mercado estás?</label>
                <select id="giro" required value={form.giro} onChange={e => setForm(f => ({ ...f, giro: e.target.value }))} className="w-full rounded-2xl border border-white/12 bg-[var(--surface)] px-5 py-4 text-[var(--bone)] outline-none transition focus:border-[var(--electric)]/50 focus:ring-2 focus:ring-[var(--electric)]/20 appearance-none">
                  <option value="" disabled>Elige tu mercado</option>
                  {giroOptions.map(g => <option key={g} value={g} className="bg-[var(--surface)]">{g}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-[var(--steel)]" htmlFor="whatsapp">WhatsApp</label>
                <input id="whatsapp" required type="tel" placeholder="+52 55 0000 0000" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} className="w-full rounded-2xl border border-white/12 bg-[var(--surface)] px-5 py-4 text-[var(--bone)] placeholder-[var(--steel)]/50 outline-none transition focus:border-[var(--electric)]/50 focus:ring-2 focus:ring-[var(--electric)]/20" />
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm text-[var(--steel)]">¿Qué sientes que más se te está fugando?</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {fugaOptions.map(opt => (
                  <label key={opt} className={cn("flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition", form.fuga === opt ? "border-[var(--electric)]/50 bg-[var(--green-deep)] text-[var(--bone)]" : "border-white/10 bg-[var(--surface)] text-[var(--steel)] hover:border-[var(--electric)]/25")}>
                    <input type="radio" name="fuga" value={opt} checked={form.fuga === opt} onChange={() => setForm(f => ({ ...f, fuga: opt }))} className="sr-only" />
                    <span className={cn("h-3 w-3 shrink-0 rounded-full border", form.fuga === opt ? "border-[var(--electric)] bg-[var(--electric)]" : "border-[var(--steel)]/40")} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-[var(--steel)]" htmlFor="orden">¿Qué quisieras ordenar primero?</label>
              <textarea id="orden" rows={4} placeholder="Cuéntame en tus palabras, sin formalidades" value={form.orden} onChange={e => setForm(f => ({ ...f, orden: e.target.value }))} className="w-full rounded-2xl border border-white/12 bg-[var(--surface)] px-5 py-4 text-[var(--bone)] placeholder-[var(--steel)]/50 outline-none transition focus:border-[var(--electric)]/50 focus:ring-2 focus:ring-[var(--electric)]/20 resize-none" />
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full rounded-full bg-[var(--green-money)] py-5 font-heading text-lg font-bold text-[#07100d] transition hover:bg-[var(--electric)] hover:shadow-[0_0_44px_rgba(126,240,195,0.24)] md:w-auto md:px-12">
                Quiero revisar mi caso
              </button>
              <p className="mt-4 text-sm text-[var(--steel)]/70">Sin pitch raro. Sin llamada eterna. Solo ver si sí te podemos ayudar.</p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
