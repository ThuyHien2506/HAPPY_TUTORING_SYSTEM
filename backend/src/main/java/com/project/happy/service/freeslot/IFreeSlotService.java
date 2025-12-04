package com.project.happy.service.freeslot;

import com.project.happy.dto.freeslot.FreeSlotRequest;
import com.project.happy.dto.freeslot.FreeSlotResponse;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface IFreeSlotService {
    
    // GET
    FreeSlotResponse getDailySchedule(Long tutorId, LocalDate date);
    List<FreeSlotResponse> getMonthlySchedule(Long tutorId, int month, int year);
    
    // CUD (Create, Update, Delete)
    List<String> overwriteDailySchedule(Long tutorId, FreeSlotRequest request);
    void reserveSlot(Long tutorId, LocalDate date, LocalTime start, LocalTime end);
    void releaseSlot(Long tutorId, LocalDate date, LocalTime start, LocalTime end);
}