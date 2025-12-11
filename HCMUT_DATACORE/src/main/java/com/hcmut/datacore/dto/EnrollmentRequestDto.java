package com.hcmut.datacore.dto;

public class EnrollmentRequestDto {

    private String studentBkNetId;
    private String tutorBkNetId;
    private Long subjectId;

    // Getters and Setters

    public String getStudentBkNetId() {
        return studentBkNetId;
    }

    public void setStudentBkNetId(String studentBkNetId) {
        this.studentBkNetId = studentBkNetId;
    }

    public String getTutorBkNetId() {
        return tutorBkNetId;
    }

    public void setTutorBkNetId(String tutorBkNetId) {
        this.tutorBkNetId = tutorBkNetId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
}
