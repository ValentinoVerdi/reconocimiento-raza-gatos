import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultado, setResultado] = useState(null);

  

  const handleFileChange = (e) => {
    const archivo = e.target.files[0];
    setFile(archivo);
    setResultado(null);

    if (archivo) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(archivo);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResultado(data);
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
      backgroundColor: "#f2f2f2",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        ¿Qué raza de gato es? 🐱
      </h1>
  
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: "1rem", fontSize: "1rem" }}
      />
  
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{
            maxWidth: "300px",
            maxHeight: "300px",
            objectFit: "contain",
            borderRadius: "1rem",
            marginBottom: "1.5rem",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)"
          }}
        />
      )}
  
      <button
        onClick={handleSubmit}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "2px solid #007bff",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
          transition: "background-color 0.2s ease"
        }}
        onMouseOver={e => e.target.style.backgroundColor = "#0056b3"}
        onMouseOut={e => e.target.style.backgroundColor = "#007bff"}
      >
        Analizar imagen
      </button>
  
      {resultado && (
  <div style={{ marginTop: "2rem", textAlign: "center" }}>
    <p style={{ fontSize: "1.25rem" }}>
      Resultado: <strong>{resultado.confianza > 0.5 ? resultado.raza : "desconocida"}</strong>
    </p>
    <p style={{ fontSize: "1rem", color: "#555" }}>
      Confianza: {(resultado.confianza * 100).toFixed(2)}%
    </p>
  </div>
)}
    </div>
  )
  ;
}

export default App;
