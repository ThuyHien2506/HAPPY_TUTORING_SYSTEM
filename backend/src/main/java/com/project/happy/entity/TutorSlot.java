package com.project.happy.entity;

import java.time.LocalDate;
import java.time.LocalTime;

public class TutorSlot {
    private Long id;
    private Long tutorId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    // 1. Constructor rỗng (Bắt buộc cho JPA/Framework)
    public TutorSlot() {}

    // 2. Constructor 4 tham số (Cái này để sửa lỗi đỏ của bạn)
    public TutorSlot(Long tutorId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        this.tutorId = tutorId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getTutorId() { return tutorId; }
    public void setTutorId(Long tutorId) { this.tutorId = tutorId; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public boolean isOverlapping(TutorSlot other) {
        // Cần đảm bảo cùng ngày và cùng tutor
        if (!this.date.equals(other.date) || !this.tutorId.equals(other.tutorId)) {
            return false;
        }
        return this.startTime.isBefore(other.endTime) && this.endTime.isAfter(other.startTime);
    }
}