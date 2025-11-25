package com.project.happy.repository.storage;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.project.happy.entity.Meeting;

@Component
public class MeetingStore {

    private final List<Meeting> meetings = new ArrayList<>();

    public void add(Meeting m) {
        meetings.add(m);
    }

    public List<Meeting> getAll() {
        return meetings;
    }

    public Meeting findById(Long id) {
        return meetings.stream()
                       .filter(m -> m.getMeetingId().equals(id))
                       .findFirst()
                       .orElse(null);
    }
}
