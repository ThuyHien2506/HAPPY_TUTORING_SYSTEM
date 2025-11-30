import React from "react";
import "../../TutorFreeSlot.css";

const TutorMeetings = () => {
  return (
    <div style={{ width: "100%", padding: "25px" }}>
      {/* KHUNG TRẮNG */}
      <div className="main-card">
        {/* Dòng tab giống FreeSlot */}
        <div className="top-tabs">
          <button className="tab-btn active">Danh sách buổi gặp mặt</button>
          <button className="tab-btn">Tạo buổi tư vấn</button>
          <button className="tab-btn">Xử lý yêu cầu lịch hẹn</button>
        </div>

        {/* Nội dung bên trong khung trắng */}
        <div style={{ marginTop: "20px" }}>
          <h2>Buổi gặp mặt của tôi</h2>
          <p>
            Chưa có buổi gặp mặt nào.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorMeetings;
