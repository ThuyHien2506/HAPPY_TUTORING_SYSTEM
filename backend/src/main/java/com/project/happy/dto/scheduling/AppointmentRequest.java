package com.project.happy.dto.scheduling;

import java.time.LocalDateTime;

public class AppointmentRequest {
    private Long studentId;
    private Long tutorId;
    private LocalDateTime date;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String topic;

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getTutorId() { return tutorId; }
    public void setTutorId(Long tutorId) { this.tutorId = tutorId; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime;}
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}
