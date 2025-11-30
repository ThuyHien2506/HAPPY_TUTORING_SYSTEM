﻿// src/Layout.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import "./Layout.css";
import { Calendar, BookOpen, Settings, Bell } from "react-feather";

import logoImg from "./assets/logo-bk.png";
import avatarImg from "./assets/avatar.svg";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNoti, setShowNoti] = useState(false);

  const path = location.pathname;

  // ❗ Chỉ active khi đúng trang tương ứng
  const isMeetings = path.startsWith("/tutor/meetings");
  const isCourses = path.startsWith("/tutor/courses");
  const isProfile = path.startsWith("/tutor/profile");
  // /tutor/home sẽ không rơi vào 3 cái này → không có gì active

  const goHome = () => navigate("/tutor/home");

  const handleLogout = () => {
    navigate("/"); // thoát về landing page
  };

  return (
    <div className="app-wrapper">
      {/* HEADER */}
      <header className="main-header">
        <div className="header-left" onClick={goHome} style={{ cursor: "pointer" }}>
          <img src={logoImg} alt="Logo" className="header-logo" />
          <h1 className="header-title">TUTOR SUPPORT SYSTEM</h1>
        </div>

        <div className="header-right">
          {/* Chuông thông báo */}
          <div className="bell-wrapper">
            <Bell
              size={24}
              className="icon-bell"
              color="white"
              onClick={() => setShowNoti(!showNoti)}
            />
            {showNoti && (
              <div className="noti-popup">
                <div className="noti-title">Thông báo</div>
                <ul>
                  <li>Bạn có 1 buổi tutor vào 14:00 chiều nay.</li>
                  <li>1 sinh viên vừa gửi yêu cầu lịch mới.</li>
                </ul>
              </div>
            )}
          </div>

          {/* User + menu */}
          <div
            className="user-info clickable"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img src={avatarImg} alt="User" className="user-avatar" />
            <span>Trần Văn B</span>
          </div>

          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-item" onClick={goHome}>
                Trang tổng quan
              </div>
              <div className="user-menu-item logout" onClick={handleLogout}>
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="app-body">
        {/* SIDEBAR */}
        <aside className="main-sidebar">
          <div
            className={`nav-item ${isMeetings ? "active" : ""}`}
            onClick={() => navigate("/tutor/meetings")}
          >
            <Calendar size={30} />
            <span>Buổi gặp mặt</span>
          </div>
          <hr className="nav-divider" />

          <div
            className={`nav-item ${isCourses ? "active" : ""}`}
            onClick={() => navigate("/tutor/courses")}
          >
            <BookOpen size={30} />
            <span>Khóa học</span>
          </div>
          <hr className="nav-divider" />

          <div
            className={`nav-item ${isProfile ? "active" : ""}`}
            onClick={() => navigate("/tutor/profile")}
          >
            <Settings size={30} />
            <span>Hồ sơ cá nhân</span>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="page-content">{children}</main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
