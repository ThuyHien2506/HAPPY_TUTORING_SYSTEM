// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Calendar động: lấy đúng tháng hiện tại + viền vàng ở ngày hôm nay
function SimpleCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();

  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let current = 1;

  let week = new Array(7).fill(null);
  for (let i = startWeekday; i < 7 && current <= daysInMonth; i++) {
    week[i] = current++;
  }
  weeks.push(week);

  while (current <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && current <= daysInMonth; i++) {
      week[i] = current++;
    }
    weeks.push(week);
  }

  const monthLabel = today.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="calendar-month-label">{monthLabel}</div>
      <table className="calendar-table">
        <thead>
          <tr>
            {daysOfWeek.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((w, wi) => (
            <tr key={wi}>
              {w.map((day, di) => {
                if (!day) return <td key={di}></td>;
                const isToday = day === todayDate;
                return (
                  <td key={di} className={isToday ? "calendar-today" : ""}>
                    {day}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function StudentDashboard() {
  const { user, token, logout } = useAuth();
  const [serverMessage, setServerMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();


  // đường dẫn ảnh từ public/static
  const bkLogoSrc = `${process.env.PUBLIC_URL}/static/bk_logo.png`;
  const studentIllusSrc = `${process.env.PUBLIC_URL}/static/student_illus.png`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, meRes] = await Promise.all([
          fetch(`${API_BASE}/api/student/dashboard`, {
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

  const handleProfile = () => {
    setMenuOpen(false);
    navigate("/student/profile"); // sau này bạn làm trang hồ sơ riêng
  };

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
  };

  const closeMenu = () => setMenuOpen(false);

  const displayName = user?.fullName || "Nguyễn Văn A";

  return (
            <div className="dashboard-root" onClick={closeMenu}>
            {/* SIDEBAR */}
                <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo-box">
                    <img
                        src={bkLogoSrc}
                        alt="BK logo"
                        className="sidebar-logo-img"
                    />
                    </div>

                    <div className="sidebar-school-text">
                    ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH
                    <br />
                    TRƯỜNG ĐẠI HỌC BÁCH KHOA
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button className="nav-item">Buổi gặp mặt</button>
                    <button className="nav-item">Khóa học</button>
                    <button className="nav-item">Tutor</button>
                </nav>
                </aside>




      {/* MAIN */}
      <main className="main-area" onClick={(e) => e.stopPropagation()}>
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left"></div>

          <div
            className="topbar-right user-menu-trigger"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          >
            <div className="avatar-small">{displayName[0]}</div>
            <span className="user-name-text">{displayName}</span>
            <span className="user-menu-arrow">▾</span>

            {menuOpen && (
              <div className="user-dropdown-menu">
                <button onClick={handleProfile}>Hồ sơ cá nhân</button>
                <button onClick={handleLogout}>Đăng xuất</button>
              </div>
            )}
          </div>
        </header>

            <section className="content-row">
            {/* Cột trái: Welcome + Upcoming + Calendar */}
            <div className="left-column">
                <div className="card upcoming-card">
                <h2 className="welcome-title">Welcome, {displayName}!</h2>

                <div className="upcoming-inner-card">
                    <h3>Upcoming Sessions</h3>
                    <p className="upcoming-main-line">Monday, April 21, 2025</p>
                    <p>10:00 AM – 11:00 AM</p>
                    <p>Room F101</p>

                    {profile && (
                    <p className="small-text">
                        MSSV: {profile.username} – Email: {profile.email}
                    </p>
                    )}

                    <p className="server-text">Server: {serverMessage}</p>
                </div>
                </div>

                <div className="card calendar-card">
                <div className="calendar-header">
                    <button className="calendar-button">Calendar</button>
                    <div className="calendar-code-icon">{"</>"}</div>
                </div>
                <div className="calendar-placeholder">
                    <SimpleCalendar />
                </div>
                </div>
            </div>

            {/* Cột phải: illustration phóng to */}
            <div className="illustration-wrapper">
                <img
                src={studentIllusSrc}
                alt="Student illustration"
                className="illustration-img"
                />
            </div>
            </section>

      </main>
    </div>
  );
}
