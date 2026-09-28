package com.campus.campus_backend.dto.WeeklyReview;

public class WeeklyReviewResponseDTO {

    private Integer weeklyReviewId;

    private Integer progressId;

    private String facultyFeedback;


    public Integer getWeeklyReviewId() {
        return weeklyReviewId;
    }

    public void setWeeklyReviewId(Integer weeklyReviewId) {
        this.weeklyReviewId = weeklyReviewId;
    }


    public Integer getProgressId() {
        return progressId;
    }

    public void setProgressId(Integer progressId) {
        this.progressId = progressId;
    }


    public String getFacultyFeedback() {
        return facultyFeedback;
    }

    public void setFacultyFeedback(String facultyFeedback) {
        this.facultyFeedback = facultyFeedback;
    }
}