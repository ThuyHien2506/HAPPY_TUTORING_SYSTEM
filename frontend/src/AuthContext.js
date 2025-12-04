// src/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /**
   * login(userData):
   *   userData là object chứa thông tin user:
   *   {
   *     bkNetId,
   *     name,
   *     role,          // 'tutor' hoặc 'student'
   *     email,
   *     faculty,
   *     major,
   *     phoneNumber,
   *     gpa,
   *     yearOfStudy,
   *     ...
   *   }
   */
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
