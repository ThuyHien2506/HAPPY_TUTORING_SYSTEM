// src/pages/student/StudentHome.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import * as tutorService from "../../service/tutorService";
import "./StudentHome.css";

const StudentHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');

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

  const handleRegisterTutor = async () => {
    try {
      setError('');
      const userBkNetId = user?.bkNetId || user?.id;
      const enrollments = await tutorService.getStudentEnrollments(userBkNetId);
      
      if (enrollments && enrollments.length > 0) {
        setError(`Bạn đã có tutor rồi. Không thể đăng ký tutor mới`);
        return;
      }
      
      // Nếu chưa có tutor, điều hướng tới trang đăng ký
      navigate("/student/register-tutor");
    } catch (err) {
      console.error('Error checking tutor:', err);
      setError('Có lỗi khi kiểm tra tutor');
    }
  };

  return (
    <div className="student-home-wrapper">
      <div className="student-home-hero">
        <div className="hero-text">
          <p className="hero-subtitle">Welcome back,</p>
          <h1 className="hero-title">{user.name}!</h1>

          {error && <div className="error-message">{error}</div>}

          <button className="hero-button" onClick={handleRegisterTutor}>
            Đăng kí tutor
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
