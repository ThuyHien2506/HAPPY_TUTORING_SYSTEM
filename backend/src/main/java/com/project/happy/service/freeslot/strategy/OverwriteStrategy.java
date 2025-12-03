package com.project.happy.service.freeslot.strategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.project.happy.dto.freeslot.FreeSlotRequest;
import com.project.happy.entity.Appointment;
import com.project.happy.entity.MeetingStatus;
import com.project.happy.entity.TutorSlot;
import com.project.happy.repository.IFreeSlotRepository;
import com.project.happy.repository.IMeetingRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component("overwrite")
public class OverwriteStrategy implements SlotOperationStrategy {

    @Autowired private IFreeSlotRepository repo;
    @Autowired private IMeetingRepository meetingRepo;

    @Override
    @Transactional
    public void execute(Long tutorId, FreeSlotRequest request) {
        LocalDate targetDate = request.getDate();
        List<FreeSlotRequest.TimeRange> rawRanges = request.getTimeRanges();

        // 1. Gộp range input
        List<FreeSlotRequest.TimeRange> mergedInput = mergeInputRanges(rawRanges);

        // 2. Lấy lịch hẹn
        List<Appointment> existingAppointments = getActiveAppointments(tutorId, targetDate);

        // 3. Tính toán Rảnh/Bận
        List<TutorSlot> newAvailable = new ArrayList<>();
        List<TutorSlot> newBooked = new ArrayList<>();
        List<String> warnings = new ArrayList<>(); // Có thể log hoặc return nếu muốn

        if (mergedInput != null) {
            for (FreeSlotRequest.TimeRange range : mergedInput) {
                splitRangeByAppointments(tutorId, targetDate, range, existingAppointments, newAvailable, newBooked);
            }
        }

        // 4. Lưu
        repo.deleteAllByTutorIdAndDate(tutorId, targetDate);
        if (!newAvailable.isEmpty()) repo.saveAvailable(newAvailable);
        if (!newBooked.isEmpty()) repo.saveBooked(newBooked);
    }

    // --- CÁC HÀM PRIVATE HELPER (Copy từ Service cũ sang) ---

    private List<FreeSlotRequest.TimeRange> mergeInputRanges(List<FreeSlotRequest.TimeRange> ranges) {
        if (ranges == null || ranges.isEmpty()) return new ArrayList<>();
        ranges.sort(Comparator.comparing(FreeSlotRequest.TimeRange::getStartTime));
        List<FreeSlotRequest.TimeRange> result = new ArrayList<>();
        FreeSlotRequest.TimeRange current = ranges.get(0);

        for (int i = 1; i < ranges.size(); i++) {
            FreeSlotRequest.TimeRange next = ranges.get(i);
            if (!current.getEndTime().isBefore(next.getStartTime())) {
                LocalTime maxEnd = current.getEndTime().isAfter(next.getEndTime()) ? current.getEndTime() : next.getEndTime();
                current.setEndTime(maxEnd);
            } else {
                result.add(current);
                current = next;
            }
        }
        result.add(current);
        return result;
    }

    private List<Appointment> getActiveAppointments(Long tutorId, LocalDate date) {
        List<Appointment> all = new ArrayList<>();
        all.addAll(meetingRepo.findPendingAppointmentsByTutor(tutorId));
        all.addAll(meetingRepo.findApprovedAppointmentsByTutor(tutorId));
        return all.stream()
                .filter(a -> a.getStartTime().toLocalDate().equals(date))
                .filter(a -> a.getStatus() != MeetingStatus.CANCELLED)
                .sorted(Comparator.comparing(Appointment::getStartTime))
                .collect(Collectors.toList());
    }

    private void splitRangeByAppointments(Long tutorId, LocalDate date, FreeSlotRequest.TimeRange range, 
                                          List<Appointment> appointments, 
                                          List<TutorSlot> availableList, 
                                          List<TutorSlot> bookedList) {
        List<Appointment> overlaps = appointments.stream()
            .filter(a -> a.getStartTime().toLocalTime().isBefore(range.getEndTime()) && a.getEndTime().toLocalTime().isAfter(range.getStartTime()))
            .sorted(Comparator.comparing(Appointment::getStartTime))
            .collect(Collectors.toList());

        if (overlaps.isEmpty()) {
            availableList.add(new TutorSlot(tutorId, date, range.getStartTime(), range.getEndTime()));
        } else {
            LocalTime currentStart = range.getStartTime();
            for (Appointment appt : overlaps) {
                LocalTime apptStart = appt.getStartTime().toLocalTime();
                LocalTime apptEnd = appt.getEndTime().toLocalTime();
                LocalTime effectiveStart = apptStart.isBefore(range.getStartTime()) ? range.getStartTime() : apptStart;
                LocalTime effectiveEnd = apptEnd.isAfter(range.getEndTime()) ? range.getEndTime() : apptEnd;

                if (currentStart.isBefore(effectiveStart)) {
                    availableList.add(new TutorSlot(tutorId, date, currentStart, effectiveStart));
                }
                if (effectiveStart.isBefore(effectiveEnd)) {
                    bookedList.add(new TutorSlot(tutorId, date, effectiveStart, effectiveEnd));
                }
                if (effectiveEnd.isAfter(currentStart)) currentStart = effectiveEnd;
            }
            if (currentStart.isBefore(range.getEndTime())) {
                availableList.add(new TutorSlot(tutorId, date, currentStart, range.getEndTime()));
            }
        }
    }
}