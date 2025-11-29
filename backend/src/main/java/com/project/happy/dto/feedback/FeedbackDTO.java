package com.project.happy.dto.feedback;

public class FeedbackDTO {
    private Long meetingId; 
    private Integer rating;
    private String comment;

    public FeedbackDTO() {
    }

    public FeedbackDTO(Long meetingId, Integer rating, String comment) {
        this.meetingId = meetingId;
        this.rating = rating;
        this.comment = comment;
    }

    public Long getMeetingId() { return meetingId; }
    public void setMeetingId(Long meetingId) { this.meetingId = meetingId; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}