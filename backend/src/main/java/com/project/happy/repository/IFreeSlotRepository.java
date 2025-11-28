package com.project.happy.repository;

import com.project.happy.entity.TutorSlot;
import java.time.LocalDate;
import java.util.List;

public interface IFreeSlotRepository {
    // --- LIST 1: AVAILABLE (Rảnh thật sự - Hiện lên Frontend) ---
    List<TutorSlot> findAvailableByTutorIdAndDate(Long tutorId, LocalDate date);
    List<TutorSlot> findAvailableByTutorIdAndDateBetween(Long tutorId, int month, int year);
    void saveAvailable(List<TutorSlot> slots);

    // --- LIST 2: BOOKED (Đã bị đặt - Ẩn đi để track) ---
    List<TutorSlot> findBookedByTutorIdAndDate(Long tutorId, LocalDate date);
    void saveBooked(List<TutorSlot> slots);

    // --- QUẢN LÝ CHUNG ---
    // Xóa sạch cả 2 list của ngày hôm đó (Dùng khi ghi đè)
    void deleteAllByTutorIdAndDate(Long tutorId, LocalDate date);
}