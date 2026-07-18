import SearchDonour from "../SearchDonour/SearchDonour.jsx";
import { useLanguage } from "../../hooks/useLanguage.jsx";
import "./Hero.css";

function Hero({ selectedBloodType, onBloodTypeChange }) {
  const { t } = useLanguage();

  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow">{t("heroEyebrow")}</p>
          <h1 className="hero-title">
            {t("heroTitle")}
            <span>{t("heroTitleAccent")}</span>
          </h1>
          <p className="hero-text">{t("heroText")}</p>
          <div className="ecg" aria-hidden="true">
            <div className="ecg-track">
              <svg
                className="ecg-svg"
                viewBox="0 0 240 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 20 H48 L58 20 L68 4 L78 36 L88 20 H128 L138 20 L148 4 L158 36 L168 20 H240"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className="ecg-svg"
                viewBox="0 0 240 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 20 H48 L58 20 L68 4 L78 36 L88 20 H128 L138 20 L148 4 L158 36 L168 20 H240"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <SearchDonour
          selectedBloodType={selectedBloodType}
          onBloodTypeChange={onBloodTypeChange}
        />
      </div>
    </section>
  );
}

export default Hero;
