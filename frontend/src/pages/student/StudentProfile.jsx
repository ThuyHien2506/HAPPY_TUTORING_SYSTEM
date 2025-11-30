import React from "react";
import "./StudentPages.css";
import avatarImg from "../../assets/avatar.svg";   // ← thêm dòng này

const StudentProfile = () => {
  return (
    <div className="student-page-inner">
      <div className="student-card profile-card">
        <div className="profile-left">

          <div className="profile-avatar-circle">
            <img src={avatarImg} alt="Avatar" className="profile-avatar-image" />
          </div>
          <div className="profile-name-block">
            <div className="profile-name">Nguyễn Văn A</div>
            <div className="profile-role">Sinh viên</div>
            <button className="profile-btn">Thêm ảnh</button>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-row">
            <span className="profile-label">Họ và tên</span>
            <span className="profile-value">Nguyễn Văn A</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Mã sinh viên</span>
            <span className="profile-value">123456</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Khoa/Bộ môn</span>
            <span className="profile-value">Khoa học và Kỹ thuật máy tính</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Chuyên ngành</span>
            <span className="profile-value">Khoa học máy tính</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">a.nguyenvan@hcmut.edu.vn</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Số điện thoại</span>
            <span className="profile-value">0999 999 999</span>
          </div>
        </div>
      </div>

      <div className="student-card history-card">
        <h3 className="student-card-title">Lịch sử đăng kí</h3>

        <table className="history-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Môn</th>
              <th>Tutor</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>20-09-2025</td>
              <td>Toán rời rạc</td>
              <td>Nguyễn Thị B</td>
              <td>Hoàn tất</td>
            </tr>
            <tr>
              <td>19-09-2025</td>
              <td>Giải tích</td>
              <td>Trần Văn C</td>
              <td>Hủy</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentProfile;
