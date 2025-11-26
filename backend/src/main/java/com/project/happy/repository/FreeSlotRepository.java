package com.project.happy.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.project.happy.entity.TutorSlot;

import jakarta.annotation.PostConstruct;

@Repository
@Primary
public class FreeSlotRepository implements IFreeSlotRepository {

    // Giả lập Database trong RAM
    private final List<TutorSlot> mockDb = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @Override
    public List<TutorSlot> findByTutorIdAndDate(Long tutorId, LocalDate date) {
        return mockDb.stream()
                .filter(s -> s.getTutorId().equals(tutorId) && s.getDate().equals(date))
                .collect(Collectors.toList());
    }

    @Override
    public List<TutorSlot> findByTutorIdAndDateBetween(Long tutorId, int month, int year) {
        return mockDb.stream()
                .filter(s -> s.getTutorId().equals(tutorId) &&
                        s.getDate().getMonthValue() == month &&
                        s.getDate().getYear() == year)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByTutorIdAndDate(Long tutorId, LocalDate date) {
        mockDb.removeIf(s -> s.getTutorId().equals(tutorId) && s.getDate().equals(date));
    }

    @Override
    public void saveAll(List<TutorSlot> slots) {
        for (TutorSlot slot : slots) {
            if (slot.getId() == null) {
                slot.setId(idGenerator.getAndIncrement()); // Tự sinh ID
            }
            mockDb.add(slot);
        }
    }

    @PostConstruct
    public void initDemoData() {
        System.out.println(">>> INIT SLOT DATA");
        System.out.println(">>> FreeSlotRepository INIT hash = " + this.hashCode());

        TutorSlot s1 = new TutorSlot();
        s1.setTutorId(2L);
        s1.setDate(LocalDate.of(2025, 1, 1));
        s1.setStartTime(LocalTime.of(10, 0));
        s1.setEndTime(LocalTime.of(11, 0));
        mockDb.add(s1);

        TutorSlot s2 = new TutorSlot();
        s2.setTutorId(2L);
        s2.setDate(LocalDate.of(2025, 1, 1));
        s2.setStartTime(LocalTime.of(13, 0));
        s2.setEndTime(LocalTime.of(14, 0));
        mockDb.add(s2);

        System.out.println(">>> TOTAL SLOT = " + mockDb.size());
    }

}