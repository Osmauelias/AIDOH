import { useEffect, useState } from "react";

const heroImage = "/images/aidoh-hero-tech_2.png";

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

type DemoKey = "barberia" | "cafeteria" | "consultorio";

const demoData: Record<DemoKey, {
  label: string;
  clientTitle: string;
  ownerTitle: string;
  messages: Array<{ from: "client" | "aidoh"; text: string }>;
  metrics: Array<{ label: string; value: string; tone?: string }>;
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
      { from: "aidoh", text: "Listo, Miguel. Te esperamos 7:10. Si quieres, agregamos perfilado por +$120." },
    ],
    metrics: [
      { label: "Citas hoy", value: "18" },
      { label: "Respuesta promedio", value: "1m 42s" },
      { label: "No-shows evitados", value: "6" },
      { label: "Ingreso estimado", value: "$14.8k" },
    ],
    contacts: [
      { name: "Miguel R.", need: "Fade + barba", status: "convertido" },
      { name: "Alan C.", need: "Pregunta precio", status: "seguimiento" },
      { name: "Diego P.", need: "Reagenda", status: "nuevo" },
    ],
  },
  cafeteria: {
    label: "Cafetería",
    clientTitle: "Pedido + recurrencia",
    ownerTitle: "Ventas repetibles",
    messages: [
      { from: "client", text: "¿Tienen cold brew y pan dulce hoy?" },
      { from: "aidoh", text: "Sí. Cold brew de la casa y rol de canela. ¿Lo quieres para recoger o mesa?" },
      { from: "client", text: "Para recoger en 20 minutos." },
      { from: "aidoh", text: "Perfecto, Ana. Queda apartado. También te activo recordatorio de promo martes si quieres." },
    ],
    metrics: [
      { label: "Reservas del día", value: "42" },
      { label: "Clientes nuevos", value: "23" },
      { label: "Recompra semanal", value: "31%" },
      { label: "Ingreso estimado", value: "$9.6k" },
    ],
    contacts: [
      { name: "Ana S.", need: "Cold brew", status: "convertido" },
      { name: "Marco L.", need: "Catering 12 pax", status: "seguimiento" },
      { name: "Sofía N.", need: "Menú vegano", status: "nuevo" },
    ],
  },
  consultorio: {
    label: "Consultorio",
    clientTitle: "Perfilado antes de agenda",
    ownerTitle: "Pipeline clínico-comercial",
    messages: [
      { from: "client", text: "Quiero una valoración, ¿cuánto cuesta?" },
      { from: "aidoh", text: "Te ayudo. ¿Es primera vez, seguimiento o procedimiento específico?" },
      { from: "client", text: "Primera vez, busco tratamiento para dolor recurrente." },
      { from: "aidoh", text: "Gracias. Te perfilo con 3 preguntas y te propongo horario con el especialista correcto." },
    ],
    metrics: [
      { label: "Valoraciones", value: "12" },
      { label: "Perfilados completos", value: "84%" },
      { label: "Citas confirmadas", value: "9" },
      { label: "Ingreso estimado", value: "$27.4k" },
    ],
    contacts: [
      { name: "Laura M.", need: "Primera valoración", status: "nuevo" },
      { name: "Héctor G.", need: "Plan integral", status: "seguimiento" },
      { name: "Patricia A.", need: "Control", status: "convertido" },
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
        <a href="#cta" className="rounded-full bg-[var(--green-money)] px-4 py-2 font-heading text-sm font-bold text-[#08110e] transition hover:bg-[var(--electric)] hover:shadow-[0_0_32px_rgba(126,240,195,0.28)]">Hablar con AIDOH</a>
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
            <div className="mb-8 inline-flex rounded-full border border-[var(--electric)]/25 bg-[var(--green-deep)]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--electric)]">Customer journeys que muestran dinero, orden y conversión</div>
            <h1 className="font-heading text-[clamp(3.05rem,10vw,8.8rem)] font-bold leading-[0.88] tracking-[-0.075em] text-[var(--bone)]">
              No necesitas más clientes, necesitas ver qué es lo que te quieren comprar.
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-[var(--steel)] md:text-2xl md:leading-10">Tu problema no siempre es tráfico. Muchas veces el cuello está en seguimiento roto, conversaciones perdidas, filtros flojos, handoffs inexistentes y un negocio dependiente de tu cabeza.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a className="group rounded-full bg-[var(--green-money)] px-7 py-4 text-center font-heading text-base font-bold text-[#07100d] transition hover:bg-[var(--electric)] hover:shadow-[0_0_44px_rgba(126,240,195,0.24)]" href="#cta">Quiero ver cómo ayudarían a mi negocio <span className="inline-block transition group-hover:translate-x-1">→</span></a>
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
          <p className="mb-5 font-heading text-sm font-bold uppercase tracking-[0.25em] text-[var(--electric)]">La mentira del crecimiento sin journey</p>
          <h2 className="font-heading text-4xl font-bold leading-tight tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Más tráfico en un embudo roto solo amplía la fuga.</h2>
          <p className="mt-7 text-xl leading-9 text-[var(--steel)]">Muchos negocios invierten en traer más clientes antes de entender por qué los que ya llegaron no compraron. Más tráfico en un embudo roto solo amplia la fuga.</p>
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
    ["Barbería", "~40%", "de oportunidades perdidas", "Pierdes citas por respuesta tardía. El cliente preguntó, no respondiste en 2 horas y ya fue a otro lado."],
    ["Consultorio", "3x", "más valor si perfilas", "No perfilas. Atiendes a quien llegue, no a quien pueda comprarte más y referirte."],
    ["Cafetería", "31%", "recurrencia recuperable", "Recibes interés pero no creas recurrencia. No tienes sistema para convertir al visitante en cliente fijo."],
  ];
  return <section className="bg-[var(--background)] px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><Reveal><h2 className="max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Escenas donde el dinero se escapa sin hacer ruido.</h2></Reveal><div className="mt-14 grid gap-5 lg:grid-cols-12">{scenes.map((s, i) => <Reveal key={s[0]} delay={i * 110} className={cn("rounded-[2rem] border border-white/10 bg-[var(--surface)] p-7 transition hover:-translate-y-1 hover:border-[var(--electric)]/35", i === 0 && "lg:col-span-5 lg:row-span-2", i === 1 && "lg:col-span-7", i === 2 && "lg:col-span-7")}><div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--electric)]/25 bg-[var(--green-deep)]"><svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-[var(--electric)]" strokeWidth="1.8"><path d="M4 17c4-1 5-4 6-8 1 5 3 8 10 8"/><path d="M4 7h16"/></svg></div><p className="font-heading text-sm uppercase tracking-[0.2em] text-[var(--steel)]">{s[0]}</p><p className="mt-5 font-heading text-6xl font-bold text-[var(--electric)]">{s[1]}</p><p className="mt-1 text-sm uppercase tracking-[0.18em] text-[var(--green-money)]">{s[2]}</p><p className="mt-6 text-lg leading-8 text-[var(--steel)]">{s[3]}</p></Reveal>)}</div></div></section>;
}

