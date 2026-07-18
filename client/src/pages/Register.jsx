import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import "./Auth.css";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
    bloodType: "O+",
    weight: "",
    phone: "",
    aadhaarNumber: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.role === "hospital") {
      navigate("/login", { replace: true });
      return;
    }

    if (location.state?.role === "donor") {
      setForm((prev) => ({ ...prev, role: "donor" }));
    }
  }, [location.state, navigate]);

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

      const parsedWeight = Number(form.weight);
      if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
        throw new Error("Please enter a valid weight");
      }

      if (parsedWeight < 50) {
        throw new Error("Ineligible for blood donation. Weight must be at least 50 kg.");
      }

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "donor",
        phone: form.phone,
        bloodType: form.bloodType,
        weight: parsedWeight,
        aadhaarNumber: normalizedAadhaar,
      };

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
            Register as a donor to start matching blood in seconds.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-help" style={{ marginBottom: "0.75rem" }}>
              You can create a donor account here.
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

            <label>
              Weight (kg)
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={updateField}
                placeholder="50"
                min="1"
                required
              />
            </label>

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
