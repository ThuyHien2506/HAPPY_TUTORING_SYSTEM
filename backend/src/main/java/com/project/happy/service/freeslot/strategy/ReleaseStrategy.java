package com.project.happy.service.freeslot.strategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.project.happy.dto.freeslot.FreeSlotRequest;
import com.project.happy.entity.TutorSlot;
import com.project.happy.repository.IFreeSlotRepository;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component("release")
public class ReleaseStrategy implements SlotOperationStrategy {

    @Autowired private IFreeSlotRepository repo;

    @Override
    @Transactional
    public void execute(Long tutorId, FreeSlotRequest request) {
        LocalTime start = request.getTimeRanges().get(0).getStartTime();
        LocalTime end = request.getTimeRanges().get(0).getEndTime();

        List<TutorSlot> availableSlots = repo.findAvailableByTutorIdAndDate(tutorId, request.getDate());
        List<TutorSlot> bookedSlots = repo.findBookedByTutorIdAndDate(tutorId, request.getDate());

        // Tìm các slot Bận nằm trong khoảng hủy
        List<TutorSlot> toRelease = new ArrayList<>();
        bookedSlots.removeIf(slot -> {
            boolean overlap = slot.getStartTime().isBefore(end) && slot.getEndTime().isAfter(start);
            if(overlap) toRelease.add(slot);
            return overlap;
        });

        if (toRelease.isEmpty()) return;

        // Chuyển slot Bận thành Rảnh và gộp lại
        availableSlots.addAll(toRelease);
        List<TutorSlot> mergedAvailable = mergeTutorSlots(availableSlots);

        // Lưu
        repo.deleteAllByTutorIdAndDate(tutorId, request.getDate());
        if(!mergedAvailable.isEmpty()) repo.saveAvailable(mergedAvailable);
        if(!bookedSlots.isEmpty()) repo.saveBooked(bookedSlots);
    }

    // Hàm merge logic (Copy từ code cũ của bạn)
    private List<TutorSlot> mergeTutorSlots(List<TutorSlot> slots) {
        if (slots == null || slots.isEmpty()) return new ArrayList<>();
        slots.sort(Comparator.comparing(TutorSlot::getStartTime));
        List<TutorSlot> result = new ArrayList<>();
        TutorSlot current = slots.get(0);

        for (int i = 1; i < slots.size(); i++) {
            TutorSlot next = slots.get(i);
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