package com.project.happy.auth.model.dto;

public class LoginResponse {
    private String token;
    private Long userId;
    private String fullName;
    private String role;

    public LoginResponse(String token, Long userId,
                         String fullName, String role) {
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.role = role;
    }

    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
}
