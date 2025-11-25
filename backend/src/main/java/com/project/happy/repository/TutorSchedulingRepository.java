package com.project.happy.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.project.happy.entity.Appointment;
import com.project.happy.entity.Meeting;
import com.project.happy.repository.storage.MeetingStore;

@Repository
public class TutorSchedulingRepository implements ITutorSchedulingRepository {

    private final MeetingStore store;

    public TutorSchedulingRepository(MeetingStore store) {
        this.store = store;
    }

    @Override
    public boolean approveAppointment(Long appointmentId, Long tutorId) {
        for (Meeting m : store.getAll()) {
            if (m instanceof Appointment) {
                Appointment a = (Appointment) m;
                if (a.getMeetingId().equals(appointmentId))
                    return a.approve(tutorId);
            }
        }
        return false;
    }

    @Override
    public boolean rejectAppointment(Long appointmentId, Long tutorId) {
        for (Meeting m : store.getAll()) {
            if (m instanceof Appointment) {
                Appointment a = (Appointment) m;
                if (a.getMeetingId().equals(appointmentId))
                    return a.reject(tutorId);
            }
        }
        return false;
    }

    public List<Meeting> viewMeetings(Long userId) {
        List<Meeting> result = new ArrayList<>();
        for (Meeting m : store.getAll()) {
            if (m.getTutorId().equals(userId))
                result.add(m);
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
