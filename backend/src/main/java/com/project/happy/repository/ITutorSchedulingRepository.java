package com.project.happy.repository;


import org.springframework.stereotype.Repository;
@Repository
public interface ITutorSchedulingRepository extends ISchedulingRepository {
    boolean approveAppointment(Long appointmentId, Long tutorId);
    boolean rejectAppointment(Long appointmentId, Long tutorId);
}