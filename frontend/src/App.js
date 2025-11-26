// src/App.js
import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Trang Happy – có nút Đăng nhập bằng HCMUT SSO */}
      <Route path="/" element={<LandingPage />} />

      {/* Trang SSO (CAS) */}
      <Route path="/sso/login" element={<LoginPage />} />

      {/* Dashboard sinh viên */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute roles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Dashboard tutor */}
      <Route
        path="/tutor/dashboard"
        element={
          <ProtectedRoute roles={["TUTOR"]}>
            <TutorDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
