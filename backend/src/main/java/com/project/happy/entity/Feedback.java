package com.project.happy.entity;

import java.time.LocalDateTime;

public class Feedback {
    private Long feedbackId;
    private Long meetingId;
    private Integer rating;
    private String comment;
    private LocalDateTime submitAt; 

    public Feedback() {  }

    public Feedback(Long feedbackId, Long meetingId, Integer rating, String comment, LocalDateTime submitAt) {
        this.feedbackId = feedbackId;
        this.meetingId = meetingId;
        this.rating = rating;
        this.comment = comment;
        this.submitAt = submitAt;
    }

    public Long getFeedbackId() { return feedbackId; }
    public Long getMeetingId() { return meetingId; }
    public Integer getRating() { return rating; }
    public String getComment() { return comment; }
    public LocalDateTime getSubmitAt() { return submitAt; }
    public void setFeedbackId(Long feedbackId) { this.feedbackId = feedbackId; }
    public void setMeetingId(Long meetingId) { this.meetingId = meetingId; }
    public void setRating(Integer rating) { this.rating = rating; }
    public void setComment(String comment) { this.comment = comment; }
    public void setSubmitAt(LocalDateTime submitAt) { this.submitAt = submitAt; }
}
