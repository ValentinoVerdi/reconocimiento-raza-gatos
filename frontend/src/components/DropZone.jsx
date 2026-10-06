import { useRef, useState } from "react";

function DropZone({ preview, onFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const procesar = (archivo) => {
    if (archivo && archivo.type.startsWith("image/")) {
      onFile(archivo);
    }
  };

  const handleFileChange = (e) => procesar(e.target.files[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    procesar(e.dataTransfer.files[0]);
  };

  return (
    <>
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
          textAlign: "center",
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
              borderRadius: "8px",
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
    </>
  );
}

export default DropZone;