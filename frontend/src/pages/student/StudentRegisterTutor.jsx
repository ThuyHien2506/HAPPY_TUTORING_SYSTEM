// src/pages/student/StudentRegisterTutor.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "./StudentRegisterTutor.css";

const StudentRegisterTutor = () => {
  const navigate = useNavigate();
  const { registerAsTutor } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRegisterComplete = () => {
    // Đánh dấu tutor đã đăng ký
    registerAsTutor();
    setIsSubmitted(true);
    
    // Quay về trang chủ sau 2 giây
    setTimeout(() => {
      navigate("/student/home");
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="student-register-wrapper">
        <div className="student-register-card success">
          <h2>✓ Đăng ký thành công</h2>
          <p>Bạn đã đăng ký trở thành tutor thành công!</p>
          <p className="redirect-text">Đang quay về trang chủ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-register-wrapper">
      <div className="student-register-card">
        <h2>Đăng kí trở thành tutor</h2>
        <p>
          Đây là trang đăng kí tutor (demo). Sau này bạn có thể thêm form đăng
          ký chi tiết ở đây.
        </p>
        <p>
          Ví dụ: chọn môn muốn dạy, thời gian rảnh, mô tả kinh nghiệm, v.v.
        </p>
        <button className="register-btn" onClick={handleRegisterComplete}>
          Hoàn thành đăng ký
        </button>
      </div>
    </div>
  );
};

export default StudentRegisterTutor;
