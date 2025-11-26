package com.project.happy.auth.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.project.happy.auth.model.User;
import com.project.happy.auth.model.dto.LoginRequest;
import com.project.happy.auth.model.dto.LoginResponse;
import com.project.happy.auth.repository.UserRepository;
import com.project.happy.auth.security.JwtService;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       UserDetailsService userDetailsService,
                       JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                request.getUsername(), request.getPassword());
        authenticationManager.authenticate(auth);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getUsername());

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("fullName", user.getFullName());
        claims.put("email", user.getEmail());

        String token = jwtService.generateToken(claims, userDetails);

        return new LoginResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getRole().name()
        );
    }
}
