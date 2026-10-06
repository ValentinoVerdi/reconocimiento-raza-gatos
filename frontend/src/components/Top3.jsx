function Top3({ items, titulo = "Las 3 razas más probables", destacar = true }) {
    return (
      <div style={{ textAlign: "left" }}>
        <p style={{ fontSize: "0.95rem", color: "#475569", fontWeight: "600", margin: "0 0 0.75rem 0" }}>
          {titulo}
        </p>
  
        {items.map((item, i) => {
          const resaltado = destacar && i === 0;
          return (
            <div key={item.raza} style={{ marginBottom: "0.75rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.95rem",
                  color: "#1e293b",
                  marginBottom: "0.25rem",
                }}
              >
                <span style={{ fontWeight: resaltado ? "700" : "400" }}>{item.raza}</span>
                <span style={{ color: "#64748b" }}>{(item.confianza * 100).toFixed(1)}%</span>
              </div>
              <div
                style={{
                  height: "8px",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${item.confianza * 100}%`,
                    height: "100%",
                    backgroundColor: resaltado ? "#007bff" : "#94a3b8",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  
  export default Top3;