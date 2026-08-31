import logo from "../../assets/images/logo.png";

function Loader() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 position-relative overflow-hidden"
      style={{
        background: "var(--color-bg-deep)",
      }}
    >
      {/* Ambient background glow */}
      <div className="ambient-glow-mesh">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
      </div>

      {/* Glass card loader */}
      <div
        className="glass-card d-flex flex-column align-items-center text-center p-5 position-relative"
        style={{
          maxWidth: "380px",
          width: "90%",
          zIndex: 1,
          borderRadius: "28px",
        }}
      >
        <div
          className="p-3 rounded-circle mb-4 pulse-emerald position-relative"
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(52, 211, 153, 0.3)",
          }}
        >
          <img
            src={logo}
            alt="KitchenConnect"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "contain",
            }}
          />
        </div>

        <div
          className="spinner-border text-success mb-3"
          role="status"
          style={{ width: "2.5rem", height: "2.5rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>

        <h4
          className="fw-bold text-light mb-1"
          style={{ fontSize: "1.4rem" }}
        >
          Kitchen<span className="text-emerald">Connect</span>
        </h4>

        <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
          Authenticating & loading kitchen...
        </p>
      </div>
    </div>
  );
}

export default Loader;