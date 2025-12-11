package com.hcmut.datacore.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hcmut.datacore.entity.StudentEnrollment;
import com.hcmut.datacore.entity.User;
import com.hcmut.datacore.entity.Subject;

public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {

    // Find enrollment by student and subject
    Optional<StudentEnrollment> findByStudentAndSubject(User student, Subject subject);

    // Find all enrollments for a student
    List<StudentEnrollment> findByStudent(User student);

    // Find all enrollments for a tutor
    List<StudentEnrollment> findByTutor(User tutor);

    // Find all active enrollments for a student
    List<StudentEnrollment> findByStudentAndStatus(User student, StudentEnrollment.EnrollmentStatus status);

    // Check if student already enrolled for a subject
    boolean existsByStudentAndSubject(User student, Subject subject);
}
