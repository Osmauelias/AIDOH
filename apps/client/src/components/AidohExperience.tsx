import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const heroImage = "/images/aidoh-hero-tech_2.png";
const ownerDashboardImage = "https://skyagent-artifacts.skywork.ai/router/agent/2026-07-14/prod_agent_019f5c82-cbfb-7992-848b-c16b76f6b383/aidoh-owner-dashboard_2_a152243bde9b43a283a5d12a6d6d4c0e.png";

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

type DemoKey = "barberia" | "cafeteria" | "gimnasio" | "casas";

type LeadForm = {
  nombre: string;
  negocio: string;
  vertical: string;
  whatsapp: string;
  ubicacion_zona: string;
  canal_principal_entrada: string;
  producto_servicio_mas_consumido: string;
  tiene_sistema_automatizado: string;
  conoce_producto_mas_consumido: string;
  conoce_habitos_de_compra: string;
  sabe_por_que_no_regresan: string;
  tiene_programa_referidos: string;
  que_quiere_ver_pantalla: string;
  que_quiere_automatizar: string;
  comentarios_libres: string;
};

const demoData: Record<DemoKey, {
  label: string;
  badge?: string;
  clientTitle: string;
  ownerTitle: string;
  scene: string;
  messages: Array<{ from: "client" | "aidoh"; text: string }>;
  metrics: Array<{ label: string; value: string }>;
  contacts: Array<{ name: string; need: string; status: string }>;
}> = {
  barberia: {
    label: "Barbería",
    clientTitle: "Cita sin perder la conversación",
    ownerTitle: "Agenda y recurrencia",
    scene: "La gente sí pregunta. El problema es que respondes tarde, no das seguimiento y cuando quieres reaccionar, ya se fue con otra barbería.",
    messages: [
      { from: "client", text: "Hola, ¿tienen lugar hoy para corte y barba?" },
      { from: "aidoh", text: "Sí. Tenemos 5:40 y 7:10 pm. ¿Prefieres fade, clásico o arreglo completo?" },
      { from: "client", text: "Fade y barba. 7:10." },
      { from: "aidoh", text: "Listo, Miguel. Te confirmo una hora antes y te recuerdo tu próximo mantenimiento." },
    ],
    metrics: [
      { label: "Citas hoy", value: "18" },
      { label: "Seguimientos pendientes", value: "4" },
      { label: "Clientes por reactivar", value: "11" },
      { label: "Conversaciones frías", value: "6" },
    ],
    contacts: [
      { name: "Miguel R.", need: "Fade + barba", status: "confirmado" },
      { name: "Alan C.", need: "Preguntó precio", status: "seguimiento" },
      { name: "Diego P.", need: "Quiere reagendar", status: "nuevo" },
    ],
  },
  cafeteria: {
    label: "Cafetería",
    clientTitle: "Primera visita a recompra",
    ownerTitle: "Hábitos y regreso",
    scene: "Te visitan una vez, les gustó, pero nunca vuelven. No porque el producto sea malo, sino porque no tienes manera de convertir una visita en recurrencia.",
    messages: [
      { from: "client", text: "¿Tienen menú para hoy y mesa para dos?" },
      { from: "aidoh", text: "Sí. Hoy hay cold brew, pan dulce y desayunos. ¿Vienes ahora o quieres reservar?" },
      { from: "client", text: "Vamos en 20 minutos." },
      { from: "aidoh", text: "Listo, Ana. Después te puedo avisar promos o favoritos sin llenarte de mensajes." },
    ],
    metrics: [
      { label: "Visitas registradas", value: "42" },
      { label: "Clientes nuevos", value: "23" },
      { label: "Recompra por activar", value: "9" },
      { label: "Productos más pedidos", value: "3" },
    ],
    contacts: [
      { name: "Ana S.", need: "Mesa + cold brew", status: "convertido" },
      { name: "Marco L.", need: "Catering 12 personas", status: "seguimiento" },
      { name: "Sofía N.", need: "Opciones veganas", status: "nuevo" },
    ],
  },
  gimnasio: {
    label: "Gimnasio",
    clientTitle: "Precio, prueba y permanencia",
    ownerTitle: "Inscripción y retención",
    scene: "Preguntó por WhatsApp. Le mandaron precios. Dijo 'lo checo'. Nadie supo si se frenó por dinero, pena, tiempo o falta de acompañamiento.",
    messages: [
      { from: "client", text: "Hola, ¿cuánto cuesta el plan mensual y qué horarios tienen?" },
      { from: "aidoh", text: "Tenemos mensualidad, prueba y plan de seguimiento. ¿Buscas bajar de peso, verte mejor, rendir más o rehabilitarte?" },
      { from: "client", text: "Mándame precios, lo checo." },
      { from: "aidoh", text: "Te los mando. Mañana te escribo para ver si te frenó precio, horario o si prefieres una prueba." },
    ],
    metrics: [
      { label: "Prospectos del mes", value: "64" },
      { label: "Inscripciones", value: "18" },
      { label: "Reactivación", value: "12" },
      { label: "Seguimiento pendiente", value: "21" },
    ],
    contacts: [
      { name: "Luis T.", need: "Plan mensual", status: "seguimiento" },
      { name: "Fer M.", need: "Clase prueba", status: "nuevo" },
      { name: "Caro A.", need: "Reactivación", status: "pendiente" },
    ],
  },
  casas: {
    label: "Venta de Casas",
    badge: "Próximo embudo completo",
    clientTitle: "Filtro de intención real",
    ownerTitle: "Pipeline inmobiliario inicial",
    scene: "Vio un anuncio, pidió información de una casa, recibió un PDF genérico y nadie volvió a distinguir si buscaba vivir, invertir o usar crédito.",
    messages: [
      { from: "client", text: "Vi el anuncio de la casa. ¿Me mandas información?" },
      { from: "aidoh", text: "Claro. Antes de mandarte todo igual: ¿buscas vivir, invertir o comprar con crédito?" },
      { from: "client", text: "Creo que con crédito. Quiero saber mensualidad." },
      { from: "aidoh", text: "Perfecto. Te mando lo útil para crédito y dejo marcado que necesitas seguimiento de financiamiento." },
    ],
    metrics: [
      { label: "Leads recibidos", value: "37" },
      { label: "Leads calificados", value: "19" },
      { label: "Prospectos activos", value: "11" },
      { label: "Cierres del mes", value: "2" },
    ],
    contacts: [
      { name: "Mariana V.", need: "Crédito", status: "calificado" },
      { name: "Óscar P.", need: "Inversión", status: "seguimiento" },
      { name: "Nadia L.", need: "PDF recibido", status: "frío" },
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
        <a href="#hero" className="font-heading text-2xl font-bold tracking-[0.18em] text-[var(--electric)]">AIDOH</a>
        <div className="hidden items-center gap-8 text-sm text-[var(--steel)] md:flex">
          <a className="transition hover:text-[var(--bone)]" href="#proceso">Cómo funciona</a>
          <a className="transition hover:text-[var(--bone)]" href="#demos">Demos</a>
          <a className="transition hover:text-[var(--bone)]" href="#pricing">Precios</a>
          <a className="transition hover:text-[var(--bone)]" href="#bi">Business Intelligence</a>
        </div>
        <a href="#contacto" className="rounded-full bg-[var(--green-money)] px-4 py-2 font-heading text-sm font-bold text-[#08110e] transition hover:bg-[var(--electric)] hover:shadow-[0_0_32px_rgba(126,240,195,0.28)]">Hablar con AIDOH</a>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section id="hero" className="relative isolate min-h-screen overflow-hidden bg-[var(--background)] px-5 pt-28 lg:px-8">
      {/* @section: hero */}
      <div className="absolute inset-0 -z-20 tech-grid opacity-70" />
      <div className="absolute right-[-12%] top-16 -z-10 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(126,240,195,0.16),transparent_62%)] blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <Reveal>
          <div className="max-w-5xl">
            <div className="mb-8 inline-flex rounded-full border border-[var(--electric)]/25 bg-[var(--green-deep)]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--electric)]">Sistema de recorrido comercial para negocios reales</div>
            <h1 className="font-heading text-[clamp(2.8rem,8.5vw,7.8rem)] font-bold leading-[0.9] tracking-[-0.065em] text-[var(--bone)]">
              No necesitas más prospectos para perder más dinero.
            </h1>
            <div className="mt-8 max-w-3xl space-y-3 text-lg leading-8 text-[var(--steel)] md:text-xl md:leading-9">
              <p>Alguien pregunta por WhatsApp.</p>
              <p>Le responden dos horas después. Otro vendedor vuelve a pedirle los mismos datos. Nadie sabe si quería precio, cita o comprar esta semana.</p>
              <p>Tres días después ya no contesta. Y el negocio concluye que necesita más publicidad.</p>
              <p className="font-heading text-2xl font-bold text-[var(--bone)]">No.</p>
              <p>Necesita dejar de perder gente entre una conversación y la siguiente.</p>
            </div>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--bone)]/88">AIDOH ordena el camino completo del cliente. Desde que pregunta. Hasta que compra, regresa o deja claro por qué no avanzó. Sin meter tecnología porque sí. Sin convertir tu negocio en una cabina de avión.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a className="group rounded-full bg-[var(--green-money)] px-7 py-4 text-center font-heading text-base font-bold text-[#07100d] transition hover:bg-[var(--electric)] hover:shadow-[0_0_44px_rgba(126,240,195,0.24)]" href="#contacto">Quiero encontrar mi fuga comercial <span className="inline-block transition group-hover:translate-x-1">→</span></a>
              <a className="rounded-full border border-[var(--steel)]/35 px-7 py-4 text-center font-heading text-base font-bold text-[var(--steel)] transition hover:border-[var(--electric)] hover:text-[var(--electric)]" href="#proceso">Ver cómo funciona</a>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--steel)]/75">Revisamos cómo llegan, avanzan y se pierden hoy tus prospectos. Sales con un mapa inicial, aunque no trabajemos juntos.</p>
          </div>
        </Reveal>
        <Reveal delay={180} className="relative lg:-mr-20 lg:mt-28">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--electric)]/18 bg-[var(--surface)]/80 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            <img src={heroImage} alt="Textura técnica abstracta de datos para AIDOH" className="h-[24rem] w-full rounded-[1.35rem] object-cover opacity-90 md:h-[34rem]" />
            <div className="absolute bottom-6 left-6 right-6 grid gap-3 rounded-3xl border border-white/10 bg-[#0D1117]/76 p-4 backdrop-blur-md sm:grid-cols-3">
              {["gente visible", "seguimiento activo", "control del dueño"].map((item, index) => <div key={item} className="border-l border-[var(--electric)]/35 pl-3"><p className="font-heading text-2xl text-[var(--electric)]">0{index + 1}</p><p className="text-xs uppercase tracking-[0.18em] text-[var(--steel)]">{item}</p></div>)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function EconomicCost() {
  const numbers = [["40", "personas preguntan"], ["12", "reciben seguimiento real"], ["5", "agendan"], ["3", "compran"]];
  return (
    <section id="costo" className="bg-[var(--background)] px-5 py-20 lg:px-8 lg:py-28">
      {/* @section: economic-cost */}
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Lo que ya te está costando</h2>
        </Reveal>
        <Reveal delay={100} className="mt-10 rounded-[2rem] border border-white/10 bg-[var(--surface)] p-5 md:p-8">
          <div className="grid gap-4 md:grid-cols-4">
            {numbers.map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-[var(--electric)]/15 bg-[#0D1117] p-6">
                <p className="font-heading text-5xl font-bold text-[var(--electric)]">{value}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.16em] text-[var(--steel)]">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 font-heading text-3xl font-bold text-[var(--bone)] md:text-5xl">¿Qué pasó con las otras 35?</p>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--steel)]">AIDOH empieza ahí. No prometiendo cien clientes nuevos. Encontrando qué ocurrió con los que ya tocaron tu puerta.</p>
          <p className="mt-5 text-xs uppercase tracking-[0.16em] text-[var(--steel)]/60">Ejemplo ilustrativo. No representa resultados garantizados.</p>
        </Reveal>
        {/* @section: callout-a */}
        <Reveal delay={180} className="mt-8 border-l-4 border-[var(--electric)] bg-[var(--green-deep)] px-8 py-8 rounded-[2rem]">
          <p className="font-heading text-3xl font-bold leading-tight text-[var(--bone)] md:text-4xl lg:text-5xl">¿Sabes cuánto dinero <span className="text-[var(--electric)]">YA ESTÁS PERDIENDO</span> por no conocer bien a tus clientes?</p>
          <p className="mt-5 text-lg leading-8 text-[var(--steel)]">No hace falta que lleguen más. Solo ver qué está pasando con los que ya llegan.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function JourneyLie() {
  const steps = ["Descubrimiento", "Contacto", "Seguimiento", "Conversión", "Recurrencia"];
  return (
    <section id="problema" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-32">
      {/* @section: growth-lie */}
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.85fr_1.15fr]">
        <Reveal>
          <p className="mb-5 font-heading text-sm font-bold uppercase tracking-[0.25em] text-[var(--electric)]">El error más caro del crecimiento</p>
          <h2 className="font-heading text-4xl font-bold leading-tight tracking-[-0.04em] text-[var(--bone)] md:text-5xl">Meter más tráfico a un negocio desordenado no arregla nada. Solo hace más grande la conversación perdida.</h2>
          <div className="mt-7 space-y-5 text-xl leading-9 text-[var(--steel)]">
            <p>Muchos negocios creen que su problema es conseguir más gente.</p>
            <p className="font-heading text-2xl font-bold text-[var(--bone)]">No.</p>
            <p>Su problema es que lo poco o mucho que ya llega se enfría, se olvida, se responde tarde o se atiende sin criterio.</p>
            <p>Cuando la experiencia del cliente está rota, más tráfico no te salva. Solo aumenta el dinero atorado, el seguimiento roto y las ventas que se caen entre pasos.</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D1117] p-6 md:p-10">
            <svg viewBox="0 0 900 410" className="h-auto w-full" role="img" aria-label="Embudo con conversaciones perdidas de customer journey">
              <defs><linearGradient id="funnel" x1="0" x2="1"><stop offset="0" stopColor="#7EF0C3" stopOpacity=".22"/><stop offset="1" stopColor="#2E7D61" stopOpacity=".64"/></linearGradient></defs>
              <path d="M65 50 H835 L690 165 H210 Z" fill="url(#funnel)" stroke="#7EF0C3" strokeOpacity=".45"/>
              <path d="M210 175 H690 L585 285 H315 Z" fill="#183C34" stroke="#7EF0C3" strokeOpacity=".35"/>
              <path d="M315 295 H585 L520 370 H380 Z" fill="#2E7D61" fillOpacity=".48" stroke="#7EF0C3" strokeOpacity=".35"/>
              {steps.map((step, i) => { const x = [150,315,450,585,745][i]; return <g key={step}><circle cx={x} cy={i < 2 ? 116 : i < 4 ? 228 : 331} r="8" fill="#7EF0C3"/><text x={x} y={i < 2 ? 96 : i < 4 ? 208 : 311} textAnchor="middle" fill="#B8C4D6" fontSize="22" fontFamily="Space Grotesk">{step}</text></g>; })}
              {[260,515,665].map((x, i) => <g key={x}><path d={`M${x} ${i === 0 ? 132 : 246} C${x + 20} ${i === 0 ? 175 : 285}, ${x + 65} ${i === 0 ? 174 : 302}, ${x + 82} ${i === 0 ? 218 : 338}`} stroke="#7EF0C3" strokeWidth="3" strokeDasharray="7 9" fill="none"/><text x={x + 92} y={i === 0 ? 226 : 346} fill="#F4F0E8" fontSize="20" fontFamily="Inter">venta caída</text></g>)}
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function WorkProcess() {
  const steps = [
    ["Vemos cómo opera hoy el negocio", ["Por dónde llega la gente", "Quién responde", "Qué información se pide", "Dónde se pierde", "Qué depende de memoria"]],
    ["Dibujamos el recorrido que debería existir", ["Qué debe pasar cuando alguien pregunta", "Cómo distinguir un curioso de un comprador", "Quién toma cada conversación", "Cuál es el siguiente paso"]],
    ["Construimos únicamente lo necesario", ["Página", "Formulario", "Agente", "CRM ligero", "Seguimiento", "Agenda", "Reportes o varias piezas conectadas"]],
    ["Medimos lo que antes era invisible", ["Cuántos llegan", "Cuántos avanzan", "Dónde se enfrían", "Qué vende", "Dónde se está quedando el dinero"]],
  ];
  return (
    <section id="proceso" className="bg-[var(--background)] px-5 py-24 lg:px-8">
      {/* @section: work-process */}
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-heading text-sm font-bold uppercase tracking-[0.25em] text-[var(--electric)]">Primero vemos. Luego ordenamos.</p>
          <h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">No empezamos instalando cosas.</h2>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-[var(--steel)]">Primero vemos. Luego ordenamos. Después construimos solo lo necesario.</p>
        </Reveal>
        <div className="relative mt-14 grid gap-5 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-[var(--electric)]/30 lg:block" />
          {steps.map(([title, bullets], i) => (
            <Reveal key={title as string} delay={i * 90} className="relative rounded-[2rem] border border-white/10 bg-[var(--surface)] p-6">
              <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--electric)]/45 bg-[#0D1117] font-heading text-2xl font-bold text-[var(--electric)]">0{i + 1}</div>
              <h3 className="font-heading text-2xl font-bold text-[var(--bone)]">{title as string}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--steel)]">
                {(bullets as string[]).map((bullet) => <li key={bullet} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--electric)]" />{bullet}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal delay={140} className="mt-10 rounded-[2rem] border border-[var(--electric)]/20 bg-[var(--green-deep)]/35 p-7 text-center font-heading text-2xl font-bold text-[var(--bone)]">No instalamos para presumir software. Construimos control.</Reveal>
        {/* @section: flow-diagrams */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Flujo actual — rojo suave */}
          <Reveal className="overflow-hidden rounded-[2rem] border border-red-900/40 bg-[#1a0f0f] p-6 md:p-8">
            <p className="mb-6 font-heading text-sm font-bold uppercase tracking-[0.22em] text-red-300/80">Así se pierde un cliente hoy</p>
            <div className="flex flex-col gap-0">
              {[
                ["Pregunta", "Entra el interés"],
                ["2h después…", "Se tarda la respuesta"],
                ["Responden", "Pero sin datos del cliente"],
                ["Otro vendedor", "Vuelve a pedir los mismos datos"],
                ['"Lo checo"', "Se enfría, se olvida"],
                ["Desaparece", "El negocio cree que faltó publicidad"],
              ].map(([node, note], i, arr) => (
                <div key={node} className="flex flex-col items-start">
                  <div className="flex items-center gap-4 w-full">
                    <div className={`rounded-xl border px-4 py-3 font-heading text-sm font-bold ${i === arr.length - 1 ? "border-red-500/50 bg-red-950/60 text-red-200" : "border-red-900/60 bg-[#1a0a0a] text-red-100/80"}`}>{node}</div>
                    <p className="text-xs text-red-200/50 italic">{note}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="ml-5 flex flex-col items-center">
                      <div className="h-5 w-px bg-red-700/40" />
                      <svg width="10" height="8" viewBox="0 0 10 8" className="text-red-700/60 fill-current"><path d="M5 8L0 0h10z"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
          {/* Flujo con AIDOH — verde eléctrico */}
          <Reveal delay={100} className="overflow-hidden rounded-[2rem] border border-[var(--electric)]/20 bg-[#0f1f18] p-6 md:p-8">
            <p className="mb-6 font-heading text-sm font-bold uppercase tracking-[0.22em] text-[var(--electric)]">Así se ve con AIDOH</p>
            <div className="flex flex-col gap-0">
              {[
                ["Pregunta", "El sistema lo registra al instante"],
                ["Respuesta inmediata", "Personalizada, sin esperar"],
                ["Se perfila la intención", "¿Precio? ¿Cita? ¿Crédito? ¿Curiosidad?"],
                ["Seguimiento automático", "El negocio no lo olvida"],
                ["Agenda o avanza", "Con el paso correcto al momento correcto"],
                ["Se mide", "Dónde llegó, por qué avanzó o por qué no"],
              ].map(([node, note], i, arr) => (
                <div key={node} className="flex flex-col items-start">
                  <div className="flex items-center gap-4 w-full">
                    <div className={`rounded-xl border px-4 py-3 font-heading text-sm font-bold ${i === arr.length - 1 ? "border-[var(--electric)]/60 bg-[var(--green-deep)] text-[var(--electric)]" : "border-[var(--electric)]/20 bg-[#0d1a13] text-[var(--electric)]/90"}`}>{node}</div>
                    <p className="text-xs text-[var(--steel)]/60 italic">{note}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="ml-5 flex flex-col items-center">
                      <div className="h-5 w-px bg-[var(--electric)]/30" />
                      <svg width="10" height="8" viewBox="0 0 10 8" className="fill-[#7EF0C3] opacity-50"><path d="M5 8L0 0h10z"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function LocalScenes() {
  const scenes: Array<[string, string, string]> = [
    ["Barbería", "Respondes tarde, pierdes citas, no reactivas y el dueño no sabe quién sí vuelve y quién ya se perdió.", "El cliente quería cita. Le dijeron 'ahorita te confirmo'. Nunca lo confirmaron. La silla vacía te costó más de lo que parecía."],
    ["Cafetería", "Preguntan por menú, mesa o delivery, pero una visita buena no se convierte sola en recompra.", "La gente sí pregunta por menú, mesa o delivery. El problema es que nadie conecta esa conversación con recompra o recurrencia."],
    ["Gimnasio", "El verdadero negocio no es solo la inscripción: es permanencia, asistencia, seguimiento y reactivación.", "Pidió informes por WhatsApp, le mandaron precios, dijo 'lo checo' y nadie supo si se frenó por dinero, pena, tiempo o falta de acompañamiento."],
    ["Venta de casas", "Un lead no vale igual si busca vivir, invertir o usar crédito. Si todos reciben lo mismo, muchos se enfrían.", "Vio un anuncio, pidió información de una casa, recibió un PDF genérico y nadie volvió a distinguir si buscaba vivir, invertir o usar crédito."],
  ];
  return (
    <section id="escenas" className="bg-[var(--background)] px-5 py-24 lg:px-8">
      {/* @section: local-scenes */}
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Escenas donde el dinero se escapa sin hacer ruido.</h2>
        </Reveal>
        {/* @section: owner-illustration */}
        <Reveal delay={80} className="mt-10 overflow-hidden rounded-[2rem] border border-[var(--electric)]/15">
          <img src={ownerDashboardImage} alt="Dueño de negocio leyendo sus datos operativos en pantalla — AIDOH" className="h-[22rem] w-full object-cover object-center opacity-85 md:h-[32rem]" />
          <div className="bg-[#0D1117]/92 px-6 py-5 backdrop-blur-sm">
            <p className="font-heading text-lg font-bold text-[var(--bone)]">Cuando ves tus datos, dejas de adivinar.</p>
            <p className="mt-1 text-sm text-[var(--steel)]">Esta es la diferencia entre operar a ciegas y operar con control.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {scenes.map((s, i) => (
            <Reveal key={s[0]} delay={i * 110} className={cn("rounded-[2rem] border border-white/10 bg-[var(--surface)] p-7 transition hover:-translate-y-1 hover:border-[var(--electric)]/35", i === 0 && "lg:col-span-5 lg:row-span-2", i === 1 && "lg:col-span-7", i === 2 && "lg:col-span-7", i === 3 && "lg:col-span-12")}>
              {/* quote scene */}
              <blockquote className="mb-6 border-l-[3px] border-[var(--electric)] bg-[#0D1117] px-4 py-4 italic text-sm leading-6 text-[var(--steel)]">{s[2]}</blockquote>
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
    <section id="journey" className="bg-[var(--background)] px-5 py-24 lg:px-8">
      {/* @section: good-journey */}
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
    ["Customer Journey", "Dibujamos qué ocurre desde que alguien pregunta hasta que compra, desaparece o vuelve. Luego corregimos los puntos donde hoy dependes de memoria, chats y buena suerte."],
    ["Seguimiento real", "Cuando alguien pregunta y no compra, el negocio no lo olvida. El sistema sabe cuándo volver a escribirle, qué preguntarle y cuándo entregarlo a una persona."],
    ["Lectura de conversaciones perdidas", "Puedes ver cuántos preguntaron, cuántos avanzaron, dónde se enfriaron y cuánto dinero se está quedando atorado en cada etapa."],
    ["Formulación comercial", "Dejamos de ofrecerle lo mismo a todo el mundo. Ordenamos qué ofrecer, a quién y en qué momento."],
    ["CRM operativo", "No te metemos un monstruo con 80 botones. Dejamos visible quién llegó, qué quiere, quién debe responder y cuál es el siguiente paso."],
    ["Automatización visible", "Cuando una cita queda sin confirmar, el sistema la detecta, vuelve a preguntar y avisa si alguien debe intervenir."],
  ];
  return (
    <section id="capacidades" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      {/* @section: capabilities */}
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">AIDOH no te mete más cosas. Te quita desorden, puntos ciegos y ventas atoradas.</h2>
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
      {/* @section: demos */}
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
          <div className="mt-4 flex w-full gap-2 overflow-x-auto rounded-full border border-white/10 bg-[var(--surface)] p-1 sm:w-fit">
            {(Object.keys(demoData) as DemoKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setActive(key)} className={cn("shrink-0 rounded-full px-4 py-2 font-heading text-sm font-bold transition", active === key ? "bg-[var(--electric)] text-[#07100d]" : "text-[var(--steel)] hover:text-[var(--bone)]")}>{demoData[key].label}</button>
            ))}
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-[2rem] border border-white/10 bg-[var(--surface)] p-5 md:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="font-heading text-xl font-bold text-[var(--bone)]">Vista del cliente · {data.clientTitle}</p>
              {data.badge ? <span className="rounded-full border border-[var(--electric)]/30 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--electric)]">{data.badge}</span> : null}
            </div>
            <p className="mb-6 rounded-2xl border border-[var(--electric)]/15 bg-[#0D1117] p-4 text-sm leading-6 text-[var(--steel)]">{data.scene}</p>
            <div className="space-y-4">
              {data.messages.map((m, i) => (
                <div key={i} className={cn("max-w-[88%] rounded-3xl px-5 py-4 text-sm leading-6", m.from === "client" ? "bg-[#0D1117] text-[var(--steel)]" : "ml-auto border border-[var(--electric)]/20 bg-[var(--green-deep)] text-[var(--bone)]")}>{m.text}</div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-[var(--electric)]/20 bg-[#0D1117] p-4 text-sm text-[var(--electric)]">Demo: confirmar, perfilar, registrar y marcar siguiente acción.</div>
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
                <div key={c.name} className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-[#0D1117]/70 p-4">
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
  const metrics = [["Conversaciones revisadas", "128"], ["Tiempo de respuesta", "3m"], ["Clientes por reactivar", "31"], ["Dinero atorado", "visible"]];
  const rows = [["Seguimiento", "Barbería", "alto impacto"], ["Recurrencia", "Cafetería", "impacto claro"], ["Filtro", "Venta de casas", "línea real"]];
  const stats = [
    ["68%", "de los prospectos no reciben seguimiento después del primer mensaje"],
    ["3x", "más probabilidad de cerrar si el seguimiento ocurre en los primeros 30 minutos"],
    ["$0", "costo adicional de clientes que ya preguntaron y el negocio dejó ir"],
  ];
  return (
    <section id="bi" className="bg-[var(--background)] px-5 py-24 lg:px-8">
      {/* @section: business-intelligence */}
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-heading text-sm font-bold uppercase tracking-[0.25em] text-[var(--electric)]">Lo que empieza a aparecer cuando ordenas tu operación</p>
          <h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Cuando dejas de improvisar, tu negocio empieza a hablar.</h2>
        </Reveal>
        {/* @section: stat-callouts */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {stats.map(([num, label]) => (
            <Reveal key={num} className="rounded-[2rem] border border-[var(--electric)]/15 bg-[var(--surface)] p-6 text-center">
              <p className="font-heading text-6xl font-bold text-[var(--electric)] md:text-7xl">{num}</p>
              <p className="mt-4 text-sm leading-6 text-[var(--steel)]">{label}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--steel)]/55">Datos ilustrativos basados en patrones comunes de negocios locales. No representan resultados garantizados.</p>
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-[var(--surface)] p-5 md:p-8">
          <div className="grid gap-4 md:grid-cols-4">
            {metrics.map((m) => (
              <div key={m[0]} className="rounded-2xl bg-[#0D1117] p-5">
                <p className="text-sm text-[var(--steel)]">{m[0]}</p>
                <p className="mt-4 font-heading text-4xl font-bold text-[var(--electric)]">{m[1]}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-lg leading-8 text-[var(--steel)]">Empiezas a ver qué preguntas se repiten, dónde se cae la gente, qué servicio convierte más, qué cliente vuelve y qué parte del negocio sigue drenando tiempo, dinero o atención. No es big data para presumir: es claridad útil para decidir mejor.</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-3 bg-[#0D1117] p-4 font-heading text-sm uppercase tracking-[0.16em] text-[var(--steel)]"><span>Etapa</span><span>Negocio tipo</span><span>Nivel de impacto</span></div>
            {rows.map((r) => <div key={r.join("")} className="grid grid-cols-3 border-t border-white/8 p-4 text-[var(--bone)]"><span>{r[0]}</span><span className="text-[var(--steel)]">{r[1]}</span><span className="font-heading text-[var(--electric)]">{r[2]}</span></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Differentiation() {
  return (
    <section id="diferencia" className="bg-[var(--surface)] px-5 py-20 lg:px-8">
      {/* @section: differentiation */}
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <Reveal><h2 className="font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">AIDOH no es un CRM. No es una agencia. No es un chatbot.</h2></Reveal>
        <Reveal delay={100} className="space-y-6 text-xl leading-9 text-[var(--steel)]">
          <p>No instalamos herramientas para después buscarles uso. Primero dibujamos la operación. Después construimos únicamente lo que evita que se pierdan ventas o mejora la conversión que ya existe.</p>
          <p className="rounded-[2rem] border border-[var(--electric)]/20 bg-[#0D1117] p-6 font-heading text-2xl font-bold text-[var(--bone)]">Primero vemos por dónde entra la gente, dónde se pierde y quién debería moverla. Luego ponemos sistema. No al revés.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function AudienceFilter() {
  const yes = ["Ya recibes preguntas o prospectos", "Vendes por WhatsApp, formularios, redes o llamadas", "Varias personas atienden", "Se pierden conversaciones", "No sabes quién debe dar seguimiento", "No puedes medir de dónde salen las ventas", "Quieres que el cliente regrese, vuelva a comprar y no sea cuestión de suerte"];
  const no = ["Nadie está preguntando", "La oferta no está clara", "Se espera que una automatización arregle un negocio que todavía no funciona"];
  return (
    <section id="filtro" className="bg-[var(--background)] px-5 py-20 lg:px-8">
      {/* @section: audience-filter */}
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Para quién sí. Para quién todavía no.</h2></Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal className="rounded-[2rem] border border-[var(--electric)]/20 bg-[var(--surface)] p-7"><h3 className="font-heading text-2xl font-bold text-[var(--bone)]">AIDOH sí tiene sentido cuando:</h3><ul className="mt-6 space-y-3 text-[var(--steel)]">{yes.map(item => <li key={item} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-[var(--electric)]" />{item}</li>)}</ul></Reveal>
          <Reveal delay={100} className="rounded-[2rem] border border-white/10 bg-[var(--surface)] p-7"><h3 className="font-heading text-2xl font-bold text-[var(--bone)]">Todavía no tiene sentido cuando:</h3><ul className="mt-6 space-y-3 text-[var(--steel)]">{no.map(item => <li key={item} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-[var(--steel)]/45" />{item}</li>)}</ul></Reveal>
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="bg-[var(--surface)] px-5 py-20 lg:px-8">
      {/* @section: callout-b */}
      <div className="mx-auto max-w-7xl mb-12">
        <Reveal className="border-l-4 border-r-4 border-[var(--green-money)] bg-[#151B23] px-8 py-8 rounded-[2rem]">
          <p className="font-heading text-3xl font-bold leading-tight text-[var(--bone)] md:text-4xl lg:text-5xl">Te sorprenderá que, aún sin tener más clientes, <span className="text-[var(--electric)]">PUEDES ENCONTRAR NUEVAS GANANCIAS</span> al conocer los detalles de operación de tu negocio.</p>
          <p className="mt-5 text-lg leading-8 text-[var(--steel)]">El dinero no siempre viene de más publicidad. A veces ya está ahí. Solo nadie lo está viendo.</p>
        </Reveal>
      </div>
      {/* @section: pricing */}
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="max-w-4xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">Fácil de entrar. Real desde el primer día.</h2></Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <Reveal className="rounded-[2rem] border border-[var(--electric)]/30 bg-[#0D1117] p-7 shadow-[0_0_60px_rgba(126,240,195,0.08)]">
            <span className="rounded-full bg-[var(--electric)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#07100d]">Prueba real</span>
            <p className="mt-7 font-heading text-5xl font-bold text-[var(--bone)]">$99 <span className="text-lg text-[var(--steel)]">/ mes</span></p>
            <p className="mt-4 text-lg text-[var(--steel)]">Un mes completo. Funciones básicas. Totalmente utilizable.</p>
            <p className="mt-4 text-[var(--bone)]">No es demo vacía. Es el sistema real en tu negocio.</p>
            <p className="mt-5 rounded-2xl border border-[var(--electric)]/20 bg-[var(--green-deep)]/40 p-4 text-sm text-[var(--electric)]">Costo de instalación ($1,999) sin cargo por tiempo limitado</p>
            <a href="#contacto" className="mt-7 inline-flex rounded-full bg-[var(--green-money)] px-6 py-3 font-heading font-bold text-[#07100d] transition hover:bg-[var(--electric)]">Quiero probar AIDOH</a>
          </Reveal>
          <Reveal delay={90} className="rounded-[2rem] border border-white/10 bg-[#0D1117]/70 p-7">
            <p className="font-heading text-xl font-bold text-[var(--bone)]">Si quieres continuar</p>
            <p className="mt-7 font-heading text-5xl font-bold text-[var(--bone)]">$999 <span className="text-lg text-[var(--steel)]">/ mes</span></p>
            <p className="mt-4 text-lg text-[var(--steel)]">Los $99 de la prueba se abonan.</p>
            <p className="mt-4 text-[var(--bone)]">Renta mensual completa. Sin sorpresas.</p>
          </Reveal>
          <Reveal delay={160} className="rounded-[2rem] border border-white/10 bg-[#0D1117]/70 p-7">
            <p className="font-heading text-xl font-bold text-[var(--bone)]">Desarrollo especial</p>
            <p className="mt-7 text-3xl font-heading font-bold text-[var(--bone)]">A la medida</p>
            <p className="mt-4 text-lg text-[var(--steel)]">¿Necesitas algo específico? Se cotiza aparte.</p>
            <a href="#contacto" className="mt-7 inline-flex rounded-full border border-[var(--electric)]/35 px-6 py-3 font-heading font-bold text-[var(--electric)] transition hover:bg-[var(--green-deep)]">Cuéntanos qué necesitas</a>
          </Reveal>
        </div>
        <p className="mt-6 text-sm text-[var(--steel)]/70">Sin contratos anuales. Sin trampa de período de prueba gratuita sin soporte.</p>
      </div>
    </section>
  );
}

export function FutureLayer() {
  const items = ["Inventario y costo de insumos por producto", "Alerta de bajo inventario", "Costos por plato, servicio o procedimiento", "Automatización operativa específica", "Paneles y reportes más complejos", "Módulos especiales por tipo de negocio"];
  return (
    <section id="futuro" className="bg-[var(--background)] px-5 py-20 lg:px-8">
      {/* @section: future-layer */}
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--bone)] md:text-6xl">AIDOH puede crecer con tu negocio.</h2>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-[var(--steel)]">Hoy ordenamos captación, seguimiento y conversión. Más adelante, dependiendo del negocio, podemos ir más profundo.</p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((item, i) => <Reveal key={item} delay={i * 60} className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5 text-[var(--steel)]">{item}</Reveal>)}</div>
        <Reveal delay={120} className="mt-8 rounded-[2rem] border border-[var(--electric)]/20 bg-[var(--green-deep)]/30 p-7 text-lg leading-8 text-[var(--bone)]">Una crepería puede llegar a ver cuánto gastó de cada ingrediente, alertas de bajo inventario y operación conectada con pedidos. Eso no es para hoy. Pero queda en el camino.</Reveal>
      </div>
    </section>
  );
}

const giroOptions = ["Barbería/Peluquería", "Cafetería/Restaurante", "Gimnasio/Centro Deportivo", "Bienes Raíces", "Salud/Consultorio", "Comercio Local", "Educación/Formación", "Otro"];
const canalOptions = ["WhatsApp", "Redes sociales", "Referidos", "Sitio web", "En persona", "Otro"];
const yesNoMaybe = ["Sí", "No", "Más o menos"];

const initialForm: LeadForm = {
  nombre: "",
  negocio: "",
  vertical: "",
  whatsapp: "",
  ubicacion_zona: "",
  canal_principal_entrada: "",
  producto_servicio_mas_consumido: "",
  tiene_sistema_automatizado: "",
  conoce_producto_mas_consumido: "",
  conoce_habitos_de_compra: "",
  sabe_por_que_no_regresan: "",
  tiene_programa_referidos: "",
  que_quiere_ver_pantalla: "",
  que_quiere_automatizar: "",
  comentarios_libres: "",
};

export function FinalCta() {
  const [form, setForm] = useState<LeadForm>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const update = (field: keyof LeadForm, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await apiFetch("/leads", {
        method: "POST",
        auth: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source_page: "landing-aidoh-v2" }),
      });
      const payload = await response.json().catch(() => null) as { ok?: boolean; id?: number; error?: string; message?: string } | null;
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message || payload?.error || "No pudimos guardar tus datos. Revisa los campos e intenta de nuevo.");
      }
      setStatus("sent");
      setMessage("Recibido. Tu caso quedó guardado y listo para revisión.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Algo falló al enviar. Inténtalo de nuevo o escríbenos por WhatsApp.");
    }
  }

  return (
    <section id="contacto" className="bg-[linear-gradient(145deg,#183C34_0%,#0D1117_60%)] px-5 py-24 lg:px-8">
      {/* @section: contact-form */}
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="font-heading text-4xl font-bold leading-tight tracking-[-0.045em] text-[var(--bone)] md:text-6xl">Si hoy tu negocio depende de tu memoria, de tus chats o de responder como se pueda, ya te está costando dinero.</h2>
          <p className="mt-6 text-xl leading-9 text-[var(--steel)]">No hace falta que llegues con todo resuelto. Solo necesito ver qué tipo de negocio tienes y dónde sientes que más se rompe.</p>
        </Reveal>

        {status === "sent" ? (
          <Reveal className="mt-12 rounded-[2rem] border border-[var(--electric)]/25 bg-[var(--surface)] p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--electric)]/40 bg-[var(--green-deep)]"><svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-[var(--electric)]" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></div>
            <p className="font-heading text-2xl font-bold text-[var(--bone)]">Recibido.</p>
            <p className="mt-3 text-[var(--steel)]">{message} Revisamos tu caso. Si tiene sentido, coordinamos una conversación breve de 5 minutos.</p>
          </Reveal>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 rounded-[2rem] border border-white/10 bg-[#0D1117]/70 p-5 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <TextField id="nombre" label="Nombre *" value={form.nombre} onChange={(value) => update("nombre", value)} required placeholder="Tu nombre" />
              <TextField id="negocio" label="Negocio (nombre o giro) *" value={form.negocio} onChange={(value) => update("negocio", value)} required placeholder="Ej. Barbería El Norte" />
              <SelectField id="vertical" label="Giro del negocio *" value={form.vertical} onChange={(value) => update("vertical", value)} options={giroOptions} required placeholder="Elige el giro" />
              <TextField id="whatsapp" label="WhatsApp *" type="tel" value={form.whatsapp} onChange={(value) => update("whatsapp", value)} required placeholder="+52 55 0000 0000" />
              <TextField id="ubicacion_zona" label="Ubicación / Zona" value={form.ubicacion_zona} onChange={(value) => update("ubicacion_zona", value)} placeholder="Colonia, ciudad o zona" />
              <SelectField id="canal" label="¿Por dónde te llegan más clientes hoy?" value={form.canal_principal_entrada} onChange={(value) => update("canal_principal_entrada", value)} options={canalOptions} placeholder="Elige una opción" />
              <TextField id="producto" label="¿Qué producto o servicio consumen más?" value={form.producto_servicio_mas_consumido} onChange={(value) => update("producto_servicio_mas_consumido", value)} placeholder="Ej. Corte y barba, café frío, mensualidad" />
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <RadioField label="¿Tienes algún sistema para atender y dar seguimiento?" name="sistema" value={form.tiene_sistema_automatizado} options={["Sí", "No", "Parcialmente"]} onChange={(value) => update("tiene_sistema_automatizado", value)} />
              <RadioField label="¿Sabes cuál es tu producto o servicio más consumido?" name="producto_mas" value={form.conoce_producto_mas_consumido} options={yesNoMaybe} onChange={(value) => update("conoce_producto_mas_consumido", value)} />
              <RadioField label="¿Conoces los hábitos de compra de tus clientes?" name="habitos" value={form.conoce_habitos_de_compra} options={yesNoMaybe} onChange={(value) => update("conoce_habitos_de_compra", value)} />
              <RadioField label="¿Sabes quién no regresa y por qué?" name="regresan" value={form.sabe_por_que_no_regresan} options={["Sí", "No"]} onChange={(value) => update("sabe_por_que_no_regresan", value)} />
              <RadioField label="¿Tienes programa de referidos o incentivos?" name="referidos" value={form.tiene_programa_referidos} options={["Sí", "No", "Estoy pensándolo"]} onChange={(value) => update("tiene_programa_referidos", value)} />
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <TextareaField id="pantalla" label="¿Qué te gustaría poder ver en una pantalla de tu negocio?" value={form.que_quiere_ver_pantalla} onChange={(value) => update("que_quiere_ver_pantalla", value)} placeholder="Ej. quién está pendiente, qué se vende más, quién no volvió" />
              <TextareaField id="automatico" label="¿Qué te gustaría que se hiciera automáticamente?" value={form.que_quiere_automatizar} onChange={(value) => update("que_quiere_automatizar", value)} placeholder="Ej. recordatorios, seguimiento, reactivación" />
            </div>
            <div className="mt-5"><TextareaField id="comentarios" label="Comentarios libres" value={form.comentarios_libres} onChange={(value) => update("comentarios_libres", value)} placeholder="Cuéntame lo que se rompe hoy, sin formalidades" /></div>

            {status === "error" ? <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">{message}</p> : null}

            <div className="pt-7">
              <button type="submit" disabled={status === "sending"} className="w-full rounded-full bg-[var(--green-money)] py-5 font-heading text-lg font-bold text-[#07100d] transition hover:bg-[var(--electric)] hover:shadow-[0_0_44px_rgba(126,240,195,0.24)] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:px-12">{status === "sending" ? "Guardando..." : "Quiero revisar mi caso"}</button>
              <p className="mt-4 text-sm text-[var(--steel)]/70">Sin pitch raro. Sin llamada eterna. Solo ver si sí te podemos ayudar.</p>
              <p className="mt-5 text-sm leading-6 text-[var(--steel)]">Qué pasa después de enviar: Revisamos tu caso. Si tiene sentido, coordinamos una conversación breve de 5 minutos. Saldrás con un mapa inicial de lo que podría mejorarse, aunque no trabajemos juntos.</p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function fieldClass() {
  return "w-full rounded-2xl border border-white/12 bg-[var(--surface)] px-5 py-4 text-[var(--bone)] placeholder-[var(--steel)]/50 outline-none transition focus:border-[var(--electric)]/50 focus:ring-2 focus:ring-[var(--electric)]/20";
}

function TextField({ id, label, value, onChange, placeholder, required = false, type = "text" }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; type?: string }) {
  return <div><label className="mb-2 block text-sm text-[var(--steel)]" htmlFor={id}>{label}</label><input id={id} required={required} type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className={fieldClass()} /></div>;
}

function SelectField({ id, label, value, onChange, options, placeholder, required = false }: { id: string; label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string; required?: boolean }) {
  return <div><label className="mb-2 block text-sm text-[var(--steel)]" htmlFor={id}>{label}</label><select id={id} required={required} value={value} onChange={e => onChange(e.target.value)} className={cn(fieldClass(), "appearance-none")}><option value="" disabled>{placeholder}</option>{options.map(g => <option key={g} value={g} className="bg-[var(--surface)]">{g}</option>)}</select></div>;
}

function TextareaField({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <div><label className="mb-2 block text-sm text-[var(--steel)]" htmlFor={id}>{label}</label><textarea id={id} rows={4} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className={cn(fieldClass(), "resize-none")} /></div>;
}

function RadioField({ label, name, value, options, onChange }: { label: string; name: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <div><p className="mb-3 text-sm text-[var(--steel)]">{label}</p><div className="grid gap-2 sm:grid-cols-3">{options.map(opt => <label key={opt} className={cn("flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition", value === opt ? "border-[var(--electric)]/50 bg-[var(--green-deep)] text-[var(--bone)]" : "border-white/10 bg-[var(--surface)] text-[var(--steel)] hover:border-[var(--electric)]/25")}><input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="sr-only" /><span className={cn("h-3 w-3 shrink-0 rounded-full border", value === opt ? "border-[var(--electric)] bg-[var(--electric)]" : "border-[var(--steel)]/40")} />{opt}</label>)}</div></div>;
}

export function AidohLanding() {
  return (
    <>
      <Navbar />
      <Hero />
      <EconomicCost />
      <JourneyLie />
      <WorkProcess />
      <LocalScenes />
      <GoodJourney />
      <Capabilities />
      <DemoSelector />
      <BusinessIntelligence />
      <Differentiation />
      <AudienceFilter />
      <Pricing />
      <FutureLayer />
      <FinalCta />
    </>
  );
}
