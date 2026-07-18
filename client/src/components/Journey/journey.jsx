import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useLanguage } from "../../hooks/useLanguage.jsx";
import "./journey.css";

function Journey() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [active, setActive] = useState(0);

  const steps = useMemo(
    () => [
      {
        id: 1,
        title: t("step1Title"),
        detail: t("step1Detail"),
        action: t("step1Action"),
      },
      {
        id: 2,
        title: t("step2Title"),
        detail: t("step2Detail"),
        action: t("step2Action"),
      },
      {
        id: 3,
        title: t("step3Title"),
        detail: t("step3Detail"),
        action: t("step3Action"),
      },
      {
        id: 4,
        title: t("step4Title"),
        detail: t("step4Detail"),
        action: t("step4Action"),
      },
      {
        id: 5,
        title: t("step5Title"),
        detail: t("step5Detail"),
        action: t("step5Action"),
      },
    ],
    [t]
  );

  const step = steps[active];

  return (
    <section className="journey" id="journey">
      <div className="container">
        <div className="journey-header">
          <p className="journey-eyebrow">{t("journeyEyebrow")}</p>
          <h2 className="journey-title">{t("journeyTitle")}</h2>
          <p className="journey-subtitle">{t("journeySubtitle")}</p>
        </div>

        <div className="journey-layout">
          <ol className="journey-steps" aria-label={t("journeyStepsLabel")}>
            {steps.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`journey-step ${active === index ? "active" : ""}`}
                  onClick={() => setActive(index)}
                  aria-current={active === index ? "step" : undefined}
                >
                  <span className="step-index">
                    {String(item.id).padStart(2, "0")}
                  </span>
                  <span className="step-title">{item.title}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="journey-panel" key={step.id}>
            <p className="panel-label">
              {t("stepOf", { current: step.id, total: steps.length })}
            </p>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
            <span className="panel-chip">{step.action}</span>

            <div className="journey-cta">
              {isAuthenticated && user?.role === "donor" ? (
                <p className="journey-status">
                  {t("journeyIn", { name: user.name.split(" ")[0] })}
                </p>
              ) : (
                <Link
                  to="/register"
                  state={{ role: "donor" }}
                  className="journey-btn"
                >
                  {t("startDonor")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Journey;
