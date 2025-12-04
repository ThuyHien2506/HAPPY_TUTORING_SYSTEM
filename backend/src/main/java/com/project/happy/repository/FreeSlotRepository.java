package com.project.happy.repository;

import com.project.happy.entity.TutorSlot;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
public class FreeSlotRepository implements IFreeSlotRepository {

    // HAI LIST RIÊNG BIỆT TRONG RAM
    private final List<TutorSlot> availableList = new ArrayList<>(); // List 1
    private final List<TutorSlot> bookedList = new ArrayList<>();    // List 2
    
    private final AtomicLong idGenerator = new AtomicLong(1);

    // --- XỬ LÝ AVAILABLE ---
    @Override
    public List<TutorSlot> findAvailableByTutorIdAndDate(Long tutorId, LocalDate date) {
        return availableList.stream()
                .filter(s -> s.getTutorId().equals(tutorId) && s.getDate().equals(date))
                .collect(Collectors.toList());
    }

    
    @Override
    public List<TutorSlot> findAvailableByTutorIdAndDateBetween(Long tutorId, int month, int year) {
        return availableList.stream()
                .filter(s -> s.getTutorId().equals(tutorId) && 
                             s.getDate().getMonthValue() == month && 
                             s.getDate().getYear() == year)
                .collect(Collectors.toList());
    }

    @Override
    public void saveAvailable(List<TutorSlot> slots) {
        for (TutorSlot slot : slots) {
            slot.setId(idGenerator.getAndIncrement());
            availableList.add(slot);
        }
    }

    // --- XỬ LÝ BOOKED ---
    @Override
    public List<TutorSlot> findBookedByTutorIdAndDate(Long tutorId, LocalDate date) {
        return bookedList.stream()
                .filter(s -> s.getTutorId().equals(tutorId) && s.getDate().equals(date))
                .collect(Collectors.toList());
    }

    @Override
    public void saveBooked(List<TutorSlot> slots) {
        for (TutorSlot slot : slots) {
            slot.setId(idGenerator.getAndIncrement());
            bookedList.add(slot);
        }
    }

    // --- XÓA HẾT (Clean ngày cũ) ---
    @Override
    public void deleteAllByTutorIdAndDate(Long tutorId, LocalDate date) {
        availableList.removeIf(s -> s.getTutorId().equals(tutorId) && s.getDate().equals(date));
        bookedList.removeIf(s -> s.getTutorId().equals(tutorId) && s.getDate().equals(date));
    }
}