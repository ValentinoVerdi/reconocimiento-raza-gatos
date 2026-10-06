import { useState } from "react";
import DropZone from "./components/DropZone";
import ResultCard from "./components/ResultCard";
import Spinner from "./components/Spinner";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (archivo) => {
    setFile(archivo);
    setResultado(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(archivo);
  };

  const handleSubmit = async () => {
    if (!file || cargando) return;

    const formData = new FormData();
    formData.append("imagen", file);

    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setResultado(data);
    } catch (err) {
      console.error("Error al conectar con el backend:", err);
      setError("No se pudo analizar la imagen. Verificá que el backend esté corriendo.");
    } finally {
      setCargando(false);
    }
  };

  const botonActivo = file && !cargando;

  return (
    <div
      style={{
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
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#111111" }}>
        ¿Qué raza de gato es? 🐱
      </h1>

      <DropZone preview={preview} onFile={handleFile} />

      <button
        onClick={handleSubmit}
        disabled={!botonActivo}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.75rem 1.75rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: botonActivo ? "#007bff" : "#cbd5e1",
          color: "#ffffff",
          cursor: botonActivo ? "pointer" : "not-allowed",
          transition: "background-color 0.2s ease",
          fontWeight: "600",
          boxShadow: botonActivo ? "0 4px 6px rgba(0, 123, 255, 0.2)" : "none",
        }}
      >
        {cargando && <Spinner size={18} />}
        {cargando ? "Analizando..." : "Analizar imagen"}
      </button>

      {error && (
        <p style={{ marginTop: "1.5rem", color: "#dc2626", textAlign: "center", maxWidth: "450px" }}>
          {error}
        </p>
      )}

      {resultado && <ResultCard resultado={resultado} />}
    </div>
  );
}

export default App;