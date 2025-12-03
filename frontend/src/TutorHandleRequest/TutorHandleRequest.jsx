// src/TutorHandleRequest.jsx
import React, { useEffect, useState } from "react";
import "./TutorHandleRequest.css";

import {
  getPendingAppointments,
  approveAppointment,
  rejectAppointment,
  returnMeetingSlot,
  getTutorMeetings,
  getTutorCancelableMeetings,
  cancelTutorMeeting,
} from "../service/tutorService";

const TUTOR_ID_DEFAULT = 1;

// ---------- HELPER: Status & Filter (Giống Student) ----------
const isCancelled = (m) =>
  typeof m.status === "string" && m.status.toUpperCase() === "CANCELLED";

const filterActiveMeetings = (list = []) =>
  list.filter((m) => !isCancelled(m));

// ---------- HELPER: Time Status ----------
const getTimeStatus = (startStr, endStr) => {
  const now = new Date();
  const start = new Date(startStr);
  const end = new Date(endStr);

  if (now > end)
    return { label: "Đã diễn ra", className: "time-status-past" };
  if (now >= start && now <= end)
    return { label: "Đang diễn ra", className: "time-status-ongoing" };
  return { label: "Sắp diễn ra", className: "time-status-upcoming" };
};

// ---------- HELPER: Format Date Full ----------
const formatDateTimeFull = (startStr, endStr) => {
  if (!startStr || !endStr) return "N/A";
  const start = new Date(startStr);
  const end = new Date(endStr);
  const dateLabel = start.toLocaleDateString("vi-VN");
  const startTime = start.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${startTime} - ${endTime}, ngày ${dateLabel}`;
};

// Helper format cho tab Request (giữ lại từ logic cũ nếu cần dùng cho tab Request)
const formatRangeForList = (obj) => {
  if (!obj) return { dateLabel: "", timeLabel: "" };
  const dateSource = obj.startTime || obj.date;
  const d = new Date(dateSource);
  const dateLabel = !isNaN(d) ? d.toLocaleDateString("vi-VN") : "";
  
  const s = new Date(obj.startTime || obj.start);
  const e = new Date(obj.endTime || obj.end);
  const start = !isNaN(s) ? s.toLocaleTimeString("vi-VN", {hour:"2-digit", minute:"2-digit"}) : "";
  const end = !isNaN(e) ? e.toLocaleTimeString("vi-VN", {hour:"2-digit", minute:"2-digit"}) : "";
  
  return { dateLabel, timeLabel: `${start} - ${end}` };
};

function TutorHandleRequest({ tutorId = TUTOR_ID_DEFAULT }) {
  // ---------- TABS ----------
  const [activeTab, setActiveTab] = useState("list"); // "list" | "create" | "request"

  // ---------- MEETING LIST STATE ----------
  const [meetings, setMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [isCancelMode, setIsCancelMode] = useState(false); // Chế độ Hủy

  // Modal Cancel (List Tab)
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [cancelReasonInput, setCancelReasonInput] = useState("");

  // ---------- PENDING APPOINTMENTS STATE ----------
  const [appointments, setAppointments] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [pendingErrorMsg, setPendingErrorMsg] = useState("");
  const [selected, setSelected] = useState(null); // chi tiết pending
  const [statusMsg, setStatusMsg] = useState("");

  // Modal Reject (Request Tab)
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [returnSlotChoice, setReturnSlotChoice] = useState("no");

  // ============================================================
  //                LOAD MEETINGS (Tab 1: Danh sách)
  // ============================================================
  const loadMeetings = async () => {
    try {
      setLoadingMeetings(true);
      let data = [];

      if (isCancelMode) {
        data = await getTutorCancelableMeetings(tutorId || TUTOR_ID_DEFAULT);
      } else {
        data = await getTutorMeetings(tutorId || TUTOR_ID_DEFAULT);
      }
      
      const safeData = Array.isArray(data) ? data : [];
      // Nếu không phải chế độ hủy, lọc bỏ các meeting đã hủy để danh sách sạch sẽ
      setMeetings(filterActiveMeetings(safeData));

    } catch (err) {
      console.error("Load meetings error:", err);
      setMeetings([]);
    } finally {
      setLoadingMeetings(false);
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      loadMeetings();
    }
  }, [tutorId, activeTab, isCancelMode]);

  // ============================================================
  //                LOAD PENDING (Tab 3: Request)
  // ============================================================
  const loadPending = async () => {
    try {
      setLoadingPending(true);
      setPendingErrorMsg("");
      const data = await getPendingAppointments(tutorId || TUTOR_ID_DEFAULT);
      if (Array.isArray(data)) {
        const onlyPending = data.filter(
          (appt) => (appt.appointmentStatus || appt.status || "").toUpperCase() === "PENDING"
        );
        setAppointments(onlyPending);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      setPendingErrorMsg("Không tải được danh sách yêu cầu.");
      setAppointments([]);
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    if (activeTab === "request") {
      loadPending();
      setSelected(null);
    }
  }, [tutorId, activeTab]);

  // ============================================================
  //                     ACTIONS - CANCEL LIST
  // ============================================================
  const handleToggleCancelMode = () => {
    setIsCancelMode(!isCancelMode);
  };

  const handleOpenCancelModal = (id) => {
    setSelectedMeetingId(id);
    setCancelReasonInput("");
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSelectedMeetingId(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReasonInput.trim()) {
      alert("Nhập lý do!");
      return;
    }
    try {
      // --- SỬA DÒNG NÀY ---
      // Truyền thêm tham số thứ 3 là tutorId (hoặc TUTOR_ID_DEFAULT)
      await cancelTutorMeeting(
        selectedMeetingId, 
        cancelReasonInput.trim(), 
        tutorId || TUTOR_ID_DEFAULT
      ); 
      // --------------------

      alert("Đã hủy thành công!");
      await loadMeetings(); 
      handleCloseCancelModal();
    } catch (err) {
      console.error("Hủy lỗi:", err);
      // Hiển thị thông báo lỗi cụ thể từ backend nếu có
      const msg = err.response?.data || "Lỗi server";
      alert("Hủy thất bại: " + msg);
    }
  };

  // ============================================================
  //                     ACTIONS - PENDING REQUESTS
  // ============================================================
  const handleViewDetail = (appt) => { setSelected(appt); setStatusMsg(""); };
  const handleBackFromDetail = () => { setSelected(null); loadPending(); };

  const handleApprove = async () => {
    if (!selected) return;
    if (!window.confirm("Phê duyệt yêu cầu này?")) return;
    try {
      await approveAppointment(selected.meetingId, tutorId || TUTOR_ID_DEFAULT);
      alert("Đã phê duyệt!");
      handleBackFromDetail();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data || "Server error"));
    }
  };

  const handleOpenRejectModal = () => {
    setRejectReason("");
    setReturnSlotChoice("no");
    setShowRejectModal(true);
  };
  const handleCloseRejectModal = () => setShowRejectModal(false);

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) { alert("Nhập lý do!"); return; }
    try {
      await rejectAppointment(selected.meetingId, tutorId || TUTOR_ID_DEFAULT, rejectReason);
      if (returnSlotChoice === "yes") {
        await returnMeetingSlot(tutorId || TUTOR_ID_DEFAULT, selected.meetingId);
      }
      alert("Đã từ chối!");
      handleCloseRejectModal();
      handleBackFromDetail();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data));
    }
  };

  // ============================================================
  //                          RENDER
  // ============================================================

  // ----- RENDER TAB 1: MEETING LIST (Đã chuẩn hóa giống Student) -----
  const renderMeetingList = () => {
    if (loadingMeetings) return <p>Đang tải danh sách...</p>;
    
    // Đã filter ở loadMeetings, nhưng filter lại ở đây cho chắc chắn hiển thị
    const visibleMeetings = filterActiveMeetings(meetings);

    if (visibleMeetings.length === 0) return <p>Không có buổi gặp mặt nào.</p>;

    return (
      <div className="meeting-list-container">
        {visibleMeetings.map((mt) => {
          // Logic xác định Badge (Hẹn vs Hội thảo)
          // Giả sử backend trả về type="APPOINTMENT" giống student
          const isAppt = (mt.type === "APPOINTMENT"); 
          const badgeLabel = isAppt ? "BUỔI HẸN" : "BUỔI HỘI THẢO";
          const badgeClass = isAppt ? "badge-appointment" : "badge-consultation";
          
          const timeStatus = getTimeStatus(mt.startTime, mt.endTime);

          return (
            <div key={mt.meetingId} className="meeting-card">
              <div className="meeting-info">
                <div className="meeting-topic">Chủ đề: {mt.topic}</div>
                <div className="meeting-time">
                  Thời gian: {formatDateTimeFull(mt.startTime, mt.endTime)}
                </div>
                <div className="meeting-detail">
                  {mt.onlineLink
                    ? `Online: ${mt.onlineLink}`
                    : "Online (Google Meet)"}
                </div>
                {/* Nếu muốn hiển thị tên sinh viên */}
                {mt.studentId && <div className="meeting-detail">Sinh viên ID: {mt.studentId}</div>}
              </div>

              <div className="meeting-actions">
                <span className={`meeting-badge ${badgeClass}`}>
                  {badgeLabel}
                </span>

                {isCancelMode ? (
                  <button
                    className="btn-cancel-meeting"
                    onClick={() => handleOpenCancelModal(mt.meetingId)}
                  >
                    Hủy lịch
                  </button>
                ) : (
                  <span className={`time-status-label ${timeStatus.className}`}>
                    {timeStatus.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ----- MAIN RENDER -----
  return (
    <div className="tutor-page">
      <div className="tutor-tabs">
        <button
          className={`tab-btn ${activeTab === "list" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          Danh sách buổi gặp mặt
        </button>
        <button
          className={`tab-btn ${activeTab === "create" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Tạo buổi tư vấn
        </button>
        <button
          className={`tab-btn ${activeTab === "request" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("request")}
        >
          Xử lí yêu cầu lịch hẹn
        </button>
      </div>

      {/* TAB 1 CONTENT */}
      {activeTab === "list" && (
        <div className="booking-card">
          <div className="card-header-row-custom">
            <h3 className="card-section-title" style={{border:0, margin:0}}>
              {isCancelMode ? "Chọn buổi gặp mặt để hủy" : "Buổi gặp mặt của tôi"}
            </h3>
            <button
              className={`btn-mode-switch ${isCancelMode ? "btn-back-mode" : "btn-cancel-mode"}`}
              onClick={handleToggleCancelMode}
            >
              {isCancelMode ? "← Quay lại danh sách" : "Hủy lịch hẹn"}
            </button>
          </div>
          <div style={{borderBottom: "1px solid #eee", marginBottom: "20px"}}></div>

          <div className="booking-body">
            {renderMeetingList()}
          </div>
        </div>
      )}

      {/* TAB 2 CONTENT */}
      {activeTab === "create" && (
        <div className="booking-card">
          <h3 className="card-section-title">Tạo buổi tư vấn</h3>
          <div className="booking-body"><p>Chức năng đang phát triển...</p></div>
        </div>
      )}

      {/* TAB 3 CONTENT: REQUEST */}
      {activeTab === "request" && !selected && (
        <div className="booking-card">
           <h3 className="card-section-title">Danh sách yêu cầu chờ duyệt</h3>
           <div className="booking-body">
             {loadingPending && <p>Loading...</p>}
             {!loadingPending && appointments.length === 0 && <p>Không có yêu cầu nào.</p>}
             {appointments.map(appt => {
               const {dateLabel, timeLabel} = formatRangeForList(appt);
               return (
                 <div key={appt.meetingId} className="appointment-card">
                   <div className="appointment-main">
                     <div className="appointment-topic">{appt.topic}</div>
                     <div className="appointment-meta">
                       <span>{dateLabel}</span> • <span>{timeLabel}</span>
                     </div>
                   </div>
                   <div className="appointment-actions">
                     <span className="status-badge status-pending">PENDING</span>
                     <button className="primary-btn-outline" onClick={()=>handleViewDetail(appt)}>Xem chi tiết</button>
                   </div>
                 </div>
               )
             })}
           </div>
        </div>
      )}

      {activeTab === "request" && selected && (
        /* DETAIL VIEW */
        <div className="booking-card">
           <div className="detail-header">
              <button className="btn-back-icon" onClick={handleBackFromDetail}>←</button>
              <h3 className="card-section-title detail-title">Chi tiết #{selected.meetingId}</h3>
           </div>
           
           {/* Sử dụng hàm formatRangeForList để lấy ngày giờ hiển thị */}
           {(() => {
             const { dateLabel, timeLabel } = formatRangeForList(selected);
             return (
               <div className="tutor-request-grid">
                  <div className="info-group">
                      <div className="tutor-request-row">
                        <div className="tutor-request-label">Sinh viên ID</div>
                        <div className="tutor-request-value highlight-text">{selected.studentId}</div>
                      </div>
                      <div className="tutor-request-row">
                        <div className="tutor-request-label">Nội dung</div>
                        <div className="tutor-request-value main-topic">{selected.topic}</div>
                      </div>
                  </div>

                  {/* --- PHẦN BỊ THIẾU ĐÃ ĐƯỢC THÊM LẠI DƯỚI ĐÂY --- */}
                  <div className="info-group two-col">
                    <div className="tutor-request-row">
                      <div className="tutor-request-label">Ngày diễn ra</div>
                      <div className="tutor-request-value">{dateLabel}</div>
                    </div>
                    <div className="tutor-request-row">
                      <div className="tutor-request-label">Khung giờ</div>
                      <div className="tutor-request-value">{timeLabel}</div>
                    </div>
                  </div>
                  {/* ------------------------------------------------ */}

                  <div className="tutor-request-actions">
                    <button className="btn-danger-outline" onClick={handleOpenRejectModal}>Từ chối</button>
                    <button className="btn-primary" onClick={handleApprove}>Phê duyệt</button>
                  </div>
               </div>
             );
           })()}
        </div>
      )}

      {/* MODAL REJECT (PENDING) */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={handleCloseRejectModal}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">Từ chối yêu cầu</div>
            <div className="modal-body">
               <textarea className="tutor-reject-textarea" placeholder="Lý do..." value={rejectReason} onChange={e=>setRejectReason(e.target.value)} />
               <div className="modal-section">
                  <label className="modal-label">Trả slot lại thành rảnh?</label>
                  <div className="tutor-return-slot-options">
                    <label className="radio-option"><input type="radio" checked={returnSlotChoice==="yes"} onChange={()=>setReturnSlotChoice("yes")} /> Có</label>
                    <label className="radio-option"><input type="radio" checked={returnSlotChoice==="no"} onChange={()=>setReturnSlotChoice("no")} /> Không</label>
                  </div>
               </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-close" onClick={handleCloseRejectModal}>Đóng</button>
              <button className="btn-modal-confirm-reject" onClick={handleConfirmReject}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CANCEL (MEETING LIST) */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={handleCloseCancelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Xác nhận hủy buổi gặp mặt</div>
            <div className="modal-body">
              <p>Nhập lý do hủy:</p>
              <textarea value={cancelReasonInput} onChange={(e) => setCancelReasonInput(e.target.value)} autoFocus />
            </div>
            <div className="modal-footer">
              <button className="btn-modal-close" onClick={handleCloseCancelModal}>Đóng</button>
              <button className="btn-modal-confirm" onClick={handleConfirmCancel}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TutorHandleRequest;