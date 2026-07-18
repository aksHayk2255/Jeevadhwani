import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import Hero from "../components/Hero/Hero.jsx";
import Emergency from "../components/Emergency/Emergency.jsx";
import Journey from "../components/Journey/journey.jsx";

function Home() {
  const { user } = useAuth();
  const isDonor = user?.role === "donor";
  const [selectedBloodType, setSelectedBloodType] = useState("O+");

  return (
    <>
      <Navbar />
      <main>
        {isDonor && (
          <div style={{ textAlign: "center", padding: "1rem 1rem 0" }}>
            <Link to="/donor-dashboard" style={{ color: "#dc2626", fontWeight: 700 }}>
              View donor dashboard
            </Link>
          </div>
        )}
        <Hero
          selectedBloodType={selectedBloodType}
          onBloodTypeChange={setSelectedBloodType}
        />
        <Emergency selectedBloodType={selectedBloodType} />
        <Journey />
      </main>
    </>
  );
}

export default Home;
