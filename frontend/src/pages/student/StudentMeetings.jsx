// src/pages/student/StudentMeetings.jsx
import React from "react";
import "./StudentPages.css";

const StudentMeetings = () => {
  return (
    <div className="student-page-inner">
      <div className="student-card">
        <h2 className="student-card-title">Buổi gặp mặt của tôi</h2>
        <p style={{ marginTop: 10, fontSize: 14 }}>
          Chưa có buổi gặp.
        </p>
      </div>
    </div>
  );
};

export default StudentMeetings;
