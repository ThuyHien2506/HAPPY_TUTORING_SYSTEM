import React, { useState, useEffect } from "react";
import "./SsoLoginPage.css";
import logo from "../assets/logo-bk.png";
import { ssoLogin } from "../api/ssoApi";

function getServiceParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get("service") || "http://localhost:3000/sso/callback";
}

const SsoLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [service, setService] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setService(getServiceParam());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await ssoLogin(username, password, service);

      if (!data.redirectUrl) {
        setError(data.message || "Đăng nhập thất bại");
        return;
      }

      // Chuyển tới URL trả về kèm ticket
      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error(err);
      setError("Không kết nối được tới máy chủ SSO");
    }
  };

  const handleClear = () => {
    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <div className="sso-page">
      <header className="sso-topbar">
        <div className="sso-topbar-inner">
          <div className="sso-topbar-logo">
            <img src={logo} alt="BK Logo" className="sso-logo" />
          </div>
          <h1 className="sso-topbar-title">DỊCH VỤ XÁC THỰC TẬP TRUNG</h1>
        </div>
      </header>

      <main className="sso-main">
        <div className="sso-card">
          <div className="sso-left">
            <h2>Nhập thông tin tài khoản của bạn</h2>

            {error && <div className="sso-error">{error}</div>}

            <form onSubmit={handleSubmit} className="sso-form">
              <div className="sso-form-group">
                <label htmlFor="username">Tên tài khoản</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="sso-input"
                />
              </div>

              <div className="sso-form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sso-input"
                />
              </div>

              <div className="sso-form-remember">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember">
                  Cảnh báo trước khi tôi đăng nhập vào các trang web khác.
                </label>
              </div>

              <div className="sso-form-actions">
                <button type="submit" className="sso-btn sso-btn-primary">
                  Đăng nhập
                </button>
                <button
                  type="button"
                  className="sso-btn sso-btn-secondary"
                  onClick={handleClear}
                >
                  Xóa
                </button>
              </div>

              <a href="#/" className="sso-change-password">
                Thay đổi mật khẩu?
              </a>
            </form>
          </div>

          <div className="sso-right">
            <h3>Hỗ trợ kỹ thuật</h3>
            <p>
              Email: <a href="mailto:support@hcmut.edu.vn">support@hcmut.edu.vn</a> | ĐT: (84-8) 38647256 – 7204
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SsoLoginPage;
