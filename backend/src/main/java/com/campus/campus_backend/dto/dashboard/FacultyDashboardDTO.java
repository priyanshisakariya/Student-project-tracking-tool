package com.campus.campus_backend.dto.dashboard;

import java.util.ArrayList;
import java.util.List;

public class FacultyDashboardDTO {

    private String facultyName;
    private int assignedStudentsCount;
    private int pendingProposalsCount;
    private int weeklyReviewsCount;
    private int notificationsCount;

    private List<StudentProgress> students = new ArrayList<>();
    private List<Activity> activities = new ArrayList<>();
    private List<Notice> notices = new ArrayList<>();

    public FacultyDashboardDTO() {
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public int getAssignedStudentsCount() {
        return assignedStudentsCount;
    }

    public void setAssignedStudentsCount(int assignedStudentsCount) {
        this.assignedStudentsCount = assignedStudentsCount;
    }

    public int getPendingProposalsCount() {
        return pendingProposalsCount;
    }

    public void setPendingProposalsCount(int pendingProposalsCount) {
        this.pendingProposalsCount = pendingProposalsCount;
    }

    public int getWeeklyReviewsCount() {
        return weeklyReviewsCount;
    }

    public void setWeeklyReviewsCount(int weeklyReviewsCount) {
        this.weeklyReviewsCount = weeklyReviewsCount;
    }

    public int getNotificationsCount() {
        return notificationsCount;
    }

    public void setNotificationsCount(int notificationsCount) {
        this.notificationsCount = notificationsCount;
    }

    public List<StudentProgress> getStudents() {
        return students;
    }

    public void setStudents(List<StudentProgress> students) {
        this.students = students;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }

    public List<Notice> getNotices() {
        return notices;
    }

    public void setNotices(List<Notice> notices) {
        this.notices = notices;
    }

    // Inner DTO classes
    public static class StudentProgress {
        private Integer id;
        private String name;
        private int progress;

        public StudentProgress() {
        }

        public StudentProgress(Integer id, String name, int progress) {
            this.id = id;
            this.name = name;
            this.progress = progress;
        }

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getProgress() {
            return progress;
        }

        public void setProgress(int progress) {
            this.progress = progress;
        }
    }

    public static class Activity {
        private String id;
        private String icon;
        private String text;

        public Activity() {
        }

        public Activity(String id, String icon, String text) {
            this.id = id;
            this.icon = icon;
            this.text = text;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }

    public static class Notice {
        private Long id;
        private String message;

        public Notice() {
        }

        public Notice(Long id, String message) {
            this.id = id;
            this.message = message;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
