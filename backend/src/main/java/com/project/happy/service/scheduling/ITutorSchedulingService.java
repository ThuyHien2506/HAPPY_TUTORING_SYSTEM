package com.project.happy.service.scheduling;

import com.project.happy.entity.Appointment;
import com.project.happy.entity.Meeting;

import java.time.LocalDateTime;
import java.util.List;


public interface ITutorSchedulingService {

    List<Appointment> viewPendingAppointments(Long tutorId);

    boolean approveAppointment(Long appointmentId, Long tutorId);

    boolean rejectAppointment(Long appointmentId, Long tutorId, String reason);
    List<Appointment> viewOfficialAppointments(Long tutorId);

    boolean cancelMeeting(Long tutorId, Long meetingId, String reason);

    List<Appointment> findPendingAppointments(Long tutorId);

    //List<Appointment> findApprovedAppointments(Long tutorId);

    //boolean validateScheduleConflict(Long tutorId, LocalDateTime start, LocalDateTime end);

    Meeting viewMeetingDetails(Long meetingId);

    String createOnlineLink(Appointment appointment);
}
