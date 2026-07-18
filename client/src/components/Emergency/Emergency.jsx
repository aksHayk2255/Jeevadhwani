import { useMemo, useState } from "react";
import { sendEmergencyBroadcast } from "../../services/api.js";
import { useLanguage } from "../../hooks/useLanguage.jsx";
import "./Emergency.css";

const RADAR_DOTS = [
  { x: 28, y: 42 },
  { x: 62, y: 24 },
  { x: 78, y: 48 },
  { x: 48, y: 72 },
  { x: 22, y: 68 },
  { x: 70, y: 70 },
  { x: 38, y: 30 },
  { x: 58, y: 56 },
];

function Emergency({ selectedBloodType = "O+" }) {
  const { t } = useLanguage();
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const dots = useMemo(() => {
    if (!result?.matchedCount) {
      return RADAR_DOTS.map((dot) => ({ ...dot, status: "idle" }));
    }

    return RADAR_DOTS.map((dot, index) => {
      if (index < Math.min(result.matchedCount, 3)) {
        return { ...dot, status: "received" };
      }
      if (index < Math.min(result.matchedCount, 6)) {
        return { ...dot, status: "waiting" };
      }
      return { ...dot, status: "idle" };
    });
  }, [result]);

  async function handleBroadcast() {
    setSending(true);
    setError("");

    try {
      const data = await sendEmergencyBroadcast({
        bloodType: selectedBloodType,
        radiusKm: 5,
        message: `Critical need for ${selectedBloodType} donors nearby`,
      });
      setResult(data.broadcast);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="emergency" id="emergency">
      <div className="container">
        <div className="emergency-panel">
          <div className="emergency-copy">
            <p className="emergency-eyebrow">{t("emergencyEyebrow")}</p>
            <h2 className="emergency-title">{t("emergencyTitle")}</h2>
            <p className="emergency-text">{t("emergencyText")}</p>

            <div className="emergency-actions">
              <div className="broadcast-chip">
                <span>{t("broadcastingFor")}</span>
                <strong>{selectedBloodType}</strong>
              </div>
              <button
                type="button"
                className="broadcast-btn"
                onClick={handleBroadcast}
                disabled={sending}
              >
                {sending ? t("broadcasting") : t("sendBroadcast")}
              </button>
            </div>

            {result ? (
              <p className="broadcast-feedback ok">
                {t("alertSent", {
                  count: result.matchedCount,
                  type: selectedBloodType,
                  plural: result.matchedCount === 1 ? "" : "s",
                })}
              </p>
            ) : null}
            {error ? <p className="broadcast-feedback err">{error}</p> : null}
          </div>

          <div className="radar-wrap" aria-hidden="true">
            <div className="radar">
              <span className="radar-ring ring-1" />
              <span className="radar-ring ring-2" />
              <span className="radar-ring ring-3" />
              <span className="radar-sweep" />
              <span className="radar-center">{selectedBloodType}</span>
              {dots.map((dot, index) => (
                <span
                  key={index}
                  className={`radar-dot ${dot.status}`}
                  style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                />
              ))}
            </div>

            <ul className="radar-legend">
              <li>
                <span className="legend-dot idle" />
                {t("notYetBroadcast")}
              </li>
              <li>
                <span className="legend-dot waiting" />
                {t("waiting")}
              </li>
              <li>
                <span className="legend-dot received" />
                {t("received")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Emergency;
