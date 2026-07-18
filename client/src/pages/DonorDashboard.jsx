import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import "./DonorDashboard.css";

function DonorDashboard() {
  const { user } = useAuth();
  const donorName = user?.name || "Donor";

  if (user && user.role !== "donor") {
    return <Navigate to="/" replace />;
  }
  const stats = [
    { label: "Total donations", value: "6" },
    { label: "Lives helped", value: "18" },
    { label: "Last donation", value: "Jun 10, 2026" },
    { label: "Next eligible", value: "Aug 12, 2026" },
  ];

  const breakdown = [
    { label: "Whole blood", value: 45, color: "#ff6b6b" },
    { label: "Platelets", value: 25, color: "#4ecdc4" },
    { label: "Plasma", value: 20, color: "#45b7d1" },
    { label: "Other", value: 10, color: "#f7b267" },
  ];

  const history = [
    {
      date: "2026-06-10",
      type: "Whole blood",
      center: "City Hospital",
      impact: "3 lives helped",
    },
    {
      date: "2026-03-21",
      type: "Platelets",
      center: "Sunrise Medical Center",
      impact: "2 lives helped",
    },
    {
      date: "2025-11-05",
      type: "Plasma",
      center: "City Hospital",
      impact: "4 lives helped",
    },
  ];

  const total = breakdown.reduce((sum, item) => sum + item.value, 0);
  const pieStyle = {
    background: `conic-gradient(${breakdown
      .map((item, index) => {
        const start = breakdown
          .slice(0, index)
          .reduce((sum, current) => sum + current.value, 0);
        const end = start + item.value;
        return `${item.color} ${start / total * 100}% ${end / total * 100}%`;
      })
      .join(", ")})`,
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card dashboard-header">
        <div>
          <p className="eyebrow">Donor dashboard</p>
          <h1>Welcome back, {donorName}</h1>
          <p className="subtext">
            Your donation journey is making a real difference in the community.
          </p>
        </div>
        <Link to="/" className="back-link">
          Back to home
        </Link>
      </div>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="dashboard-card" key={stat.label}>
            <p className="stat-label">{stat.label}</p>
            <h2>{stat.value}</h2>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="dashboard-card chart-card">
          <div className="card-heading">
            <h3>Donation types</h3>
            <span>Last 12 months</span>
          </div>

          <div className="chart-layout">
            <div className="pie-chart" style={pieStyle}>
              <div className="pie-center">
                <strong>6</strong>
                <span>donations</span>
              </div>
            </div>

            <ul className="legend">
              {breakdown.map((item) => (
                <li key={item.label}>
                  <span className="legend-color" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="dashboard-card info-card">
          <div className="card-heading">
            <h3>Donor profile</h3>
            <span>Ready to help</span>
          </div>
          <ul className="profile-list">
            <li>
              <span>Blood type</span>
              <strong>O+</strong>
            </li>
            <li>
              <span>Preferred center</span>
              <strong>City Hospital</strong>
            </li>
            <li>
              <span>Recent impact</span>
              <strong>18 lives helped</strong>
            </li>
            <li>
              <span>Health note</span>
              <strong>Eligible for next donation</strong>
            </li>
          </ul>
        </article>
      </section>

      <section className="dashboard-card">
        <div className="card-heading">
          <h3>Donation history</h3>
          <span>Recent records</span>
        </div>

        <div className="history-list">
          {history.map((entry) => (
            <div className="history-item" key={entry.date}>
              <div>
                <strong>{entry.type}</strong>
                <p>{entry.center}</p>
              </div>
              <div className="history-meta">
                <span>{entry.date}</span>
                <strong>{entry.impact}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DonorDashboard;
