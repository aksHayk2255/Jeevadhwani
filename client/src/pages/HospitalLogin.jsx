import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function HospitalLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ hospitalId: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!form.hospitalId.trim() || !form.password.trim()) {
        throw new Error("Please enter your hospital ID and password");
      }

      const validHospitalId = "hos123";
      const validPassword = "123456";

      if (form.hospitalId.trim() !== validHospitalId || form.password !== validPassword) {
        throw new Error("Invalid hospital ID or password");
      }

      navigate("/hospital-dashboard");
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
          <p className="auth-eyebrow">Hospital access</p>
          <h1>Hospital sign in</h1>
          <p className="auth-subtitle">
            Enter your hospital ID and password to continue.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Hospital ID
              <input
                type="text"
                name="hospitalId"
                value={form.hospitalId}
                onChange={updateField}
                placeholder="HOSP-001"
                required
                autoComplete="username"
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
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            Need donor access? <Link to="/login">Go to donor login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HospitalLogin;
