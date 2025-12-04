package com.project.happy.service.freeslot.strategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.project.happy.dto.freeslot.FreeSlotRequest;
import com.project.happy.entity.Appointment;
import com.project.happy.entity.MeetingStatus;
import com.project.happy.entity.TutorAvailability; // 💡 Dùng Entity mới
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

    // Khai báo Status
    private static final TutorAvailability.Status AVAILABLE_STATUS = TutorAvailability.Status.AVAILABLE;
    private static final TutorAvailability.Status UNAVAILABLE_STATUS = TutorAvailability.Status.UNAVAILABLE; 

    @Override
    @Transactional
    public void execute(Long tutorId, FreeSlotRequest request) {
        LocalDate targetDate = request.getDate();
        List<FreeSlotRequest.TimeRange> rawRanges = request.getTimeRanges();

        // 1. Gộp range input
        List<FreeSlotRequest.TimeRange> mergedInput = mergeInputRanges(rawRanges);

        // 2. Lấy lịch hẹn
        List<Appointment> existingAppointments = getActiveAppointments(tutorId, targetDate);

        // 3. Tính toán Rảnh/Bận (Bây giờ dùng Entity mới)
        List<TutorAvailability> newAvailable = new ArrayList<>();
        List<TutorAvailability> newUnavailable = new ArrayList<>(); // Slot bận do hẹn (giữ lại status UNAVAILABLE)

        if (mergedInput != null) {
            for (FreeSlotRequest.TimeRange range : mergedInput) {
                // Sửa hàm helper để dùng TutorAvailability
                splitRangeByAppointments(tutorId, targetDate, range, existingAppointments, newAvailable, newUnavailable);
            }
        }

        // 4. LƯU (Logic chính chuyển từ List sang DB)
        // Xóa sạch dữ liệu ngày hôm đó trong DB (Sử dụng hàm JPA mới)
        repo.deleteByTutorIdAndAvailableDate(tutorId, targetDate); 
        
        // Chèn các slot Rảnh mới (Status: AVAILABLE)
        if (!newAvailable.isEmpty()) repo.saveAll(newAvailable);
        
        // Chèn lại các slot Bận (Status: UNAVAILABLE) để tránh đặt đè
        if (!newUnavailable.isEmpty()) repo.saveAll(newUnavailable);
    }

    // --- CÁC HÀM PRIVATE HELPER (Cần sửa TutorSlot thành TutorAvailability) ---

    // Hàm mergeInputRanges không cần thay đổi vì nó dùng DTO TimeRange

    private List<Appointment> getActiveAppointments(Long tutorId, LocalDate date) {
        // ... (Logic này giữ nguyên, vì nó lấy từ meetingRepo)
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
                                          List<TutorAvailability> availableList, // 💡 Sửa: Entity mới
                                          List<TutorAvailability> bookedList) { // 💡 Sửa: Entity mới
        List<Appointment> overlaps = appointments.stream()
            .filter(a -> a.getStartTime().toLocalTime().isBefore(range.getEndTime()) && a.getEndTime().toLocalTime().isAfter(range.getStartTime()))
            .sorted(Comparator.comparing(Appointment::getStartTime))
            .collect(Collectors.toList());

        if (overlaps.isEmpty()) {
            // Chèn slot Rảnh mới
            TutorAvailability newSlot = new TutorAvailability();
            newSlot.setTutorId(tutorId);
            newSlot.setAvailableDate(date);
            newSlot.setStartTime(range.getStartTime());
            newSlot.setEndTime(range.getEndTime());
            newSlot.setStatus(AVAILABLE_STATUS); 
            availableList.add(newSlot);
        } else {
            LocalTime currentStart = range.getStartTime();
            for (Appointment appt : overlaps) {
                LocalTime apptStart = appt.getStartTime().toLocalTime();
                LocalTime apptEnd = appt.getEndTime().toLocalTime();
                LocalTime effectiveStart = apptStart.isBefore(range.getStartTime()) ? range.getStartTime() : apptStart;
                LocalTime effectiveEnd = apptEnd.isAfter(range.getEndTime()) ? range.getEndTime() : apptEnd;

                // 1. Chèn slot Rảnh trước
                if (currentStart.isBefore(effectiveStart)) {
                    TutorAvailability availableSlot = new TutorAvailability();
                    availableSlot.setTutorId(tutorId);
                    availableSlot.setAvailableDate(date);
                    availableSlot.setStartTime(currentStart);
                    availableSlot.setEndTime(effectiveStart);
                    availableSlot.setStatus(AVAILABLE_STATUS);
                    availableList.add(availableSlot);
                }
                // 2. Chèn slot Bận (UNAVAILABLE)
                if (effectiveStart.isBefore(effectiveEnd)) {
                    TutorAvailability bookedSlot = new TutorAvailability();
                    bookedSlot.setTutorId(tutorId);
                    bookedSlot.setAvailableDate(date);
                    bookedSlot.setStartTime(effectiveStart);
                    bookedSlot.setEndTime(effectiveEnd);
                    bookedSlot.setStatus(UNAVAILABLE_STATUS); // Dùng UNAVAILABLE cho slot đã đặt
                    bookedList.add(bookedSlot);
                }
                if (effectiveEnd.isAfter(currentStart)) currentStart = effectiveEnd;
            }
            // 3. Chèn slot Rảnh cuối cùng
            if (currentStart.isBefore(range.getEndTime())) {
                TutorAvailability lastSlot = new TutorAvailability();
                lastSlot.setTutorId(tutorId);
                lastSlot.setAvailableDate(date);
                lastSlot.setStartTime(currentStart);
                lastSlot.setEndTime(range.getEndTime());
                lastSlot.setStatus(AVAILABLE_STATUS);
                availableList.add(lastSlot);
            }
        }
    }

    // mergeInputRanges giữ nguyên
    private List<FreeSlotRequest.TimeRange> mergeInputRanges(List<FreeSlotRequest.TimeRange> ranges) {
        // ... (Logic merge giữ nguyên)
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
}