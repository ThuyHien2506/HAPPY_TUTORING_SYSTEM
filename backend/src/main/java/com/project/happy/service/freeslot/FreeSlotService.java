package com.project.happy.service.freeslot;

import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FreeSlotService implements IFreeSlotService {

    @Autowired private IFreeSlotRepository repo;

    // 1. Map chứa các Strategy (Key là tên Bean: "overwrite", "reserve", "release")
    private final Map<String, SlotOperationStrategy> strategyMap;
    
    // 2. List chứa các Validator
    private final List<ScheduleValidator> validators;

    @Autowired
    public FreeSlotService(Map<String, SlotOperationStrategy> strategyMap,
                           List<ScheduleValidator> validators) {
        this.strategyMap = strategyMap;
        this.validators = validators;
    }

    // --- GET DATA (Giữ nguyên logic cũ vì đơn giản) ---
    @Override
    public FreeSlotResponse getDailySchedule(Long tutorId, LocalDate date) {
        List<TutorSlot> slots = repo.findAvailableByTutorIdAndDate(tutorId, date);
        // Logic convert response rút gọn cho ví dụ
        FreeSlotResponse res = new FreeSlotResponse();
        res.setTutorId(tutorId);
        res.setDate(date);
        return res; 
    }

    @Override
    public List<FreeSlotResponse> getMonthlySchedule(Long tutorId, int month, int year) {
         return Collections.emptyList(); // Code cũ bạn giữ nguyên đoạn này
    }
    
    @Override
    public List<TutorSlot> getRawAvailableSlots(Long tutorId, LocalDate date) {
        return repo.findAvailableByTutorIdAndDate(tutorId, date);
    }

    // --- CÁC HÀM XỬ LÝ CHÍNH (GỌI STRATEGY) ---

    @Override
    public List<String> overwriteDailySchedule(Long tutorId, FreeSlotRequest request) {
        // 1. Validate
        validators.forEach(v -> v.validate(request));

        // 2. Gọi Strategy "overwrite"
        SlotOperationStrategy strategy = strategyMap.get("overwrite");
        if (strategy == null) throw new RuntimeException("Strategy 'overwrite' not found!");
        
        strategy.execute(tutorId, request);

        return List.of("Cập nhật thành công");
    }

    @Override
    public void reserveSlot(Long tutorId, LocalDate date, LocalTime start, LocalTime end) {
        // Đóng gói tham số vào Request để khớp Interface Strategy
        FreeSlotRequest req = new FreeSlotRequest();
        req.setDate(date);
        req.setTimeRanges(List.of(new FreeSlotRequest.TimeRange(start, end)));

        strategyMap.get("reserve").execute(tutorId, req);
    }

    @Override
    public void releaseSlot(Long tutorId, LocalDate date, LocalTime start, LocalTime end) {
        // Đóng gói tham số
        FreeSlotRequest req = new FreeSlotRequest();
        req.setDate(date);
        req.setTimeRanges(List.of(new FreeSlotRequest.TimeRange(start, end)));

        strategyMap.get("release").execute(tutorId, req);
    }
}