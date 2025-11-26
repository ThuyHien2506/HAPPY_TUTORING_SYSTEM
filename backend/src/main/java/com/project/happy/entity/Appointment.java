package com.project.happy.entity;

import java.time.LocalDateTime;

public class Appointment extends Meeting {

    private Long studentId;
    private AppointmentStatus appointmentStatus;
    private String rejectReason;

    public Appointment(Long meetingId,
                       Long tutorId,
                       Long studentId,
                       LocalDateTime startTime,
                       LocalDateTime endTime,
                       String topic) {

        super(meetingId, tutorId, startTime, endTime, topic, MeetingType.APPOINTMENT);

        this.studentId = studentId;
        this.appointmentStatus = AppointmentStatus.PENDING;
    }

    public boolean approve() {
        if (appointmentStatus != AppointmentStatus.PENDING) return false;
        appointmentStatus = AppointmentStatus.APPROVED;
        return true;
    }

    public boolean reject(String reason) {
        if (appointmentStatus != AppointmentStatus.PENDING || reason == null || reason.isEmpty()) return false;
        appointmentStatus = AppointmentStatus.REJECTED;
        this.rejectReason = reason;
        return true;
    }

    // Getters & Setters
    public Long getStudentId() { return studentId; }
    public AppointmentStatus getAppointmentStatus() { return appointmentStatus; }
    public String getRejectReason() { return rejectReason; }
    public void setAppointmentStatus(AppointmentStatus status) { this.appointmentStatus = status; }
}
