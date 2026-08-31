import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 position-relative overflow-hidden"
      style={{ background: "var(--color-bg-deep)" }}
    >
      <div className="ambient-glow-mesh">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
      </div>

      <div
        className="glass-card text-center p-5 position-relative"
        style={{
          maxWidth: "480px",
          width: "90%",
          zIndex: 1,
          borderRadius: "28px",
        }}
      >
        <div
          className="d-inline-flex p-3 rounded-circle mb-3"
          style={{
            background: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(251, 113, 133, 0.3)",
            color: "#fb7185",
          }}
        >
          <i className="bi bi-compass fs-1"></i>
        </div>

        <h1
          className="fw-bold mb-1 text-light"
          style={{
            fontSize: "4.5rem",
            lineHeight: 1,
            textShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
          }}
        >
          404
        </h1>

        <h4 className="fw-bold text-light mb-2">Page Not Found</h4>

        <p className="text-secondary mb-4" style={{ fontSize: "0.95rem" }}>
          The page you are looking for does not exist or has been moved.
        </p>

        <button
          className="btn btn-success px-4 py-2"
          onClick={() => navigate("/")}
        >
          <i className="bi bi-house-door-fill me-2"></i>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFound;