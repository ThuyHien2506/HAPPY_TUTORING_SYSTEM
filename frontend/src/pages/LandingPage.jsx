import React from "react";

export default function LandingPage() {
  const goToSSO = () => {
    // Redirect rõ ràng sang trang SSO
    window.location.href = "/sso/login";
  };

  return (
    <div className="landing-container">
      <div className="landing-left">
        <div className="logo">BK</div>
        <h2>TRƯỜNG ĐH BÁCH KHOA</h2>
        <h1>HAPPY TUTORING SYSTEM</h1>
        <p>
          Hệ thống hỗ trợ dạy kèm cho sinh viên HCMUT. Đăng nhập một lần qua
          HCMUT SSO để truy cập các chức năng dành cho sinh viên và tutor.
        </p>
        <button className="primary-btn" onClick={goToSSO}>
          Đăng nhập bằng HCMUT SSO
        </button>
      </div>

      <div className="landing-right">
        <div className="illustration-card">
          <div className="avatar-circle" />
          <div className="fake-lines" />
        </div>
      </div>

      <div className="landing-footer">
        © 2024 Happy Tutoring System - HCMUT.
      </div>
    </div>
  );
}
