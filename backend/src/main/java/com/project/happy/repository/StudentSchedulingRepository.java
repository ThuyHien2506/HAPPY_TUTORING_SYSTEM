package com.project.happy.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.project.happy.entity.Appointment;
import com.project.happy.entity.Meeting;
import com.project.happy.repository.storage.MeetingStore;

@Repository
public class StudentSchedulingRepository implements IStudentSchedulingRepository {

    private final MeetingStore store;

    public StudentSchedulingRepository(MeetingStore store) {
        this.store = store;
    }

    @Override
    public boolean bookAppointment(Long studentId, Long tutorId,
            LocalDateTime date, LocalDateTime startTime, String topic) {
        LocalDateTime endTime = startTime.plusHours(1);
        Appointment newAppointment = new Appointment(System.currentTimeMillis(), tutorId, studentId,
                date, startTime, endTime, topic);

        for (Meeting m : store.getAll()) {
            if (m.getTutorId().equals(tutorId) && m.overlapsWith(newAppointment)) {
                return false; // conflict
            }
        }

        store.add(newAppointment);
        return true;
    }

    public List<Meeting> viewMeetings(Long userId) {
        List<Meeting> result = new ArrayList<>();
        for (Meeting m : store.getAll()) {
            if (m instanceof Appointment) {
                Appointment a = (Appointment) m;
                if (a.getStudentId().equals(userId))
                    result.add(a);
            }
        }
        return result;
    }

    public boolean cancelMeeting(Long meetingId, Long userId, String reason) {
        for (Meeting m : store.getAll()) {
            if (m.getMeetingId().equals(meetingId))
                return m.cancel(userId, reason);
        }
        return false;
    }
}
