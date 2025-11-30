// src/pages/student/StudentHome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentHome.css";

const StudentHome = () => {
  const navigate = useNavigate();

  const handleRegisterTutor = () => {
    // sau này bạn đổi sang route đăng ký tutor thật
    alert("Trang đăng ký tutor (demo). Bạn gắn route thật ở đây.");
  };

  return (
    <div className="student-home-wrapper">
      <div className="student-home-hero">
        <div className="hero-text">
          <p className="hero-subtitle">Welcome back,</p>
          <h1 className="hero-title">Nguyễn Văn A!</h1>

          <button className="hero-button" onClick={handleRegisterTutor}>
            Đăng kí tutor
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
