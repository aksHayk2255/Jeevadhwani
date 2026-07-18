import { useEffect, useState } from "react";
import { createBloodRequest, getNearestDonor } from "../../services/api.js";
import { useLanguage } from "../../hooks/useLanguage.jsx";
import "./SearchDonour.css";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

function SearchDonour({ selectedBloodType = "O+", onBloodTypeChange }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(selectedBloodType);
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    setSelected(selectedBloodType);
  }, [selectedBloodType]);

  useEffect(() => {
    let cancelled = false;

    async function loadDonor() {
      setLoading(true);
      setError("");
      setRequestStatus("");

      try {
        const data = await getNearestDonor(selected);
        if (!cancelled) {
          setDonor(data.donor);
        }
      } catch (err) {
        if (!cancelled) {
          setDonor(null);
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDonor();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  async function handleRequestBlood() {
    if (!donor) return;

    setRequesting(true);
    setRequestStatus("");

    try {
      await createBloodRequest({
        donorId: donor.id,
        bloodType: selected,
        requesterName: "Jeevadhwani User",
        message: `Need ${selected} blood urgently`,
      });
      setRequestStatus("sent");
    } catch (err) {
      setRequestStatus(err.message);
    } finally {
      setRequesting(false);
    }
  }

  return (
    <aside className="donor-card" aria-label={t("findDonor")}>
      <p className="donor-card-label">{t("findDonor")}</p>

      <div className="blood-grid" role="group" aria-label={t("bloodType")}>
        {BLOOD_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={`blood-btn ${selected === type ? "selected" : ""}`}
            onClick={() => {
              setSelected(type);
              onBloodTypeChange?.(type);
            }}
            aria-pressed={selected === type}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="donor-result">
        {loading ? (
          <p className="donor-meta">{t("findingDonor")}</p>
        ) : error ? (
          <p className="donor-error">{error}</p>
        ) : donor ? (
          <>
            <div className="donor-info">
              <span className="status-dot" aria-hidden="true" />
              <div>
                <p className="donor-name">{donor.name}</p>
                <p className="donor-meta">
                  {donor.distance} · {donor.id}
                </p>
              </div>
            </div>

            <div className="donor-actions">
              <span className="blood-tag">{selected}</span>
              <button
                type="button"
                className="request-btn"
                onClick={handleRequestBlood}
                disabled={requesting}
              >
                {requesting ? t("sending") : t("requestBlood")}
              </button>
            </div>
          </>
        ) : null}
      </div>

      {requestStatus ? (
        <p
          className={`request-status ${
            requestStatus === "sent" ? "ok" : "err"
          }`}
        >
          {requestStatus === "sent" ? t("requestSent") : requestStatus}
        </p>
      ) : null}
    </aside>
  );
}

export default SearchDonour;
