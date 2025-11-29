package com.project.happy.dto.scheduling;

public class RejectRequest {

    private Long tutorId;
    private String reason;

    public RejectRequest() {}

    public RejectRequest(Long tutorId, String reason) {
        this.tutorId = tutorId;
        this.reason = reason;
    }

    // Getters & Setters
    public Long getTutorId() {
        return tutorId;
    }

    public void setTutorId(Long tutorId) {
        this.tutorId = tutorId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
