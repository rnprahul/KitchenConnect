import logo from "../../assets/images/logo.png";

function Loader() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 position-relative overflow-hidden"
      style={{
        background: "var(--bg-main)",
      }}
    >
      <div className="kitchen-ambient-mesh" />

      {/* Card loader */}
      <div
        className="card d-flex flex-column align-items-center text-center p-5 position-relative"
        style={{
          maxWidth: "360px",
          width: "90%",
          zIndex: 1,
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          className="p-3 rounded-circle mb-3 position-relative"
          style={{
            background: "var(--color-sage-tint)",
            border: "1px solid var(--color-sage-border)",
          }}
        >
          <img
            src={logo}
            alt="KitchenConnect"
            style={{
              width: "70px",
              height: "70px",
              objectFit: "contain",
            }}
          />
        </div>

        <div
          className="spinner-border text-success mb-3"
          role="status"
          style={{ width: "2rem", height: "2rem", color: "var(--color-sage) !important" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>

        <h4
          className="fw-bold mb-1"
          style={{ fontSize: "1.3rem", color: "var(--text-main)" }}
        >
          Kitchen<span style={{ color: "var(--color-sage)" }}>Connect</span>
        </h4>

        <p className="text-secondary mb-0" style={{ fontSize: "0.88rem" }}>
          Preparing your kitchen workspace...
        </p>
      </div>
    </div>
  );
}

export default Loader;