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

// Tra slot khi tutor chon tra lai slot ranh
export const returnMeetingSlot = async (tutorId, meetingId) => {
  const res = await apiClient.post(
    `/api/tutor/scheduling/tutor/${tutorId}/meetings/${meetingId}/return-slot`
  );
  return res.data;
};

// Lay danh sach meeting chinh thuc cua tutor
export const getTutorMeetings = async (tutorId) => {
  const res = await apiClient.get(
    "/api/tutor/scheduling/meetings/official",
    { params: { tutorId } }
  );
  return res.data; // List<Meeting>
};

// Lay danh sach meeting ma tutor duoc phep huy
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

// Lay danh sach tutor tu database
export const getTutors = async (subject = null) => {
  const res = await apiClient.get(
    "/api/tutors",
    { params: subject ? { subject } : {} }
  );
  return res.data; // List<UserProfileDto>
};

// Get all subjects
export const getSubjects = async () => {
  const res = await apiClient.get("/api/subjects");
  return res.data;
};

// Get tutors by subject
export const getTutorsBySubject = async (subjectId) => {
  const res = await apiClient.get(`/api/tutors/by-subject/${subjectId}`);
  return res.data;
};

// Enroll student to a tutor for a subject
export const enrollStudent = async (studentBkNetId, tutorBkNetId, subjectId) => {
  const res = await apiClient.post(
    "/api/enrollments",
    {
      studentBkNetId,
      tutorBkNetId,
      subjectId
    }
  );
  return res.data;
};

// Get student enrollments
export const getStudentEnrollments = async (bkNetId) => {
  const res = await apiClient.get(`/api/enrollments/student/${bkNetId}`);
  return res.data;
};

// Check if student already enrolled for a subject
export const checkEnrollment = async (bkNetId, subjectId) => {
  const res = await apiClient.get(
    `/api/enrollments/student/${bkNetId}/check/${subjectId}`
  );
  return res.data;
};
