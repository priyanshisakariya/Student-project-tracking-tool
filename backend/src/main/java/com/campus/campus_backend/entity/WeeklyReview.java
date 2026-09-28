package com.campus.campus_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "weekly_review")
public class WeeklyReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weekly_review_id")
    private Integer weeklyReviewId;

    @Column(name = "progress_id", nullable = false, unique = true)
    private Integer progressId;

    @Column(name = "faculty_feedback", columnDefinition = "TEXT")
    private String facultyFeedback;


    public WeeklyReview() {
    }


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