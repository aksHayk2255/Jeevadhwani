import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { LanguageProvider } from "./hooks/useLanguage.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import HospitalLogin from "./pages/HospitalLogin.jsx";
import HospitalDashboard from "./pages/HospitalDashboard.jsx";
import Register from "./pages/Register.jsx";
import DonorDashboard from "./pages/DonorDashboard.jsx";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/hospital-login" element={<HospitalLogin />} />
            <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/donor-dashboard" element={<DonorDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
