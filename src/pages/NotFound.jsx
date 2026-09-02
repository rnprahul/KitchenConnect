import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 position-relative overflow-hidden"
      style={{ background: "var(--bg-main)" }}
    >
      <div className="kitchen-ambient-mesh" />

      <div
        className="card text-center p-5 position-relative"
        style={{
          maxWidth: "460px",
          width: "90%",
          zIndex: 1,
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          className="d-inline-flex p-3 rounded-circle mb-3 mx-auto"
          style={{
            background: "var(--color-terracotta-light)",
            border: "1px solid #fed7aa",
            color: "var(--color-terracotta)",
          }}
        >
          <i className="bi bi-compass fs-1"></i>
        </div>

        <h1
          className="fw-bold mb-1"
          style={{
            fontSize: "4rem",
            lineHeight: 1,
            color: "var(--color-sage)",
          }}
        >
          404
        </h1>

        <h4 className="fw-bold mb-2" style={{ color: "var(--text-main)" }}>
          Recipe Not Found
        </h4>

        <p className="text-secondary mb-4" style={{ fontSize: "0.95rem" }}>
          The page or kitchen section you're looking for doesn't exist or has been relocated.
        </p>

        <button
          className="btn btn-success px-4 py-2 mx-auto"
          onClick={() => navigate("/")}
        >
          <i className="bi bi-house-door-fill me-2"></i>
          Return to Kitchen
        </button>
      </div>
    </div>
  );
}

export default NotFound;