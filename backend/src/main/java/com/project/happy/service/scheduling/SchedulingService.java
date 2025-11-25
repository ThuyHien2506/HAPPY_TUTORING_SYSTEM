package com.project.happy.service.scheduling;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.project.happy.dto.scheduling.AppointmentRequest;
import com.project.happy.dto.scheduling.ApproveRequest;
import com.project.happy.dto.scheduling.CancelRequest;
import com.project.happy.entity.Meeting;
import com.project.happy.repository.ISchedulingRepository;
import com.project.happy.repository.IStudentSchedulingRepository;
import com.project.happy.repository.ITutorSchedulingRepository;

@Service
public class SchedulingService {

    private final IStudentSchedulingRepository studentRepo;
    private final ITutorSchedulingRepository tutorRepo;
    private final ISchedulingRepository userRepo;

    public SchedulingService(
            IStudentSchedulingRepository studentRepo,
            ITutorSchedulingRepository tutorRepo,
            ISchedulingRepository schedulingRepo) {
        this.studentRepo = studentRepo;
        this.tutorRepo = tutorRepo;
        this.userRepo = schedulingRepo;
    }

    public boolean book(AppointmentRequest request) {

        return studentRepo.bookAppointment(
                request.getStudentId(),
                request.getTutorId(),
                request.getDate(),
                request.getStartTime(),
                request.getTopic());
    }

    public boolean approve(Long apptId, ApproveRequest req) {

        return tutorRepo.approveAppointment(
                apptId,
                req.getTutorId());
    }

    public boolean reject(Long apptId, ApproveRequest req) {

        return tutorRepo.rejectAppointment(
                apptId,
                req.getTutorId());
    }

    public boolean cancel(Long meetingId, CancelRequest req) {
        return userRepo.cancelMeeting(
                meetingId,
                req.getUserId(),
                req.getReason());
    }

    public List<Meeting> getMeetings(Long userId) {

        List<Meeting> studentMeetings = studentRepo.viewMeetings(userId);
        List<Meeting> tutorMeetings = tutorRepo.viewMeetings(userId);

        return Stream.concat(studentMeetings.stream(), tutorMeetings.stream())
                .distinct()
                .toList();
    }
}
