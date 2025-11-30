// src/pages/student/StudentDashboard.jsx
import React from "react";
import "./StudentPages.css";

const StudentDashboard = () => {
  return (
    <div className="student-page">
      <h2 style={{ color: "#002b5c", marginTop: 0 }}>Trang chủ sinh viên</h2>
      <p>
        Chọn <b>Buổi gặp mặt</b>, <b>Khóa học</b> hoặc <b>Hồ sơ cá nhân</b> trong
        menu bên trái để bắt đầu.
      </p>
    </div>
  );
};

export default StudentDashboard;
