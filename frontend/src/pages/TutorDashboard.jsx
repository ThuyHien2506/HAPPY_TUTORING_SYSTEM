import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

export default function TutorDashboard() {
  const { user, token, logout } = useAuth();
  const [serverMessage, setServerMessage] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, meRes] = await Promise.all([
          fetch(`${API_BASE}/api/tutor/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/sso/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setServerMessage(await dashRes.text());
        setProfile(await meRes.json());
      } catch (err) {
        console.error(err);
        setServerMessage("Không lấy được dữ liệu từ server");
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    logout();
    window.location.href = "/"; // quay về trang có nút Đăng nhập bằng SSO
  };

  return (
    <div className="dashboard-root">
      <aside className="sidebar">
        <div className="sidebar-logo">BK</div>
        <div className="sidebar-title">Tutor Support</div>
        <nav className="sidebar-nav">
          <button className="nav-item active">Trang chủ</button>
          <button className="nav-item">Buổi gặp mặt</button>
          <button className="nav-item">Tài liệu</button>
          <button className="nav-item">Sinh viên</button>
        </nav>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <h2>Welcome, {user?.fullName}!</h2>
            <p>Tutor</p>
            {profile && (
              <p className="small-text">
                Mã cán bộ: {profile.username} – Email: {profile.email}
              </p>
            )}
          </div>
          <div className="topbar-right">
            <div className="avatar-small">{user?.fullName?.[0]}</div>
            <span>{user?.fullName}</span>
            <button className="link-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </header>

        <section className="content-row">
          <div className="card upcoming-card">
            <h3>Upcoming Sessions</h3>
            <p>Các buổi dạy sắp tới với sinh viên.</p>
            <p className="server-text">Server: {serverMessage}</p>
          </div>
          <div className="card calendar-card">
            <h3>Calendar</h3>
            <div className="calendar-placeholder">
              <span>Lịch tutor (mock)</span>
            </div>
          </div>
        </section>

        <section className="content-row banner-row">
          <div className="banner-card card">
            <h4>Buổi gặp mặt</h4>
            <p>Quản lý buổi gặp mặt với sinh viên.</p>
          </div>
          <div className="banner-card card">
            <h4>Tài liệu</h4>
            <p>Quản lý tài liệu giảng dạy.</p>
          </div>
          <div className="banner-card card">
            <h4>Sinh viên</h4>
            <p>Xem danh sách sinh viên phụ trách.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
