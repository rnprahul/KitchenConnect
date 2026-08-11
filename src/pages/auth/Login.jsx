import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/images/logo.png";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (authLoading) return;

  if (!user) return;

  switch (user.role) {
    case "admin":
      navigate("/admin", { replace: true });
      break;

    case "mother":
      navigate("/mother", { replace: true });
      break;

    case "father":
      navigate("/father", { replace: true });
      break;

    default:
      break;
  }
}, [user, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await login(email, password);

      switch (result.profile.role) {
        case "admin":
  navigate("/admin", { replace: true });
  break;

case "mother":
  navigate("/mother", { replace: true });
  break;

case "father":
  navigate("/father", { replace: true });
  break;

        default:
          toast.error("Unknown user role");
      }
    } catch (error) {
  console.error(error);
  console.error("Firebase Error Code:", error.code);
  console.error("Firebase Error Message:", error.message);

  toast.error(error.message);
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <img
          src={logo}
          alt="KitchenConnect Logo"
          className="logo"
        />

        <h1>KitchenConnect</h1>

        <p className="subtitle">
          Smart Kitchen Shopping Assistant
        </p>

        <form onSubmit={handleLogin}>

          <div className="mb-3">

            <label className="form-label">
              Email Address
            </label>

            <div className="input-group">

              <span className="input-group-text">
                <i className="bi bi-envelope-fill"></i>
              </span>

              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>

          <div className="mb-4">

            <label className="form-label">
              Password
            </label>

            <div className="input-group">

              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="btn btn-light"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                <i
                  className={`bi ${
                    showPassword
                      ? "bi-eye-slash-fill"
                      : "bi-eye-fill"
                  }`}
                ></i>
              </button>

            </div>

          </div>

          <button
            className="btn btn-success login-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>

        </form>

        <div className="footer">

          <small>
            Developed by
            <strong> Rahul N P</strong>
          </small>

        </div>

      </div>

      <ToastContainer position="top-center" />

    </div>
  );
}

export default Login;