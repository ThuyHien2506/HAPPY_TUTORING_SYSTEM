// src/StudentAppointment.jsx
import "./StudentAppointment.css"; 
import React, { useState, useEffect } from "react";
import Calendar from "./Calendar"; 

// Import service
import {
  bookAppointment,
  getTutorFreeSlots,
  getStudentAppointments,
  cancelAppointment,
  getOfficialMeetings, 
  cancelMeeting        
} from "../service/studentService"; 

// --- MOCK DATA ---
const rawSampleData = [
  {
    meetingID: 1,
    date: "2025-11-30",
    timestart: "08:00",
    timeend: "10:00",
    topic: "Ôn tập Toán Cao Cấp - Ma trận",
  },
  {
    meetingID: 2,
    date: "2025-12-01",
    timestart: "14:00",
    timeend: "16:00",
    topic: "Lập trình Web - ReactJS cơ bản",
  },
  {
    meetingID: 3,
    date: "2025-12-05",
    timestart: "09:30",
    timeend: "11:30",
    topic: "Tiếng Anh giao tiếp - Topic: Travel",
  },
];

const formattedSampleMeetings = rawSampleData.map((item, index) => {
  return {
    meetingId: item.meetingID,
    topic: item.topic,
    startTime: `${item.date}T${item.timestart}:00`, 
    endTime: `${item.date}T${item.timeend}:00`,
    type: index === 1 ? "CONSULTATION" : "APPOINTMENT", 
    status: "SCHEDULED", 
    onlineLink: "https://meet.google.com/sample-link",
  };
});

