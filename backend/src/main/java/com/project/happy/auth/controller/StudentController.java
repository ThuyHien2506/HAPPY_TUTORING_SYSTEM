package com.project.happy.auth.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = {"http://localhost:3000"})
public class StudentController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public String dashboard() {
        return "Student dashboard data from server";
    }
}
