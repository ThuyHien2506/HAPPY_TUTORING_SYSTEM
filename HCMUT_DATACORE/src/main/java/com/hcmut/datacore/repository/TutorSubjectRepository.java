package com.hcmut.datacore.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hcmut.datacore.entity.TutorSubject;
import com.hcmut.datacore.entity.User;
import com.hcmut.datacore.entity.Subject;

public interface TutorSubjectRepository extends JpaRepository<TutorSubject, Long> {

    // Find all subjects taught by a tutor
    List<TutorSubject> findByTutor(User tutor);

    // Find all tutors teaching a specific subject
    List<TutorSubject> findBySubject(Subject subject);

    // Find all tutors teaching a specific subject by subject ID
    List<TutorSubject> findBySubjectId(Long subjectId);

    // Find all tutors teaching a specific subject by subject code
    List<TutorSubject> findBySubjectCode(String code);
}