function StudentAppointment({ studentId = 1, tutorId = 1 }) {
  // --------- STATE CHÍNH ----------
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(""); 
  const [preferredStart, setPreferredStart] = useState(""); 
  const [preferredEnd, setPreferredEnd] = useState("");     
  const [topic, setTopic] = useState("");
  
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState("");

  const [meetingList, setMeetingList] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);

  const [activeTab, setActiveTab] = useState("list"); 

  const [freeSlots, setFreeSlots] = useState([]);          
  const [availableRanges, setAvailableRanges] = useState([]); 
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  // --------- STATE CHO MODAL HỦY ----------
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [cancelReasonInput, setCancelReasonInput] = useState("");

  // --------- HELPERS ----------
  const toLocalDateString = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const formatDateForInput = (d) => toLocalDateString(d);

  const formatDateTimeFull = (startStr, endStr) => {
    if (!startStr || !endStr) return "N/A";
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    const dateLabel = start.toLocaleDateString("vi-VN");
    const startTime = start.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    
    return `${startTime} - ${endTime}, ngày ${dateLabel}`;
  };

  // --------- API CALLS (Giữ nguyên) ----------
  useEffect(() => {
    if (activeTab === 'book') {
        const fetchSlots = async () => {
        try {
            setLoadingSlots(true);
            setSlotsError("");
            setFreeSlots([]);
            setAvailableRanges([]);
            setTime("");

            const data = await getTutorFreeSlots(tutorId);
            const safeData = Array.isArray(data) ? data : [];
            setFreeSlots(safeData);

            const todayKey = toLocalDateString(date);
            const todaySlot = safeData.find((s) => s.date === todayKey);

            if (todaySlot && todaySlot.timeRanges && todaySlot.timeRanges.length) {
            setAvailableRanges(todaySlot.timeRanges);
            const first = todaySlot.timeRanges[0];
            const startLabel = first.startTime.slice(0, 5);
            const endLabel = first.endTime.slice(0, 5);
            setTime(`${startLabel} - ${endLabel}`);
            }
        } catch (err) {
            console.error("Get free slots error:", err);
            setSlotsError("Không tải được lịch rảnh của tutor.");
        } finally {
            setLoadingSlots(false);
        }
        };
        fetchSlots();
    }
  }, [tutorId, activeTab]); 
  
  const loadAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      setAppointmentsError("");
      const data = await getStudentAppointments(studentId || 1);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Get appointments error:", err);
      setAppointmentsError("Không tải được danh sách lịch hẹn.");
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'book') {
        loadAppointments();
    }
  }, [studentId, activeTab]);

  const fetchOfficialMeetings = async () => {
    try {
      setLoadingMeetings(true);
      const data = await getOfficialMeetings(studentId || 1);
      
      if (Array.isArray(data) && data.length > 0) {
        setMeetingList(data);
      } else {
        setMeetingList(formattedSampleMeetings);
      }

    } catch (err) {
      setMeetingList(formattedSampleMeetings); 
    } finally {
      setLoadingMeetings(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'list') {
        fetchOfficialMeetings();
    }
  }, [studentId, activeTab]);

  // --------- HANDLERS CHUNG ----------
  const handleChangeDate = (newDate) => {
    setDate(newDate);
    const key = toLocalDateString(newDate);
    const slot = freeSlots.find(
      (s) => s.date === key && s.timeRanges && s.timeRanges.length
    );

    if (slot) {
      setAvailableRanges(slot.timeRanges);
      const first = slot.timeRanges[0];
      const startLabel = first.startTime.slice(0, 5);
      const endLabel = first.endTime.slice(0, 5);
      setTime(`${startLabel} - ${endLabel}`);
    } else {
      setAvailableRanges([]);
      setTime("");
    }
  };

  const handleCustomCalendarSelect = (dateString) => {
      const newDate = new Date(dateString);
      handleChangeDate(newDate);
  };

  const availableDatesList = freeSlots.map(slot => slot.date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    setErrorMsg("");

    if (!time) { setErrorMsg("Vui lòng chọn khung giờ rảnh của tutor."); return; }
    if (!preferredStart || !preferredEnd) { setErrorMsg("Vui lòng nhập giờ hẹn bạn mong muốn."); return; }
    if (!topic.trim()) { setErrorMsg("Vui lòng nhập nội dung buổi hẹn."); return; }

    const dateKey = toLocalDateString(date); 
    const studentTimeRange = `${preferredStart} - ${preferredEnd}`;

    try {
      await bookAppointment({
        studentId: studentId || 1, 
        tutorId: tutorId || 1,
        dateKey,
        timeRange: studentTimeRange,
        topic: topic.trim(),
      });

      setStatusMsg("Đặt lịch thành công!");
      loadAppointments(); 
    } catch (err) {
      console.error("Booking error:", err);
      const status = err.response?.status;
      const msg = err.response?.data || "";
      setErrorMsg(`Lỗi từ server (status ${status}): ${msg}`);
    }
  };

  // --------- HANDLERS CHO MODAL HỦY ----------
  
  // 1. Mở Modal
  const handleOpenCancelModal = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setCancelReasonInput(""); // Reset lý do
    setShowCancelModal(true);
  };

  // 2. Đóng Modal
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSelectedMeetingId(null);
  };

  // 3. Xác nhận hủy (Gọi API)
  const handleConfirmCancel = async () => {
    if (!cancelReasonInput.trim()) {
      alert("Vui lòng nhập lý do hủy!");
      return;
    }

    // Xử lý Mock Data
    const isMock = formattedSampleMeetings.some(m => m.meetingId === selectedMeetingId);
    if (isMock) {
        alert("Đây là dữ liệu mẫu, thao tác hủy đã được ghi nhận trên giao diện demo!");
        setMeetingList(prev => prev.map(m => 
            m.meetingId === selectedMeetingId ? { ...m, status: "CANCELLED" } : m
        ));
        handleCloseCancelModal();
        return;
    }

    // Xử lý Real Data
    try {
      await cancelMeeting(selectedMeetingId, cancelReasonInput);
      alert("Đã hủy thành công!");
      fetchOfficialMeetings(); 
      handleCloseCancelModal();
    } catch (err) {
      alert("Hủy thất bại: " + (err.response?.data || "Lỗi server"));
    }
  };

  const handleCancelAppointment = async (appt) => {
    const reason = window.prompt("Lý do hủy:");
    if (!reason) return;
    try {
        await cancelAppointment(appt.meetingId, reason);
        loadAppointments();
    } catch(err) {
        alert("Lỗi hủy: " + err);
    }
  }

  // --------- RENDER COMPONENT ----------

  const renderMeetingList = () => {
    if (loadingMeetings) return <p>Đang tải danh sách...</p>;
    if (meetingList.length === 0) return <p>Bạn chưa có buổi gặp mặt nào sắp tới.</p>;

    return (
      <div className="meeting-list-container">
        {meetingList.map((mt) => {
          const isAppointment = mt.type === "APPOINTMENT";
          const badgeLabel = isAppointment ? "BUỔI HẸN" : "BUỔI HỘI THẢO";
          const badgeClass = isAppointment ? "badge-appointment" : "badge-consultation";
          const locationInfo = mt.onlineLink ? `Online: ${mt.onlineLink}` : "Hình thức: Online (Google Meet)";

          // LOGIC KIỂM TRA THỜI GIAN (Chỉ cho phép hủy nếu thời gian > hiện tại)
          const meetingStartTime = new Date(mt.startTime);
          const now = new Date();
          const isFuture = meetingStartTime > now;

          return (
            <div key={mt.meetingId} className="meeting-card">
              <div className="meeting-info">
                <div className="meeting-topic">
                  Chủ đề: {mt.topic}
                </div>
                <div className="meeting-time">
                  Thời gian: {formatDateTimeFull(mt.startTime, mt.endTime)}
                </div>
                <div className="meeting-detail">
                  {locationInfo}
                </div>
              </div>

              <div className="meeting-actions">
                <span className={`meeting-badge ${badgeClass}`}>
                  {badgeLabel}
                </span>
                
                {/* Chỉ hiện nút Hủy nếu: Status là SCHEDULED VÀ Thời gian là Tương lai */}
                {mt.status === "SCHEDULED" && isFuture && (
                  <button 
                    className="btn-cancel-meeting"
                    onClick={() => handleOpenCancelModal(mt.meetingId)}
                  >
                    Hủy đăng ký
                  </button>
                )}

                {/* Nếu đã quá hạn nhưng chưa hoàn thành (ví dụ pending) thì không hiện nút hủy */}
                {mt.status === "SCHEDULED" && !isFuture && (
                   <span style={{fontSize: '12px', color: '#666', fontStyle:'italic'}}>Đã diễn ra</span>
                )}
                
                {mt.status === "CANCELLED" && (
                    <span className="status-cancelled">ĐÃ HỦY</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAppointmentList = () => {
    if (appointmentsLoading) return <p>Đang tải...</p>;
    if (!appointments.length) return <p>Hiện chưa có lịch hẹn nào.</p>;

    return (
      <div className="appointment-list">
        {appointments.map((appt) => {
          const status = (appt.appointmentStatus || appt.status || "PENDING").toUpperCase();
          const startIso = appt.startTime || appt.date;
          const endIso = appt.endTime;
          let dateLabel = "";
          let timeLabel = "";

          if (startIso) {
            const start = new Date(startIso);
            const end = endIso ? new Date(endIso) : null;
            dateLabel = start.toLocaleDateString("vi-VN");
            timeLabel = end
              ? `${start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
              : start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
          }
          return (
            <div key={appt.meetingId} className="appointment-card">
              <div className="appointment-main">
                <div className="appointment-topic">{appt.topic}</div>
                <div className="appointment-meta">
                  <span>{dateLabel}</span><span>•</span><span>{timeLabel}</span>
                </div>
              </div>
              <div className="appointment-actions">
                <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
                {status === "PENDING" && (
                  <button type="button" className="btn-cancel-appointment" onClick={() => handleCancelAppointment(appt)}>Hủy</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="booking-page">
      <div className="booking-tabs">
        <button
          className={`tab-btn ${activeTab === "list" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          Danh sách buổi gặp mặt
        </button>
        <button
          className={`tab-btn ${activeTab === "book" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("book")}
        >
          Lịch hẹn
        </button>
        <button
          className={`tab-btn ${activeTab === "consult" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("consult")}
        >
          Đăng kí buổi tư vấn
        </button>
      </div>

      <div className="tutor-section">
        <div className="tutor-section-title">Tutor của bạn</div>
        <div className="tutor-card">
          <div className="avatar-circle">T</div>
          <div className="tutor-info">
            <div className="tutor-name">Trần Văn B</div>
            <div className="tutor-dept">Khoa: Khoa học và Kỹ thuật máy tính</div>
          </div>
        </div>
      </div>

      {activeTab === "list" && (
        <div className="booking-card">
          <h3 className="card-section-title">Buổi gặp mặt của tôi</h3>
          <div className="booking-body" style={{ display: 'block' }}> 
            {renderMeetingList()}
          </div>
        </div>
      )}

      {activeTab === "book" && (
        <>
          <div className="booking-card">
            <h3 className="card-section-title">Đặt lịch hẹn</h3>
            <div className="booking-body">
              <div className="calendar-section">
                <Calendar
                    activeDate={toLocalDateString(date)}
                    onSelect={handleCustomCalendarSelect}
                    availableDates={availableDatesList}
                />
                {slotsError && <p className="error-text" style={{ marginTop: 8 }}>{slotsError}</p>}
              </div>

              <div className="booking-right">
                <form className="booking-form" onSubmit={handleSubmit}>
                   <div className="form-group">
                    <label>Ngày đã chọn</label>
                    <div className="form-input-wrapper">
                      <input type="date" className="form-input" value={formatDateForInput(date)} readOnly />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Khung giờ rảnh của tutor</label>
                    <select
                        className="form-input"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        disabled={loadingSlots || availableRanges.length === 0}
                      >
                        {loadingSlots && <option>Đang tải khung giờ...</option>}
                        {!loadingSlots && availableRanges.length === 0 && <option value="">Không có khung giờ rảnh</option>}
                        {!loadingSlots && availableRanges.map((range, idx) => {
                            const l = `${range.startTime.slice(0, 5)} - ${range.endTime.slice(0, 5)}`;
                            return <option key={idx} value={l}>{l}</option>;
                          })}
                      </select>
                  </div>
                  <div className="form-group">
                    <label>Giờ hẹn bạn mong muốn</label>
                    <div className="form-input-wrapper" style={{ display: "flex", gap: 8 }}>
                      <input type="time" className="form-input" value={preferredStart} onChange={(e) => setPreferredStart(e.target.value)} disabled={availableRanges.length === 0 || !time} />
                      <span style={{ alignSelf: "center" }}>–</span>
                      <input type="time" className="form-input" value={preferredEnd} onChange={(e) => setPreferredEnd(e.target.value)} disabled={availableRanges.length === 0 || !time} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nội dung</label>
                    <input type="text" className="form-input" placeholder="Nhập nội dung" value={topic} onChange={(e) => setTopic(e.target.value)} />
                  </div>
                  {errorMsg && <p className="error-text">{errorMsg}</p>}
                  {statusMsg && <p className="success-text">{statusMsg}</p>}
                  <button type="submit" className="primary-btn">Gửi yêu cầu</button>
                </form>
              </div>
            </div>
          </div>

          <div className="booking-card" style={{ marginTop: '20px' }}>
            <h3 className="card-section-title">Lịch sử đặt hẹn</h3>
            {renderAppointmentList()}
          </div>
        </>
      )}

      {activeTab === "consult" && (
        <div className="booking-card">
          <h3 className="card-section-title">Đăng kí buổi tư vấn</h3>
          <div className="booking-body">
            <p>Tab đăng kí buổi tư vấn sẽ được triển khai sau.</p>
          </div>
        </div>
      )}

      {/* --- MODAL HỦY ĐĂNG KÝ (POPUP) --- */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={handleCloseCancelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Xác nhận hủy đăng ký</div>
            <div className="modal-body">
              <p style={{marginBottom: '10px', fontSize: '14px', color:'#555'}}>
                Bạn có chắc chắn muốn hủy buổi gặp mặt này không? Vui lòng nhập lý do:
              </p>
              <textarea
                value={cancelReasonInput}
                onChange={(e) => setCancelReasonInput(e.target.value)}
                placeholder="Ví dụ: Tôi có việc bận đột xuất..."
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn-modal-close" onClick={handleCloseCancelModal}>Đóng</button>
              <button className="btn-modal-confirm" onClick={handleConfirmCancel}>Xác nhận hủy</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentAppointment;