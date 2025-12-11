import React, { useState } from "react";
import "../../TutorFreeSlot.css";
import "./TutorCourses.css";

const TutorCourses = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem("tutorDocuments");
    return saved ? JSON.parse(saved) : [];
  });
  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [fileCategory, setFileCategory] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const categories = ["Ngôn ngữ lập trình", "Cấu trúc dữ liệu", "OOP", "Cơ sở dữ liệu", "Mạng máy tính"];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo fake URL cho file
      const fileUrl = URL.createObjectURL(file);
      const newDoc = {
        id: Date.now(),
        name: file.name,
        title: fileName || file.name,
        description: fileDescription,
        category: fileCategory,
        fileSize: (file.size / 1024).toFixed(2),
        uploadDate: new Date().toLocaleDateString("vi-VN"),
        fileType: file.type,
        fileUrl: fileUrl,
      };

      const updatedDocs = [...documents, newDoc];
      setDocuments(updatedDocs);
      localStorage.setItem("tutorDocuments", JSON.stringify(updatedDocs));

      setUploadMessage("✓ Tài liệu đã được đăng tải thành công!");
      setFileName("");
      setFileDescription("");
      setFileCategory("");
      setTimeout(() => setUploadMessage(""), 3000);
    }
  };

  const handleDeleteDocument = (id) => {
    const updatedDocs = documents.filter((doc) => doc.id !== id);
    setDocuments(updatedDocs);
    localStorage.setItem("tutorDocuments", JSON.stringify(updatedDocs));
  };

  return (
    <div style={{ width: "100%", padding: "25px" }}>
      <div className="main-card">
        <div className="top-tabs">
          <button
            className={`tab-btn ${activeTab === 0 ? "active" : ""}`}
            onClick={() => setActiveTab(0)}
          >
            Danh sách tài liệu
          </button>
          <button
            className={`tab-btn ${activeTab === 1 ? "active" : ""}`}
            onClick={() => setActiveTab(1)}
          >
            Đăng tải tài liệu
          </button>
          <button
            className={`tab-btn ${activeTab === 2 ? "active" : ""}`}
            onClick={() => setActiveTab(2)}
          >
            Danh sách sinh viên
          </button>
        </div>

        {/* TAB 0: Danh sách tài liệu */}
        {activeTab === 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2>Danh sách tài liệu</h2>
            {documents.length === 0 ? (
              <p>Chưa có tài liệu.</p>
            ) : (
              <div className="tutor-doc-list">
                {documents.map((doc) => (
                  <div key={doc.id} className="tutor-doc-item">
                    <div className="tutor-doc-icon">📄</div>
                    <div className="tutor-doc-content">
                      <div className="tutor-doc-title">{doc.title}</div>
                      <div className="tutor-doc-meta">
                        <span className="tutor-doc-category">{doc.category}</span>
                        <span className="tutor-doc-date">{doc.uploadDate}</span>
                        <span className="tutor-doc-size">{doc.fileSize} KB</span>
                      </div>
                      {doc.description && (
                        <div className="tutor-doc-description">{doc.description}</div>
                      )}
                    </div>
                    <button
                      className="tutor-doc-delete-btn"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: Đăng tải tài liệu */}
        {activeTab === 1 && (
          <div className="upload-form-container">
            <h2>Đăng tải tài liệu mới</h2>
            
            {uploadMessage && <div className="upload-success-message">{uploadMessage}</div>}

            <div className="form-group">
              <label>Tiêu đề tài liệu</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Ví dụ: Hướng dẫn OOP trong Java"
              />
            </div>

            <div className="form-group">
              <label>Chọn danh mục</label>
              <select value={fileCategory} onChange={(e) => setFileCategory(e.target.value)}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Mô tả (tùy chọn)</label>
              <textarea
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="Nhập mô tả về tài liệu..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Chọn file</label>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.jpg,.png,.zip"
              />
            </div>

            <p className="upload-hint">
              Hỗ trợ các định dạng: PDF, Word, PowerPoint, Text, Image, ZIP
            </p>
          </div>
        )}

        {/* TAB 2: Danh sách sinh viên */}
        {activeTab === 2 && (
          <div style={{ marginTop: "20px" }}>
            <h2>Danh sách sinh viên</h2>
            <p>Chưa có sinh viên đăng ký.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorCourses;
