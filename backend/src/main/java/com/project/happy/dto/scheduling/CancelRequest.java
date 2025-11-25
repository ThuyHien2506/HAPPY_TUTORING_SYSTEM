package com.project.happy.dto.scheduling;

public class CancelRequest {

    private Long userId;
    private String reason;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
