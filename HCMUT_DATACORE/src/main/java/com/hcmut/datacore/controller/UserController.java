package com.hcmut.datacore.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hcmut.datacore.dto.EnrollmentRequestDto;
import com.hcmut.datacore.dto.EnrollmentResponseDto;
import com.hcmut.datacore.dto.UserProfileDto;
import com.hcmut.datacore.entity.StudentEnrollment;
import com.hcmut.datacore.entity.Subject;
import com.hcmut.datacore.entity.TutorSubject;
import com.hcmut.datacore.entity.User;
import com.hcmut.datacore.repository.StudentEnrollmentRepository;
import com.hcmut.datacore.repository.SubjectRepository;
import com.hcmut.datacore.repository.TutorSubjectRepository;
import com.hcmut.datacore.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final TutorSubjectRepository tutorSubjectRepository;
    private final StudentEnrollmentRepository enrollmentRepository;

    public UserController(UserRepository userRepository,
                         SubjectRepository subjectRepository,
                         TutorSubjectRepository tutorSubjectRepository,
                         StudentEnrollmentRepository enrollmentRepository) {
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.tutorSubjectRepository = tutorSubjectRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping("/users/{bkNetId}")
    public ResponseEntity<?> getUser(@PathVariable String bkNetId) {

        return userRepository.findByBkNetId(bkNetId)
                .map(user -> {
                    UserProfileDto dto = new UserProfileDto();
                    dto.setBkNetId(user.getBkNetId());
                    dto.setEmail(user.getEmail());
                    dto.setFullName(user.getFullName());
                    dto.setRole(user.getRole());
                    dto.setFaculty(user.getFaculty());
                    dto.setMajor(user.getMajor());
                    dto.setPhoneNumber(user.getPhoneNumber());
                    dto.setGpa(user.getGpa());
                    dto.setMS(user.getMS());
                    dto.setYearOfStudy(user.getYearOfStudy());
                    dto.setQualifications(user.getQualifications());
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/tutors")
    public ResponseEntity<?> getTutors(@RequestParam(required = false) String subject) {
        List<UserProfileDto> tutors = userRepository.findByRole("tutor")
                .stream()
                .map(user -> {
                    UserProfileDto dto = new UserProfileDto();
                    dto.setBkNetId(user.getBkNetId());
                    dto.setEmail(user.getEmail());
                    dto.setFullName(user.getFullName());
                    dto.setRole(user.getRole());
                    dto.setFaculty(user.getFaculty());
                    dto.setMajor(user.getMajor());
                    dto.setPhoneNumber(user.getPhoneNumber());
                    dto.setGpa(user.getGpa());
                    dto.setMS(user.getMS());
                    dto.setYearOfStudy(user.getYearOfStudy());
                    dto.setQualifications(user.getQualifications());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(tutors);
    }

    @GetMapping("/subjects")
    public ResponseEntity<?> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/tutors/by-subject/{subjectId}")
    public ResponseEntity<?> getTutorsBySubject(@PathVariable Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        List<UserProfileDto> tutors = tutorSubjectRepository.findBySubject(subject)
                .stream()
                .map(ts -> {
                    User tutor = ts.getTutor();
                    UserProfileDto dto = new UserProfileDto();
                    dto.setBkNetId(tutor.getBkNetId());
                    dto.setEmail(tutor.getEmail());
                    dto.setFullName(tutor.getFullName());
                    dto.setRole(tutor.getRole());
                    dto.setFaculty(tutor.getFaculty());
                    dto.setMajor(tutor.getMajor());
                    dto.setPhoneNumber(tutor.getPhoneNumber());
                    dto.setGpa(tutor.getGpa());
                    dto.setMS(tutor.getMS());
                    dto.setYearOfStudy(tutor.getYearOfStudy());
                    dto.setQualifications(tutor.getQualifications());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(tutors);
    }

    @PostMapping("/enrollments")
    public ResponseEntity<?> enrollStudent(@RequestBody EnrollmentRequestDto request) {
        try {
            User student = userRepository.findByBkNetId(request.getStudentBkNetId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            User tutor = userRepository.findByBkNetId(request.getTutorBkNetId())
                    .orElseThrow(() -> new RuntimeException("Tutor not found"));

            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));

            // Check if student already enrolled for this subject
            if (enrollmentRepository.existsByStudentAndSubject(student, subject)) {
                return ResponseEntity.status(400).body("Student already enrolled for this subject");
            }

            // Create enrollment
            StudentEnrollment enrollment = new StudentEnrollment();
            enrollment.setStudent(student);
            enrollment.setTutor(tutor);
            enrollment.setSubject(subject);
            enrollment.setEnrollmentDate(LocalDateTime.now());
            enrollment.setStatus(StudentEnrollment.EnrollmentStatus.ACTIVE);

            StudentEnrollment saved = enrollmentRepository.save(enrollment);

            // Convert to response DTO
            EnrollmentResponseDto response = new EnrollmentResponseDto();
            response.setId(saved.getId());
            response.setStudentName(saved.getStudent().getFullName());
            response.setTutorName(saved.getTutor().getFullName());
            response.setSubjectCode(saved.getSubject().getCode());
            response.setSubjectName(saved.getSubject().getName());
            response.setEnrollmentDate(saved.getEnrollmentDate());
            response.setStatus(saved.getStatus().toString());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/enrollments/student/{bkNetId}")
    public ResponseEntity<?> getStudentEnrollments(@PathVariable String bkNetId) {
        User student = userRepository.findByBkNetId(bkNetId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<EnrollmentResponseDto> enrollments = enrollmentRepository.findByStudent(student)
                .stream()
                .map(enrollment -> {
                    EnrollmentResponseDto dto = new EnrollmentResponseDto();
                    dto.setId(enrollment.getId());
                    dto.setStudentName(enrollment.getStudent().getFullName());
                    dto.setTutorName(enrollment.getTutor().getFullName());
                    dto.setSubjectCode(enrollment.getSubject().getCode());
                    dto.setSubjectName(enrollment.getSubject().getName());
                    dto.setEnrollmentDate(enrollment.getEnrollmentDate());
                    dto.setStatus(enrollment.getStatus().toString());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/enrollments/student/{bkNetId}/check/{subjectId}")
    public ResponseEntity<?> checkEnrollment(@PathVariable String bkNetId, @PathVariable Long subjectId) {
        User student = userRepository.findByBkNetId(bkNetId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        boolean enrolled = enrollmentRepository.existsByStudentAndSubject(student, subject);
        return ResponseEntity.ok(new CheckEnrollmentResponse(enrolled));
    }

    // Helper class for enrollment check response
    public static class CheckEnrollmentResponse {
        private boolean enrolled;

        public CheckEnrollmentResponse(boolean enrolled) {
            this.enrolled = enrolled;
        }

        public boolean isEnrolled() {
            return enrolled;
        }

        public void setEnrolled(boolean enrolled) {
            this.enrolled = enrolled;
        }
    }
}
