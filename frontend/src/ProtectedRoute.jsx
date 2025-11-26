import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();

  // Nếu chưa đăng nhập -> quay về trang "/" (có nút Đăng nhập bằng SSO)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Sai role -> 403
  if (roles && !roles.includes(user.role)) {
    return (
      <div style={{ padding: 40 }}>
        403 - Bạn không có quyền truy cập trang này.
      </div>
    );
  }

  return children;
}
