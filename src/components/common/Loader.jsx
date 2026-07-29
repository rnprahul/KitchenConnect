import logo from "../../assets/images/logo.png";

function Loader() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        background: "#f8f9fa",
      }}
    >

      <img
        src={logo}
        alt="KitchenConnect"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "contain",
        }}
      />


      <div
        className="spinner-border text-success mt-4"
        role="status"
      >
        <span className="visually-hidden">
          Loading...
        </span>
      </div>


      <h5 className="mt-3 fw-semibold text-success">
        KitchenConnect
      </h5>


      <p className="text-muted">
        Checking account...
      </p>


    </div>
  );
}

export default Loader;