export function GoodJourney() {
  const steps = [["Captura", "Cada punto de contacto registrado"], ["Perfilado", "Sabes quién llegó y qué quiere"], ["Seguimiento", "Nadie se pierde entre respuestas y citas"], ["Conversión", "El cierre es un proceso, no suerte"]];
  return <section className="bg-[var(--background)] px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><Reveal><h2 className="font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Qué hace un journey bien diseñado</h2></Reveal><div className="relative mt-16 grid gap-6 md:grid-cols-4"><div className="absolute left-0 right-0 top-10 hidden h-px bg-[var(--electric)]/35 md:block" />{steps.map((step, i) => <Reveal key={step[0]} delay={i * 90} className="relative rounded-[1.6rem] border border-white/10 bg-[var(--surface)] p-6"><div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--electric)]/45 bg-[#0D1117] font-heading text-2xl font-bold text-[var(--electric)]">0{i + 1}</div><h3 className="font-heading text-2xl font-bold text-[var(--bone)]">{step[0]}</h3><p className="mt-3 leading-7 text-[var(--steel)]">{step[1]}</p></Reveal>)}</div></div></section>;
}

export function Capabilities() {
  const items = ["Customer Journey completo|Mapa desde primer contacto hasta recompra.", "CRM operativo ligero|Orden comercial sin software pesado.", "Automatización de seguimiento|Respuestas, recordatorios y próximos pasos claros.", "Lectura de fugas y conversión|Dónde se cae el dinero, no solo dónde entra tráfico.", "Formulación comercial|Ofertas, filtros y mensajes para vender mejor.", "Implementación sin humo|Sistemas ligeros que operan esta semana."];
  return <section className="bg-[var(--surface)] px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><Reveal><h2 className="font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Qué puede construir AIDOH</h2></Reveal><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((item, i) => { const [title, desc] = item.split("|"); return <Reveal key={title} delay={i * 70} className="border-l-2 border-[var(--green-money)] bg-[#0D1117]/66 p-6 transition hover:border-[var(--electric)] hover:bg-[#0D1117]"><h3 className="font-heading text-xl font-bold text-[var(--bone)]">{title}</h3><p className="mt-3 text-[var(--steel)]">{desc}</p></Reveal>; })}</div></div></section>;
}

