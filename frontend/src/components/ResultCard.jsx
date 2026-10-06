import Top3 from "./Top3";

const UMBRAL_CONFIANZA = 0.5;

function ResultCard({ resultado }) {
  const reconocida = resultado.confianza > UMBRAL_CONFIANZA;

  return (
    <div style={{ marginTop: "2rem", textAlign: "center", width: "100%", maxWidth: "450px" }}>
      <p style={{ fontSize: "1.25rem", color: "#1e293b", margin: "0.5rem 0" }}>
        Resultado: <strong>{reconocida ? resultado.raza : "desconocida"}</strong>
      </p>
      <p style={{ fontSize: "1rem", color: "#64748b", margin: "0 0 0.5rem 0" }}>
        Confianza: {(resultado.confianza * 100).toFixed(2)}%
      </p>

      {!reconocida && (
        <p style={{ fontSize: "0.9rem", color: "#94a3b8", margin: "0 0 1.5rem 0" }}>
          No parece ser ninguna de las razas conocidas.
        </p>
      )}

      {resultado.top3 && (
        <div style={{ marginTop: reconocida ? "1.5rem" : 0 }}>
          <Top3
            items={resultado.top3}
            titulo={reconocida ? "Las 3 razas más probables" : "Lo más parecido"}
            destacar={reconocida}
          />
        </div>
      )}
    </div>
  );
}

export default ResultCard;