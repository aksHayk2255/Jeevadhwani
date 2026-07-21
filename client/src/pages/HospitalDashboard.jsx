import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const DEMO_DONOR = {
  name: "Anjali Menon",
  email: "anjali@example.com",
  phone: "+91 98765 43210",
  aadhaarNumber: "123456789012",
  bloodType: "O+",
  creditScore: 760,
  medicalInfo: "No known allergies. Regular checkups.",
  lastDonatedDate: "",
  quarantineUntil: "",
  quarantined: false,
};

function maskText(value) {
  if (!value) return "—";
  if (value.length <= 3) return value;
  return `${value.slice(0, 2)}${"*".repeat(Math.max(2, value.length - 3))}${value.slice(-1)}`;
}

function maskAadhaar(value) {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return value;
  return `**** **** ${digits.slice(-4)}`;
}

function maskPhone(value) {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 4) return value;
  return `+91 **** ${digits.slice(-4)}`;
}

function formatDisplayDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function addMonths(dateString, months) {
  const date = new Date(dateString);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split("T")[0];
}

function HospitalDashboard() {
  const [lookupForm, setLookupForm] = useState({ mobile: "", aadhaar: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [donor, setDonor] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [creditScore, setCreditScore] = useState(DEMO_DONOR.creditScore);
  const [medicalInfo, setMedicalInfo] = useState(DEMO_DONOR.medicalInfo);
  const [currentDate, setCurrentDate] = useState("");

  function updateLookup(event) {
    const { name, value } = event.target;
    setLookupForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSendOtp(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!lookupForm.mobile.trim() && !lookupForm.aadhaar.trim()) {
      setError("Enter a mobile number or Aadhaar number to continue.");
      return;
    }

    setOtpSent(true);
    setSuccess("OTP sent to the registered contact. Use 123456 to continue.");
  }

  function handleVerifyOtp(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (otpValue.trim() !== "123456") {
      setError("The OTP entered is incorrect. Please use 123456.");
      return;
    }

    setDonor(DEMO_DONOR);
    setCreditScore(DEMO_DONOR.creditScore);
    setMedicalInfo(DEMO_DONOR.medicalInfo);
    setCurrentDate("");
    setSuccess("Donor profile unlocked.");
  }

  function handleSave(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!donor) {
      setError("Verify a donor profile first.");
      return;
    }

    const quarantineUntil = currentDate ? addMonths(currentDate, 3) : "";

    setDonor((prev) => ({
      ...prev,
      creditScore: Number(creditScore),
      medicalInfo,
      currentDate,
      quarantineUntil,
      quarantined: Boolean(currentDate),
    }));

    setSuccess(
      currentDate
        ? `Donor marked quarantined until ${formatDisplayDate(quarantineUntil)}.`
        : "Updates saved successfully."
    );
  }

  return (
    <div className="auth-page">
      <div className="hospital-dashboard-shell">
        <div className="auth-brand">
          <span className="logo-circle" aria-hidden="true" />
          Jeevadhwani
        </div>

        <div className="auth-card hospital-dashboard-card">
          <p className="auth-eyebrow">Hospital dashboard</p>
          <h1>Verify donor</h1>
          <p className="auth-subtitle">
            Search a donor by mobile number or Aadhaar number and review the masked profile.
          </p>

          <form className="auth-form" onSubmit={handleSendOtp}>
            <label>
              Mobile number
              <input
                type="tel"
                name="mobile"
                value={lookupForm.mobile}
                onChange={updateLookup}
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
            </label>

            <label>
              Aadhaar number
              <input
                type="text"
                name="aadhaar"
                value={lookupForm.aadhaar}
                onChange={updateLookup}
                placeholder="1234 5678 9012"
                maxLength={12}
                inputMode="numeric"
              />
            </label>

            <button type="submit" className="auth-submit">
              Send OTP
            </button>
          </form>

          {otpSent ? (
            <form className="auth-form" onSubmit={handleVerifyOtp}>
              <label>
                Enter OTP
                <input
                  type="text"
                  name="otp"
                  value={otpValue}
                  onChange={(event) => setOtpValue(event.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  inputMode="numeric"
                />
              </label>

              <button type="submit" className="auth-submit">
                Verify OTP
              </button>
            </form>
          ) : null}

          {error ? <p className="auth-error">{error}</p> : null}
          {success ? <p className="auth-help">{success}</p> : null}

          {donor ? (
            <div className="profile-card">
              <div className="profile-header">
                <div>
                  <p className="auth-eyebrow">Donor profile</p>
                  <h2>{maskText(donor.name)}</h2>
                </div>
                <span className={`status-pill ${donor.quarantined ? "quarantined" : ""}`}>
                  {donor.quarantined ? "Quarantined" : "Verified"}
                </span>
              </div>

              <div className="profile-grid">
                <div>
                  <p className="field-label"> Name</p>
                  <p className="field-value">{maskText(donor.name)}</p>
                </div>
                <div>
                  <p className="field-label"> Email</p>
                  <p className="field-value">{maskText(donor.email)}</p>
                </div>
                <div>
                  <p className="field-label"> Phone</p>
                  <p className="field-value">{maskPhone(donor.phone)}</p>
                </div>
                <div>
                  <p className="field-label">Masked Aadhaar</p>
                  <p className="field-value">{maskAadhaar(donor.aadhaarNumber)}</p>
                </div>
                <div>
                  <p className="field-label">Blood type</p>
                  <p className="field-value">{donor.bloodType}</p>
                </div>
                <div>
                  <p className="field-label">Last donated date</p>
                  <p className="field-value">{formatDisplayDate(donor.lastDonatedDate)}</p>
                </div>
                <div>
                  <p className="field-label">Quarantine end</p>
                  <p className="field-value">{formatDisplayDate(donor.quarantineUntil)}</p>
                </div>
              </div>

              <form className="auth-form" onSubmit={handleSave}>
                <label>
                  Current date
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(event) => setCurrentDate(event.target.value)}
                  />
                </label>

                <label>
                  Credit score
                  <input
                    type="number"
                    value={creditScore}
                    onChange={(event) => setCreditScore(event.target.value)}
                    min="0"
                    max="1000"
                  />
                </label>

                <label>
                  Medical information
                  <textarea
                    value={medicalInfo}
                    onChange={(event) => setMedicalInfo(event.target.value)}
                    rows="4"
                    placeholder="Add medical notes"
                  />
                </label>

                <button type="submit" className="auth-submit">
                  Save updates
                </button>
              </form>
            </div>
          ) : null}

          <p className="auth-switch">
            <Link to="/">Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HospitalDashboard;