export function DemoSelector() {
  const [active, setActive] = useState<DemoKey>("barberia");
  const data = demoData[active];
  return <section id="demos" className="bg-[var(--background)] px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><Reveal><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="font-heading text-sm font-bold uppercase tracking-[0.25em] text-[var(--electric)]">Micrositios demo</p><h2 className="mt-4 font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Cliente fluido. Dueño con control.</h2></div><div className="flex rounded-full border border-white/10 bg-[var(--surface)] p-1">{(Object.keys(demoData) as DemoKey[]).map((key) => <button key={key} onClick={() => setActive(key)} className={cn("rounded-full px-4 py-2 font-heading text-sm font-bold transition", active === key ? "bg-[var(--electric)] text-[#07100d]" : "text-[var(--steel)] hover:text-[var(--bone)]")}>{demoData[key].label}</button>)}</div></div></Reveal><div className="mt-12 grid gap-6 lg:grid-cols-2"><Reveal className="rounded-[2rem] border border-white/10 bg-[var(--surface)] p-5 md:p-7"><p className="mb-5 font-heading text-xl font-bold text-[var(--bone)]">Vista del cliente · {data.clientTitle}</p><div className="space-y-4">{data.messages.map((m, i) => <div key={i} className={cn("max-w-[88%] rounded-3xl px-5 py-4 text-sm leading-6", m.from === "client" ? "bg-[#0D1117] text-[var(--steel)]" : "ml-auto bg-[var(--green-deep)] text-[var(--bone)] border border-[var(--electric)]/20")}>{m.text}</div>)}</div><div className="mt-6 rounded-2xl border border-[var(--electric)]/20 bg-[#0D1117] p-4 text-sm text-[var(--electric)]">Siguiente acción: confirmar, perfilar y registrar en CRM.</div></Reveal><Reveal delay={120} className="rounded-[2rem] border border-white/10 bg-[var(--surface)] p-5 md:p-7"><p className="mb-5 font-heading text-xl font-bold text-[var(--bone)]">Vista del dueño · {data.ownerTitle}</p><div className="grid grid-cols-2 gap-3">{data.metrics.map((metric) => <div key={metric.label} className="rounded-2xl bg-[#0D1117] p-4"><p className="text-xs uppercase tracking-[0.15em] text-[var(--steel)]">{metric.label}</p><p className="mt-2 font-heading text-3xl font-bold text-[var(--electric)]">{metric.value}</p></div>)}</div><div className="mt-5 space-y-3">{data.contacts.map((c) => <div key={c.name} className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#0D1117]/70 p-4"><div><p className="font-heading font-bold text-[var(--bone)]">{c.name}</p><p className="text-sm text-[var(--steel)]">{c.need}</p></div><span className="rounded-full border border-[var(--electric)]/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-[var(--electric)]">{c.status}</span></div>)}</div></Reveal></div></div></section>;
}

export function BusinessIntelligence() {
  const metrics = [["Tasa de conversión", "28.7%"], ["Tiempo de respuesta promedio", "3m 18s"], ["Clientes activos", "1,284"], ["Fugas detectadas esta semana", "17"]];
  const rows = [["Seguimiento", "Barbería", "$18.4k"], ["Perfilado", "Consultorio", "$42.0k"], ["Recurrencia", "Cafetería", "$11.7k"]];
  return <section id="bi" className="bg-[var(--background)] px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><Reveal><p className="font-heading text-sm font-bold uppercase tracking-[0.25em] text-[var(--electric)]">Business Intelligence</p><h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Lo que ves cuando ordenas tu negocio</h2></Reveal><div className="mt-12 rounded-[2rem] border border-white/10 bg-[var(--surface)] p-5 md:p-8"><div className="grid gap-4 md:grid-cols-4">{metrics.map((m) => <div key={m[0]} className="rounded-2xl bg-[#0D1117] p-5"><p className="text-sm text-[var(--steel)]">{m[0]}</p><p className="mt-4 font-heading text-4xl font-bold text-[var(--electric)]">{m[1]}</p></div>)}</div><div className="mt-8 overflow-hidden rounded-2xl border border-white/10"><div className="grid grid-cols-3 bg-[#0D1117] p-4 font-heading text-sm uppercase tracking-[0.16em] text-[var(--steel)]"><span>Etapa</span><span>Negocio tipo</span><span>Impacto estimado</span></div>{rows.map((r) => <div key={r.join("")} className="grid grid-cols-3 border-t border-white/8 p-4 text-[var(--bone)]"><span>{r[0]}</span><span className="text-[var(--steel)]">{r[1]}</span><span className="font-heading text-[var(--electric)]">{r[2]}</span></div>)}</div></div></div></section>;
}

export function FinalCta() {
  return <section id="cta" className="bg-[linear-gradient(135deg,#183C34_0%,#0D1117_68%)] px-5 py-24 lg:px-8"><Reveal className="mx-auto max-w-5xl text-center"><p className="font-heading text-sm font-bold uppercase tracking-[0.25em] text-[var(--electric)]">Decisión comercial</p><h2 className="mt-6 font-heading text-5xl font-bold leading-tight tracking-[-0.055em] text-[var(--bone)] md:text-7xl">¿Cuánto dinero te está costando no tener un journey?</h2><div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"><a href="#inicio" className="rounded-full bg-[var(--green-money)] px-7 py-4 font-heading font-bold text-[#07100d] transition hover:bg-[var(--electric)]">Quiero ver cómo ayudarían a mi negocio</a><a href="#journey" className="rounded-full border border-[var(--steel)]/35 px-7 py-4 font-heading font-bold text-[var(--steel)] transition hover:border-[var(--electric)] hover:text-[var(--electric)]">Quiero revisar mi customer journey</a></div><p className="mt-8 text-[var(--steel)]">Sin pitch de ventas. Sin demo de 2 horas. Una conversación honesta.</p></Reveal></section>;
}
