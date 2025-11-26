package com.project.happy.auth.model.dto;

public class UserInfoResponse {
    private Long id;
    private String username;
    private String fullName;
    private String role;
    private String email;
    private String status;

    public UserInfoResponse(Long id, String username, String fullName,
                            String role, String email, String status) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.email = email;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
    public String getStatus() { return status; }
}
