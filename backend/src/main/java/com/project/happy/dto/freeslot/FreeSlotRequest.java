package com.project.happy.dto.freeslot;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class FreeSlotRequest {

    private LocalDate date;
    private List<TimeRange> timeRanges;

    // Getter & Setter cho class cha
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public List<TimeRange> getTimeRanges() { return timeRanges; }
    public void setTimeRanges(List<TimeRange> timeRanges) { this.timeRanges = timeRanges; }

    // ==========================================
    // SỬA CLASS NÀY (INNER CLASS)
    // ==========================================
    public static class TimeRange {
        private LocalTime startTime;
        private LocalTime endTime;

        // 1. Giữ lại Constructor rỗng (Bắt buộc để Spring nhận JSON)
        public TimeRange() {
        }

        // 2. THÊM CONSTRUCTOR NÀY VÀO (Để fix lỗi đỏ của bạn)
        public TimeRange(LocalTime startTime, LocalTime endTime) {
            this.startTime = startTime;
            this.endTime = endTime;
        }

        // Getter & Setter
        public LocalTime getStartTime() { return startTime; }
        public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
        public LocalTime getEndTime() { return endTime; }
        public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    }
}