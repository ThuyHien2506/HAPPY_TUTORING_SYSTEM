// src/service/tutorService.js
import apiClient from "./apiClient";

// GET all PENDING appointments for a tutor
export const getPendingAppointments = async (tutorId) => {
  const res = await apiClient.get(
    "/api/tutor/scheduling/appointments/pending",
    { params: { tutorId } }
  );
  return res.data; // List<Appointment>
};

// POST approve
export const approveAppointment = async (appointmentId, tutorId) => {
  const res = await apiClient.post(
    `/api/tutor/scheduling/appointments/${appointmentId}/approve`,
    { tutorId }
  );
  return res.data;
};

// POST reject
export const rejectAppointment = async (appointmentId, tutorId, reason) => {
  const res = await apiClient.post(
    `/api/tutor/scheduling/appointments/${appointmentId}/reject`,
    { tutorId, reason }
  );
  return res.data;
};

// Trả slot khi tutor chọn trả lại slot rảnh
export const returnMeetingSlot = async (tutorId, meetingId) => {
  const res = await apiClient.post(
    `/api/tutor/scheduling/tutor/${tutorId}/meetings/${meetingId}/return-slot`
  );
  return res.data;
};

// 🔹 Lấy danh sách meeting chính thức của tutor
export const getTutorMeetings = async (tutorId) => {
  const res = await apiClient.get(
    "/api/tutor/scheduling/meetings/official",
    { params: { tutorId } }
  );
  return res.data; // List<Meeting>
};

// 🔹 Lấy danh sách meeting mà tutor được phép hủy
export const getTutorCancelableMeetings = async (tutorId) => {
  const res = await apiClient.get(
    "/api/tutor/scheduling/meetings/cancelable",
    { params: { tutorId } }
  );
  return res.data; // List<Meeting>
};

export const cancelTutorMeeting = async (meetingId, reason, tutorId) => {
  const res = await apiClient.post(
    `/api/tutor/scheduling/meetings/${meetingId}/cancel`,
    { 
      userId: tutorId, // Backend mapping: req.getUserId()
      reason: reason 
    }
  );
  return res.data; 
};
