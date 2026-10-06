function Spinner({ size = 20, color = "#ffffff" }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        role="status"
        aria-label="Cargando"
        style={{ display: "inline-block", verticalAlign: "middle" }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke={color}
          strokeOpacity="0.25"
          strokeWidth="3"
        />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    );
  }
  
  export default Spinner;