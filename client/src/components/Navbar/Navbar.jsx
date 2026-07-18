import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useLanguage } from "../../hooks/useLanguage.jsx";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const role = user?.role || "donor";

  return (
    <header className="navbar">
      <div className="container nav-wrapper">
        <Link to="/" className="logo">
          <span className="logo-circle" aria-hidden="true" />
          <span className="logo-text">{t("brand")}</span>
        </Link>

        <nav aria-label="Primary">
          <ul className="nav-links">
            <li>
              <a href="#emergency">{t("navEmergency")}</a>
            </li>
            <li>
              <a href="#journey">{t("navJourney")}</a>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <label className="lang-select-wrap">
            <span className="visually-hidden">{t("language")}</span>
            <select
              className="lang-select"
              value={lang}
              onChange={(event) => setLang(event.target.value)}
              aria-label={t("language")}
            >
              <option value="en">{t("english")}</option>
              <option value="ml">{t("malayalam")}</option>
            </select>
          </label>

          {isAuthenticated ? (
            <>
              <div className="user-chip">
                <span className="user-name">{user.name}</span>
                <span className="user-role">
                  {user.role === "hospital" ? t("roleHospital") : t("roleDonor")}
                </span>
              </div>
              <button type="button" className="login logout" onClick={logout}>
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <div className="role-toggle" role="group" aria-label="Account type">
                <Link
                  to="/register"
                  className={`role ${role === "donor" ? "active" : ""}`}
                  state={{ role: "donor" }}
                >
                  {t("imDonor")}
                </Link>
                <Link
                  to="/register"
                  className={`role ${role === "hospital" ? "active" : ""}`}
                  state={{ role: "hospital" }}
                >
                  {t("imHospital")}
                </Link>
              </div>

              <Link to="/login" className="login">
                {t("login")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
