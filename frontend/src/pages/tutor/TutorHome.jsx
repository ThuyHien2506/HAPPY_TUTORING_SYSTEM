// src/pages/tutor/TutorHome.js
import React from "react";
import "./TutorHome.css";

const TutorHome = () => {
  return (
    <div className="tutor-home-wrapper">
      <div className="tutor-home-hero">
        <div className="tutor-hero-text">
          <p className="tutor-hero-subtitle">Welcome back,</p>
          <h1 className="tutor-hero-title">Trần Văn B!</h1>

          <button className="tutor-hero-button">
            Xem lịch dạy
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorHome;
