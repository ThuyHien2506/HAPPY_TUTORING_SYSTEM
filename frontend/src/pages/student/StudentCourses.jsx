// src/pages/student/StudentCourses.jsx
import React, { useState, useEffect } from "react";
import "./StudentPages.css";
import "./StudentCourses.css";

const StudentCourses = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Lấy tài liệu từ localStorage của tutor
    const savedDocs = localStorage.getItem("tutorDocuments");
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
  }, []);

  const handleDownloadDocument = (doc) => {
    // Tạo một fake download (trong thực tế sẽ gọi API backend)
    const element = document.createElement("a");
    element.href = doc.fileUrl;
    element.download = doc.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="student-page-inner">
      <div className="student-card">
        <h2 className="student-card-title">Danh sách tài liệu</h2>
        
        {documents.length === 0 ? (
          <p style={{ marginTop: 10, fontSize: 14 }}>
            Chưa có tài liệu.
          </p>
        ) : (
          <div className="student-doc-list">
            {documents.map((doc) => (
              <div key={doc.id} className="student-doc-item">
                <div 
                  className="student-doc-icon"
                  onClick={() => handleDownloadDocument(doc)}
                  style={{ cursor: 'pointer' }}
                >
                  📄
                </div>
                <div 
                  className="student-doc-info"
                  onClick={() => handleDownloadDocument(doc)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="student-doc-title">{doc.title}</div>
                  <div className="student-doc-meta">
                    <span className="student-doc-category">{doc.category}</span>
                    <span className="student-doc-date">Ngày: {doc.uploadDate}</span>
                    <span className="student-doc-size">Dung lượng: {doc.fileSize} KB</span>
                  </div>
                  {doc.description && (
                    <div className="student-doc-description">{doc.description}</div>
                  )}
                </div>
                <button
                  className="student-doc-download-btn"
                  onClick={() => handleDownloadDocument(doc)}
                  title="Tải xuống"
                >
                  ⬇️ Tải xuống
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
