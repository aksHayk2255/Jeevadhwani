import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import "./Auth.css";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const initialRole = location.state?.role === "hospital" ? "hospital" : "donor";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: initialRole,
    bloodType: "O+",
    hospitalName: "",
    phone: "",
    aadhaarNumber: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.role === "hospital" || location.state?.role === "donor") {
      setForm((prev) => ({ ...prev, role: location.state.role }));
    }
  }, [location.state]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const normalizedAadhaar = form.aadhaarNumber.replace(/\D/g, "");

      if (!normalizedAadhaar) {
        throw new Error("Please enter a valid 12-digit Aadhaar number");
      }

      if (!form.phone.trim()) {
        throw new Error("Please enter a mobile number");
      }

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
      };

      if (form.role === "donor") {
        payload.bloodType = form.bloodType;
      } else {
        payload.hospitalName = form.hospitalName;
      }

      payload.aadhaarNumber = normalizedAadhaar;

      await register(payload);
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
          <p className="auth-eyebrow">Join the network</p>
          <h1>Create your account</h1>
          <p className="auth-subtitle">
            Register as a donor or hospital to start matching blood in seconds.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="role-toggle auth-role" role="group" aria-label="Select role">
              <button
                type="button"
                className={`role ${form.role === "donor" ? "active" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, role: "donor" }))}
              >
                I&apos;m a donor
              </button>
              <button
                type="button"
                className={`role ${form.role === "hospital" ? "active" : ""}`}
                onClick={() =>
                  setForm((prev) => ({ ...prev, role: "hospital" }))
                }
              >
                I&apos;m a hospital
              </button>
            </div>

            <label>
              Full name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </label>

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
                placeholder="At least 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </label>

            {form.role === "donor" ? (
              <label>
                Blood type
                <select
                  name="bloodType"
                  value={form.bloodType}
                  onChange={updateField}
                  required
                >
                  {BLOOD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label>
                Hospital name
                <input
                  type="text"
                  name="hospitalName"
                  value={form.hospitalName}
                  onChange={updateField}
                  placeholder="City General Hospital"
                  required
                />
              </label>
            )}

            <label>
              Mobile number
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                required
              />
            </label>

            <label>
              Aadhaar number
              <input
                type="text"
                name="aadhaarNumber"
                value={form.aadhaarNumber}
                onChange={updateField}
                placeholder="1234 5678 9012"
                maxLength={12}
                inputMode="numeric"
                pattern="[0-9]{12}"
                required
              />
            </label>

            <p className="auth-help">
              Aadhaar and mobile number are required for verification.
            </p>

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already registered? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
