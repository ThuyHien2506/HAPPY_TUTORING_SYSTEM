package com.project.happy.auth.service;

import com.project.happy.auth.model.User;
import com.project.happy.auth.model.dto.LoginRequest;
import com.project.happy.auth.model.dto.LoginResponse;
import com.project.happy.auth.model.dto.UserInfoResponse;
import com.project.happy.auth.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class SsoService {

    private final AuthService authService;
    private final UserRepository userRepository;

    public SsoService(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    // HCMUT_SSO login
    public LoginResponse ssoLogin(LoginRequest request) {
        return authService.login(request);
    }

    // Lấy thông tin người dùng từ "DATACORE" (ở đây mock bằng bảng users)
    public UserInfoResponse getUserInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow();

        return new UserInfoResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getRole().name(),
                user.getEmail(),
                user.getStatus()
        );
    }
}
