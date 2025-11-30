import React from "react";
import { useNavigate } from "react-router-dom";
import "./TutorProfile.css";

// Bạn có thể đổi sang ảnh avatar thật của bạn
import avatarImg from "../../assets/avatar.svg";

const TutorProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="tutor-profile-page">
      {/* Tabs trên cùng: Thông tin cá nhân / Lịch rảnh */}
      <div className="top-tabs">
        <button className="tab-btn tab-btn-active">
          Thông tin cá nhân
        </button>
        <button
          className="tab-btn"
          onClick={() => navigate("/tutor/free-slots")}
        >
          Lịch rảnh
        </button>
      </div>

      {/* Card trắng thông tin tutor */}
      <div className="profile-card">
        {/* Cột trái: avatar + tên + nút thêm ảnh */}
        <div className="profile-left">
          <div className="avatar-circle">
            <img src={avatarImg} alt="Avatar" className="avatar-img" />
          </div>

          <div className="tutor-name">Trần Văn B</div>

          <button className="add-photo-btn">Thêm ảnh</button>
        </div>

        {/* Cột phải: bảng thông tin */}
        <div className="profile-right">
          <div className="profile-row header-row">
            <div className="col-label">Họ và tên</div>
            <div className="col-value">Trần Văn B</div>
          </div>
          <div className="profile-row">
            <div className="col-label">Mã giảng viên</div>
            <div className="col-value">1234567</div>
          </div>
          <div className="profile-row">
            <div className="col-label">Khoa/Bộ môn</div>
            <div className="col-value">Khoa học và Kỹ thuật máy tính</div>
          </div>
          <div className="profile-row">
            <div className="col-label">Chuyên ngành</div>
            <div className="col-value">Khoa học máy tính</div>
          </div>
          <div className="profile-row">
            <div className="col-label">Email</div>
            <div className="col-value">tutor.support@hcmut.edu.vn</div>
          </div>
          <div className="profile-row">
            <div className="col-label">Số điện thoại</div>
            <div className="col-value">0999 999 999</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
