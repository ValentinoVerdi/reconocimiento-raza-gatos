import { useRef, useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (archivo) => {
    if (archivo && archivo.type.startsWith("image/")) {
      setFile(archivo);
      setResultado(null);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(archivo);
    }
  };

  const handleFileChange = (e) => {
    const archivo = e.target.files[0];
    processFile(archivo);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const archivo = e.dataTransfer.files[0];
    processFile(archivo);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResultado(data);
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      width: "100vw",
      fontFamily: "sans-serif",
      padding: "2rem",
      backgroundColor: "#ffffff",
      color: "#222222",
      boxSizing: "border-box"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#111111" }}>
        ¿Qué raza de gato es? 🐱
      </h1>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <div
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          width: "100%",
          maxWidth: "450px",
          height: "180px",
          border: `2px dashed ${isDragging ? "#007bff" : "#cbd5e1"}`,
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backgroundColor: isDragging ? "#f0f7ff" : "#fafafa",
          transition: "all 0.2s ease",
          marginBottom: "1.5rem",
          padding: "1rem",
          textAlign: "center"
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: "8px"
            }}
          />
        ) : (
          <>
            <svg
              style={{ width: "40px", height: "40px", marginBottom: "0.5rem", fill: "#64748b" }}
              viewBox="0 0 24 24"
            >
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zM8 13h3v-3h2v3h3l-4 4-4-4z" />
            </svg>
            <p style={{ fontSize: "1rem", color: "#475569", margin: 0, fontWeight: "500" }}>
              Haz click o arrastra una imagen
            </p>
          </>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!file}
        style={{
          padding: "0.75rem 1.75rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: file ? "#007bff" : "#cbd5e1",
          color: "#ffffff",
          cursor: file ? "pointer" : "not-allowed",
          transition: "background-color 0.2s ease",
          fontWeight: "600",
          boxShadow: file ? "0 4px 6px rgba(0, 123, 255, 0.2)" : "none"
        }}
      >
        Analizar imagen
      </button>

      {resultado && (
        <div style={{ marginTop: "2rem", textAlign: "center", width: "100%", maxWidth: "450px" }}>
          <p style={{ fontSize: "1.25rem", color: "#1e293b", margin: "0.5rem 0" }}>
            Resultado: <strong>{resultado.confianza > 0.5 ? resultado.raza : "desconocida"}</strong>
          </p>
          <p style={{ fontSize: "1rem", color: "#64748b", margin: "0 0 1.5rem 0" }}>
            Confianza: {(resultado.confianza * 100).toFixed(2)}%
          </p>

          {resultado.top3 && (
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "0.95rem", color: "#475569", fontWeight: "600", margin: "0 0 0.75rem 0" }}>
                Las 3 razas más probables
              </p>
              {resultado.top3.map((item, i) => (
                <div key={item.raza} style={{ marginBottom: "0.75rem" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.95rem",
                    color: "#1e293b",
                    marginBottom: "0.25rem"
                  }}>
                    <span style={{ fontWeight: i === 0 ? "700" : "400" }}>{item.raza}</span>
                    <span style={{ color: "#64748b" }}>{(item.confianza * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{
                    height: "8px",
                    backgroundColor: "#e2e8f0",
                    borderRadius: "4px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${item.confianza * 100}%`,
                      height: "100%",
                      backgroundColor: i === 0 ? "#007bff" : "#94a3b8",
                      transition: "width 0.4s ease"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;