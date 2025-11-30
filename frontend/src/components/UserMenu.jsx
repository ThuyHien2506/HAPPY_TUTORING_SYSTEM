// src/components/UserMenu.jsx
import React, { useState } from "react";
import avatarImg from "../assets/avatar.svg"; // chỉnh path nếu khác

const UserMenu = ({ name, firstLabel, onFirstClick, onLogout }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((o) => !o);

  const handleFirst = () => {
    setOpen(false);
    if (onFirstClick) onFirstClick();
  };

  const handleLogout = () => {
    setOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <div className="user-menu-wrapper">
      <div className="user-info" onClick={toggle}>
        <img src={avatarImg} alt="User" className="user-avatar" />
        <span>{name}</span>
      </div>

      {open && (
        <div className="user-dropdown-card">
          {firstLabel && (
            <button
              type="button"
              className="user-dropdown-item"
              onClick={handleFirst}
            >
              {firstLabel}
            </button>
          )}

          <button
            type="button"
            className="user-dropdown-item user-dropdown-danger"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
