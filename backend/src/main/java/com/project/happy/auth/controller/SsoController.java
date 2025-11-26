package com.project.happy.auth.controller;

import com.project.happy.auth.model.dto.LoginRequest;
import com.project.happy.auth.model.dto.LoginResponse;
import com.project.happy.auth.model.dto.UserInfoResponse;
import com.project.happy.auth.security.JwtService;
import com.project.happy.auth.service.SsoService;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sso")
@CrossOrigin(origins = {"http://localhost:3000"})
public class SsoController {

    private final SsoService ssoService;
    private final JwtService jwtService;

    public SsoController(SsoService ssoService, JwtService jwtService) {
        this.ssoService = ssoService;
        this.jwtService = jwtService;
    }

    // CAS login
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return ssoService.ssoLogin(request);
    }

    // Lấy thông tin người dùng từ token (mock DATACORE)
    @GetMapping("/me")
    public UserInfoResponse me(@AuthenticationPrincipal UserDetails principal,
                               @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        Claims claims = jwtService.extractAllClaims(token);
        String username = claims.getSubject();
        return ssoService.getUserInfo(username);
    }
}
