import { useState } from "react";

const SEGMENTOS = [
  "B2C (consumo masivo)",
  "B2B (empresas / corporativo)",
  "B2B2C (partnerships / MVNO host)",
  "MVNO (operador móvil virtual)",
  "Wholesale / mayorista",
];

const OBJETIVOS = [
  "Reducir churn / fuga de clientes",
  "Aumentar ARPU (ingreso medio por usuario)",
  "Lanzar oferta 5G / fibra / convergente",
  "Cross-sell y up-sell (triple/quad play)",
  "Entrar a un segmento o mercado nuevo",
  "Mejorar NPS / experiencia de cliente",
  "Transformación digital del canal de ventas",
];

const ETAPAS = [
  "Operador establecido, mercado maduro",
  "Retador / challenger ganando cuota",
  "Entrante nuevo / lanzamiento reciente",
  "MVNO o marca de nicho",
];

export default function App() {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({
    nombre: "",
    segmento: SEGMENTOS[0],
    etapa: ETAPAS[0],
    pais: "",
    objetivo: OBJETIVOS[0],
    problema: "",
  });
  const [informe, setInforme] = useState(null);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function generarInforme(e) {
    e.preventDefault();
    setError("");
    setStep("loading");

    try {
      const response = await fetch("/.netlify/functions/consultar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });

      if (!response.ok) {
        throw new Error("La función respondió con un error");
      }

      const parsed = await response.json();
      setInforme(parsed);
      setStep("informe");
    } catch (err) {
      console.error(err);
      setError("No se pudo generar el informe. Revisa que la clave de API esté configurada en Netlify e intenta de nuevo.");
      setStep("form");
    }
  }

  return (
    <div style={{ background: "#F7F4EE", minHeight: "100vh", padding: "2rem 1rem" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { box-shadow: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: "1.5rem" }} className="no-print">
          <p style={{ fontFamily: "Georgia, serif", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9C9282", margin: 0 }}>
            Consultoría estratégica · telecomunicaciones
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#20231F", margin: "4px 0 0" }}>
            Consultor de marketing telecom IA
          </h1>
        </div>

        {step === "form" && (
          <form
            onSubmit={generarInforme}
            style={{ background: "white", border: "1px solid #E4E0D5", borderRadius: 12, padding: "1.5rem" }}
          >
            {error && <p style={{ color: "#C1622D", fontSize: 14, marginTop: 0 }}>{error}</p>}

            <label style={labelStyle}>Nombre del operador / empresa</label>
            <input
              value={form.nombre}
              onChange={(e) => update("nombre", e.target.value)}
              placeholder="Ej. Telecom Sur S.A."
              style={inputStyle}
              required
            />

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Segmento principal</label>
                <select value={form.segmento} onChange={(e) => update("segmento", e.target.value)} style={inputStyle}>
                  {SEGMENTOS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>País / mercado</label>
                <input
                  value={form.pais}
                  onChange={(e) => update("pais", e.target.value)}
                  placeholder="Ej. España"
                  style={inputStyle}
                />
              </div>
            </div>

            <label style={{ ...labelStyle, marginTop: 12 }}>Etapa competitiva</label>
            <select value={form.etapa} onChange={(e) => update("etapa", e.target.value)} style={inputStyle}>
              {ETAPAS.map((e2) => <option key={e2}>{e2}</option>)}
            </select>

            <label style={{ ...labelStyle, marginTop: 12 }}>Objetivo estratégico principal</label>
            <select value={form.objetivo} onChange={(e) => update("objetivo", e.target.value)} style={inputStyle}>
              {OBJETIVOS.map((o) => <option key={o}>{o}</option>)}
            </select>

            <label style={{ ...labelStyle, marginTop: 12 }}>Contexto o problema actual</label>
            <textarea
              value={form.problema}
              onChange={(e) => update("problema", e.target.value)}
              placeholder="Ej. Estamos perdiendo clientes de fibra frente a un competidor con oferta convergente más agresiva"
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
            />

            <button
              type="submit"
              style={{
                marginTop: 16, width: "100%", background: "#2B4C43", color: "white",
                border: "none", borderRadius: 8, padding: "12px 16px", fontSize: 15, cursor: "pointer",
              }}
            >
              Generar informe estratégico
            </button>
          </form>
        )}

        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "#5B584F" }}>
            Analizando el mercado y preparando el informe…
          </div>
        )}

        {step === "informe" && informe && (
          <div>
            <div className="print-area" style={{ background: "white", border: "1px solid #E4E0D5", borderRadius: 12, padding: "2rem" }}>
              <p style={{ fontSize: 12, color: "#9C9282", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                Informe estratégico · {form.segmento}
              </p>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, margin: "6px 0 20px", color: "#20231F" }}>
                {form.nombre}
              </h2>

              <Section title="Diagnóstico">{informe.diagnostico}</Section>
              <Section title="Análisis competitivo">{informe.analisisCompetitivo}</Section>
              <Section title="Posicionamiento sugerido">{informe.posicionamiento}</Section>

              <Section title="Quick wins (esta semana)">
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {informe.quickWins?.map((q, i) => <li key={i} style={{ marginBottom: 4 }}>{q}</li>)}
                </ul>
              </Section>

              <Section title="Plan de 90 días">
                {informe.plan90dias?.map((m, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <p style={{ fontWeight: "bold", margin: "0 0 4px", color: "#2B4C43" }}>{m.mes} — {m.foco}</p>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {m.acciones?.map((a, j) => <li key={j} style={{ marginBottom: 2 }}>{a}</li>)}
                    </ul>
                  </div>
                ))}
              </Section>

              <Section title="KPIs a seguir">
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {informe.kpis?.map((k, i) => <li key={i} style={{ marginBottom: 4 }}>{k}</li>)}
                </ul>
              </Section>

              <Section title="Consideraciones regulatorias / de mercado">{informe.riesgosRegulatorios}</Section>
              <Section title="Priorización de inversión">{informe.inversionSugerida}</Section>
            </div>

            <div className="no-print" style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button onClick={() => window.print()} style={secondaryBtn}>Descargar como PDF</button>
              <button onClick={() => setStep("form")} style={secondaryBtn}>Nuevo informe</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#C1622D", margin: "0 0 6px", fontWeight: "bold" }}>
        {title}
      </p>
      <div style={{ fontSize: 15, color: "#20231F", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #DAD5C7",
  fontSize: 14, boxSizing: "border-box", background: "#FBFAF6",
};

const labelStyle = { display: "block", fontSize: 13, color: "#5B584F", marginBottom: 4 };

const secondaryBtn = {
  flex: 1, background: "white", border: "1px solid #DAD5C7", borderRadius: 8,
  padding: "10px 16px", fontSize: 14, cursor: "pointer",
};
