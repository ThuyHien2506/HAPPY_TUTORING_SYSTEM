package com.project.happy.service.freeslot.strategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.project.happy.dto.freeslot.FreeSlotRequest;
import com.project.happy.entity.TutorSlot;
import com.project.happy.repository.IFreeSlotRepository;
import java.time.LocalTime;
import java.util.List;

@Component("reserve")
public class ReserveStrategy implements SlotOperationStrategy {

    @Autowired private IFreeSlotRepository repo;

    @Override
    @Transactional
    public void execute(Long tutorId, FreeSlotRequest request) {
        // Lấy giờ cần đặt từ request
        LocalTime start = request.getTimeRanges().get(0).getStartTime();
        LocalTime end = request.getTimeRanges().get(0).getEndTime();
        
        List<TutorSlot> availableSlots = repo.findAvailableByTutorIdAndDate(tutorId, request.getDate());
        List<TutorSlot> bookedSlots = repo.findBookedByTutorIdAndDate(tutorId, request.getDate());

        // Tìm slot rảnh phù hợp
        TutorSlot targetSlot = availableSlots.stream()
                .filter(s -> !start.isBefore(s.getStartTime()) && !end.isAfter(s.getEndTime()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Khung giờ " + start + "-" + end + " không có sẵn!"));

        availableSlots.remove(targetSlot);
        
        // Cắt đầu (Rảnh)
        if (targetSlot.getStartTime().isBefore(start)) {
            availableSlots.add(new TutorSlot(tutorId, request.getDate(), targetSlot.getStartTime(), start));
        }
        // Slot Bận (Đã đặt)
        bookedSlots.add(new TutorSlot(tutorId, request.getDate(), start, end)); 
        
        // Cắt đuôi (Rảnh)
        if (end.isBefore(targetSlot.getEndTime())) {
            availableSlots.add(new TutorSlot(tutorId, request.getDate(), end, targetSlot.getEndTime()));
        }

        // Lưu
        repo.deleteAllByTutorIdAndDate(tutorId, request.getDate());
        if(!availableSlots.isEmpty()) repo.saveAvailable(availableSlots);
        if(!bookedSlots.isEmpty()) repo.saveBooked(bookedSlots);
    }
}