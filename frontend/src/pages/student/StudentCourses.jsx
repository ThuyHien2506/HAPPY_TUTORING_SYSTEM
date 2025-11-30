// src/pages/student/StudentCourses.jsx
import React from "react";
import "./StudentPages.css";

const StudentCourses = () => {
  return (
    <div className="student-page-inner">
      <div className="student-card">
        <h2 className="student-card-title">Danh sách tài liệu</h2>
        <p style={{ marginTop: 10, fontSize: 14 }}>
          Chưa có tài liệu.
        </p>
      </div>
    </div>
  );
};

export default StudentCourses;
