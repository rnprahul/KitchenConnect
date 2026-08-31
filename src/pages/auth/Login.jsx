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
      toast.error(error.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page position-relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="login-ambient-mesh">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>

      {/* Glassmorphic Login Card */}
      <div className="login-card position-relative glass-shimmer">
        <div className="text-center mb-4">
          <div className="logo-glow-wrapper mb-3">
            <img
              src={logo}
              alt="KitchenConnect Logo"
              className="logo"
            />
          </div>

          <h1 className="login-title mb-1">
            Kitchen<span className="text-emerald">Connect</span>
          </h1>

          <p className="login-subtitle">
            Smart Kitchen Inventory & Shopping Assistant
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="mb-3">
            <label className="form-label d-flex justify-content-between">
              <span>Email Address</span>
            </label>

            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label d-flex justify-content-between">
              <span>Password</span>
            </label>

            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-secondary border-start-0"
                style={{ borderRadius: "0 12px 12px 0" }}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          <button
            className="btn btn-success login-btn w-100 py-3"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing In...
              </>
            ) : (
              <>
                <span>Sign In to Kitchen</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </>
            )}
          </button>
        </form>

        <div className="login-footer text-center mt-4 pt-3 border-top" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
          <small className="text-secondary">
            Developed by <strong className="text-emerald">Rahul N P</strong>
          </small>
        </div>
      </div>

      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
}

export default Login;