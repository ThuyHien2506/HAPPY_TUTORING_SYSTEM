// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SsoLoginPage from "./pages/SsoLoginPage";
import SsoForgotPage from "./pages/SsoForgotPage";
import StudentRegisterTutor from "./pages/student/StudentRegisterTutor";

import Layout from "./Layout";                 // tutor layout
import TutorHome from "./pages/tutor/TutorHome";
import TutorMeetings from "./pages/tutor/TutorMeetings";
import TutorCourses from "./pages/tutor/TutorCourses";
import TutorProfile from "./pages/tutor/TutorProfile";
import TutorFreeSlot from "./TutorFreeSlot";

// ==== STUDENT IMPORTS ====
import StudentLayout from "./pages/student/StudentLayout";
import StudentHome from "./pages/student/StudentHome";
import StudentMeetings from "./pages/student/StudentMeetings";
import StudentCourses from "./pages/student/StudentCourses";
import StudentProfile from "./pages/student/StudentProfile";

function App() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<HomePage />} />

      {/* SSO */}
      <Route path="/login" element={<SsoLoginPage />} />
      <Route path="/sso/forgot" element={<SsoForgotPage />} />

      {/* ==== STUDENT (dùng StudentLayout + Outlet) ==== */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentHome />} />
        <Route path="meetings" element={<StudentMeetings />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="register-tutor" element={<StudentRegisterTutor />} />
      </Route>

      {/* ==== TUTOR (dùng Layout bọc children) ==== */}
      <Route
        path="/tutor/home"
        element={
          <Layout>
            <TutorHome />
          </Layout>
        }
      />
      <Route
        path="/tutor/meetings"
        element={
          <Layout>
            <TutorMeetings />
          </Layout>
        }
      />
      <Route
        path="/tutor/courses"
        element={
          <Layout>
            <TutorCourses />
          </Layout>
        }
      />
      <Route
        path="/tutor/profile"
        element={
          <Layout>
            <TutorProfile />
          </Layout>
        }
      />
      <Route
        path="/tutor/free-slots"
        element={
          <Layout>
            <TutorFreeSlot />
          </Layout>
        }
      />
      <Route path="/tutor" element={<Navigate to="/tutor/home" />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
import "./App.css";
// import RegisterTutor from './RegisterTutor';
import LayoutTutor from "./layout/layoutTutor/Layout";
import TutorFreeSlot from "./TutorFreeSlot"; // Import component FreeSlot
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppointmentBooking from "./StudentAppointment/StudentAppointment"; // Giả định import AppointmentBooking
import LayoutStudent from "./layout/layoutSv/LayoutSv";
import CourseStd from "./pages/feedback/CourseStd";
import FeedbackPage from "./pages/feedback/FeedbackPage";
//import Handlerequest from "./pages/handleappointment/Handlerequest";
import TutorHandleRequest from "./TutorHandleRequest/TutorHandleRequest";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================================= */}
        {/* 1. ROUTES CHUNG / TRANG CHỦ (STUDENT DEFAULT) */}
        {/* ========================================================= */}

        {/* Trang chủ: Mặc định hiển thị CourseStd cho Student */}
        <Route
          path="/"
          element={
            <LayoutStudent>
              <CourseStd />
            </LayoutStudent>
          }
        />

        {/* ========================================================= */}
        {/* 2. ROUTES DÀNH CHO STUDENT */}
        {/* ========================================================= */}

        {/* Trang danh sách khóa học của Student (CourseStd) */}
        <Route
          path="/course"
          element={
            <LayoutStudent>
              <CourseStd />
            </LayoutStudent>
          }
        />

        {/* Trang Feedback chi tiết (có tham số :id) */}
        <Route
          path="/course/feedback/:id"
          element={
            <LayoutStudent>
              <FeedbackPage />
            </LayoutStudent>
          }
        />

        {/* [ROUTE BỔ SUNG] Trang Đặt lịch hẹn (AppointmentBooking) */}
        <Route
          path="/booking"
          element={
            <LayoutStudent>
              <AppointmentBooking />
            </LayoutStudent>
          }
        />

        {/* [ROUTE BỔ SUNG] Trang đăng ký gia sư (RegisterTutor) - Nếu component này tồn tại */}
        {/* <Route
          path="/register-tutor"
          element={<RegisterTutor />}
        /> */}

        {/* ========================================================= */}
        {/* 3. ROUTES DÀNH CHO TUTOR */}
        {/* ========================================================= */}

        {/* [ROUTE BỔ SUNG] Trang quản lý Khung giờ trống (TutorFreeSlot) */}
        <Route
          path="/tutor/freeslot"
          element={
            <LayoutTutor>
              <TutorFreeSlot />
            </LayoutTutor>
          }
        />

        {/* [ROUTE BỔ SUNG] Trang Dashboard mặc định của Tutor */}
        <Route
          path="/tutor/meetings"
          element={
            <LayoutTutor>
              {/* Thay thế bằng component Dashboard thực tế của Tutor */}
              <TutorHandleRequest />
            </LayoutTutor>
          }
        />

        {/* Thêm các route Tutor khác như /tutor/profile, /tutor/appointments... ở đây */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
