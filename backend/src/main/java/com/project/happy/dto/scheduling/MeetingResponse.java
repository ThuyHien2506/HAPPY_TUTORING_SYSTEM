package com.project.happy.dto.scheduling;

import java.time.LocalDateTime;

public class MeetingResponse {

    private Long meetingId;
    private Long tutorId;
    private Long studentId;
    private LocalDateTime date;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String topic;
    private String status;

    public Long getMeetingId() { return meetingId; }
    public void setMeetingId(Long meetingId) { this.meetingId = meetingId; }

    public Long getTutorId() { return tutorId; }
    public void setTutorId(Long tutorId) { this.tutorId = tutorId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime;}

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
