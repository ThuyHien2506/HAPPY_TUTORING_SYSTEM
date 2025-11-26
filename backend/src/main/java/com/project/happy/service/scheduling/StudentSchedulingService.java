package com.project.happy.service.scheduling;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.happy.dto.freeslot.FreeSlotResponse;
import com.project.happy.entity.Appointment;
import com.project.happy.entity.Meeting;
import com.project.happy.entity.TutorSlot;
import com.project.happy.repository.FreeSlotRepository;
import com.project.happy.repository.MeetingRepository;

@Service
public class StudentSchedulingService implements IStudentSchedulingService {

    @Autowired
    private MeetingRepository meetingRepo;
    private final FreeSlotRepository slotRepo;

    public StudentSchedulingService(MeetingRepository meetingRepo, FreeSlotRepository slotRepo) {
        System.out.println(">>> USING SLOT REPO BEAN = " + slotRepo.getClass());
        System.out.println(">>> StudentSchedulingService GOT SLOT REPO = " + slotRepo.hashCode());
        this.meetingRepo = meetingRepo;
        this.slotRepo = slotRepo;
    }

    @Override
    public boolean bookAppointment(Long studentId, Long tutorId, LocalDateTime date, LocalDateTime startTime,
            LocalDateTime endTime,
            String topic) {

        Appointment appointment = new Appointment(
                System.currentTimeMillis(),
                tutorId,
                studentId,
                startTime,
                endTime,
                topic);

        // Lưu vào repo
        meetingRepo.save(appointment);
        return true;
    }

    @Override
    public List<Appointment> findApprovedAppointments(Long studentId) {
        return meetingRepo.findApprovedAppointmentsByStudent(studentId);
    }

    @Override
    public List<Appointment> viewAppointmentHistory(Long studentId) {
        return meetingRepo.findAllAppointmentsByStudent(studentId);
    }

    @Override
    public boolean cancelMeeting(Long meetingId, String reason) {
        Meeting meeting = meetingRepo.findById(meetingId);
        if (meeting == null || meeting.isCancelled()) {
            return false;
        }

        boolean ok = meeting.cancel(reason);

        if (ok) {
            meetingRepo.update(meeting);
        }

        return ok;
    }

    @Override
    public List<Appointment> findCancellableAppointmentByStudent(Long studentId) {
        return meetingRepo.findCancellableAppointmentsByStudent(studentId);
    }

    @Override
    public List<FreeSlotResponse> viewTutorAvailableSlots(Long tutorId) {

        System.out.println(">>> CALLED viewTutorAvailableSlots WITH tutorId = " + tutorId);

        LocalDate today = LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();

        // Lấy slot tháng này
        List<TutorSlot> thisMonth = slotRepo.findByTutorIdAndDateBetween(
                tutorId, currentMonth, currentYear);

        // Lấy slot tháng sau
        int nextMonth = (currentMonth == 12) ? 1 : currentMonth + 1;
        int nextYear = (currentMonth == 12) ? currentYear + 1 : currentYear;

        List<TutorSlot> nextMonthSlots = slotRepo.findByTutorIdAndDateBetween(
                tutorId, nextMonth, nextYear);

        // Gộp dữ liệu
        List<TutorSlot> all = Stream.concat(thisMonth.stream(), nextMonthSlots.stream())
                .sorted(Comparator.comparing(TutorSlot::getDate)
                        .thenComparing(TutorSlot::getStartTime))
                .collect(Collectors.toList());

        System.out.println(">>> TOTAL SLOTS FOUND = " + all.size());

        if (all.isEmpty())
            return List.of();

        // Group theo ngày
        Map<LocalDate, List<TutorSlot>> grouped = all.stream().collect(Collectors.groupingBy(TutorSlot::getDate));

        List<FreeSlotResponse> result = new ArrayList<>();

        for (var entry : grouped.entrySet()) {
            LocalDate date = entry.getKey();
            List<TutorSlot> daySlots = entry.getValue();

            FreeSlotResponse resp = new FreeSlotResponse();
            resp.setTutorId(tutorId);
            resp.setDate(date);
            resp.setStatus("AVAILABLE");

            List<FreeSlotResponse.TimeRange> ranges = daySlots.stream()
                    .map(s -> new FreeSlotResponse.TimeRange(
                            s.getStartTime(),
                            s.getEndTime()))
                    .collect(Collectors.toList());

            resp.setTimeRanges(ranges);

            result.add(resp);
        }

        result.sort(Comparator.comparing(FreeSlotResponse::getDate));

        return result;
    }

    @Override
    public Meeting viewMeetingDetails(Long meetingId) {
        return meetingRepo.findById(meetingId);
    }
}