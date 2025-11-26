package com.project.happy.auth.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tutor")
@CrossOrigin(origins = {"http://localhost:3000"})
public class TutorController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('TUTOR')")
    public String dashboard() {
        return "Tutor dashboard data from server";
    }
}
