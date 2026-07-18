import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <Link to="/" className="auth-brand">
          <span className="logo-circle" aria-hidden="true" />
          Jeevadhwani
        </Link>

        <div className="auth-card">
          <p className="auth-eyebrow">Welcome back</p>
          <h1>Log in to Jeevadhwani</h1>
          <p className="auth-subtitle">
            Access donor matching and emergency broadcasts.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            New to Jeevadhwani? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
