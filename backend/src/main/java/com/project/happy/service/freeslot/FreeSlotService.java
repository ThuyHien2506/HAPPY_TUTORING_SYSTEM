package com.project.happy.service.freeslot;

import org.springframework.beans.factory.annotation.Autowired;
// Thêm các import cần thiết
import org.springframework.stereotype.Service;
import com.project.happy.dto.freeslot.FreeSlotRequest;
import com.project.happy.dto.freeslot.FreeSlotResponse;
import com.project.happy.entity.TutorSlot;
import com.project.happy.repository.IFreeSlotRepository;
import com.project.happy.service.freeslot.strategy.SlotOperationStrategy;
import com.project.happy.service.freeslot.validation.ScheduleValidator;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.Comparator; // Thêm Comparator
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FreeSlotService implements IFreeSlotService {

    @Autowired private IFreeSlotRepository repo;
    // ... (Giả định các fields và constructor khác vẫn giữ nguyên)
    private final Map<String, SlotOperationStrategy> strategyMap;
    private final List<ScheduleValidator> validators;
    
    // ... (Constructor giữ nguyên)
    @Autowired
    public FreeSlotService(Map<String, SlotOperationStrategy> strategyMap,
                            List<ScheduleValidator> validators) {
        this.strategyMap = strategyMap;
        this.validators = validators;
    }

    // --- GET DATA ---
    @Override
    public FreeSlotResponse getDailySchedule(Long tutorId, LocalDate date) {
        List<TutorSlot> slots = repo.findAvailableByTutorIdAndDate(tutorId, date);
        return convertToResponse(tutorId, date, slots); 
    }

    // *** SỬA LỖI TẠI ĐÂY: Triển khai logic lấy lịch tháng ***
 
    
    @Override
    public List<FreeSlotResponse> getMonthlySchedule(Long tutorId, int month, int year) {
        List<TutorSlot> slots = repo.findAvailableByTutorIdAndDateBetween(tutorId, month, year);
        return slots.stream()
                .collect(Collectors.groupingBy(TutorSlot::getDate))
                .entrySet().stream()
                .map(entry -> convertToResponse(tutorId, entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
    public List<TutorSlot> getRawAvailableSlots(Long tutorId, LocalDate date) {
        return repo.findAvailableByTutorIdAndDate(tutorId, date);
    }

    // --- CÁC HÀM XỬ LÝ CHÍNH (Giữ nguyên) ---
    @Override
    public List<String> overwriteDailySchedule(Long tutorId, FreeSlotRequest request) {
        validators.forEach(v -> v.validate(request));
        SlotOperationStrategy strategy = strategyMap.get("overwrite");
        if (strategy == null) throw new RuntimeException("Strategy 'overwrite' not found!");
        strategy.execute(tutorId, request);
        return List.of("Cập nhật thành công");
    }

    @Override
    public void reserveSlot(Long tutorId, LocalDate date, LocalTime start, LocalTime end) {
        FreeSlotRequest req = new FreeSlotRequest();
        req.setDate(date);
        req.setTimeRanges(List.of(new FreeSlotRequest.TimeRange(start, end)));
        strategyMap.get("reserve").execute(tutorId, req);
    }

    @Override
    public void releaseSlot(Long tutorId, LocalDate date, LocalTime start, LocalTime end) {
        FreeSlotRequest req = new FreeSlotRequest();
        req.setDate(date);
        req.setTimeRanges(List.of(new FreeSlotRequest.TimeRange(start, end)));
        strategyMap.get("release").execute(tutorId, req);
    }

    // HÀM HELPER ĐỂ CHUYỂN ĐỔI CHUNG
    private FreeSlotResponse convertToResponse(Long tutorId, LocalDate date, List<TutorSlot> slots) {
        FreeSlotResponse res = new FreeSlotResponse();
        res.setTutorId(tutorId);
        res.setDate(date);
        
        if (slots != null && !slots.isEmpty()) {
            List<FreeSlotResponse.TimeRange> timeRanges = slots.stream()
                .sorted(Comparator.comparing(TutorSlot::getStartTime))
                .map(slot -> new FreeSlotResponse.TimeRange(slot.getStartTime(), slot.getEndTime()))
                .collect(Collectors.toList());
                
            res.setTimeRanges(timeRanges);
            res.setStatus("AVAILABLE");
        } else {
            res.setTimeRanges(Collections.emptyList());
            res.setStatus("EMPTY");
        }
        return res;
    }
}