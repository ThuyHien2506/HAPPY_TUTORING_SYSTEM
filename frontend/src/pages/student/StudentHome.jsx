// src/pages/student/StudentHome.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "./StudentHome.css";

const StudentHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (user.role !== "student") {
      navigate("/tutor/home");
    }
  }, [user, navigate]);

  if (!user || user.role !== "student") return null;

  const handleRegisterTutor = () => {
    if (user.isTutorRegistered) {
      // Hiển thị thông báo nếu đã đăng ký tutor rồi
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } else {
      // Chuyển đến trang đăng ký tutor
      navigate("/student/register-tutor");
    }
  };

  return (
    <div className="student-home-wrapper">
      {showMessage && (
        <div className="tutor-registered-message">
          <p>ℹ️ Bạn đã có tutor rồi!</p>
        </div>
      )}
      
      <div className="student-home-hero">
        <div className="hero-text">
          <p className="hero-subtitle">Welcome back,</p>
          <h1 className="hero-title">{user.name}!</h1>

          <button 
            className={`hero-button ${user.isTutorRegistered ? 'registered' : ''}`}
            onClick={handleRegisterTutor}
          >
            {user.isTutorRegistered ? '✓ Đã đăng ký tutor' : 'Đăng kí tutor'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
