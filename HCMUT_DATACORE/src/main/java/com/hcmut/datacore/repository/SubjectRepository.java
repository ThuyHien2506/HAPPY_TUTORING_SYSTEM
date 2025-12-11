package com.hcmut.datacore.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hcmut.datacore.entity.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Subject findByCode(String code);

    List<Subject> findByNameContainingIgnoreCase(String name);
}
