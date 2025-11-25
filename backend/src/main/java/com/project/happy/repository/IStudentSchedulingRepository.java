package com.project.happy.repository;

import java.time.LocalDateTime;

import org.springframework.stereotype.Repository;

@Repository
public interface IStudentSchedulingRepository extends ISchedulingRepository {
    boolean bookAppointment(Long studentId, Long tutorId,
                            LocalDateTime date, LocalDateTime startTime, String topic);
}
