import React from "react";
import "../../TutorFreeSlot.css";

const TutorCourses = () => {
  return (
    <div style={{ width: "100%", padding: "25px" }}>
      <div className="main-card">
        <div className="top-tabs">
          <button className="tab-btn active">Danh sách tài liệu</button>
          <button className="tab-btn">Đăng tải tài liệu</button>
          <button className="tab-btn">Danh sách sinh viên</button>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h2>Danh sách tài liệu</h2>
          <p>
            Chưa có tài liệu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorCourses;
