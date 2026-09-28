package com.campus.campus_backend.dto.dashboard;

import com.campus.campus_backend.dto.notification.FacultyNotificationResponseDTO;

import java.util.ArrayList;
import java.util.List;

public class StudentDashboardDTO {

    private String studentName;
    private String proposalStatus;
    private String projectTitle;
    private int submittedWeeklyReports;
    private int totalWeeklyReports = 6;
    private List<WeeklyProgressItem> weeklyProgressData = new ArrayList<>();
    private String finalSubmissionStatus;
    private int projectMarks;
    private int projectCompletion;
    private List<String> notifications = new ArrayList<>();
    private List<FacultyNotificationResponseDTO> facultyNotifications = new ArrayList<>();

    public StudentDashboardDTO() {
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getProposalStatus() {
        return proposalStatus;
    }

    public void setProposalStatus(String proposalStatus) {
        this.proposalStatus = proposalStatus;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public int getSubmittedWeeklyReports() {
        return submittedWeeklyReports;
    }

    public void setSubmittedWeeklyReports(int submittedWeeklyReports) {
        this.submittedWeeklyReports = submittedWeeklyReports;
    }

    public int getTotalWeeklyReports() {
        return totalWeeklyReports;
    }

    public void setTotalWeeklyReports(int totalWeeklyReports) {
        this.totalWeeklyReports = totalWeeklyReports;
    }

    public List<WeeklyProgressItem> getWeeklyProgressData() {
        return weeklyProgressData;
    }

    public void setWeeklyProgressData(List<WeeklyProgressItem> weeklyProgressData) {
        this.weeklyProgressData = weeklyProgressData;
    }

    public String getFinalSubmissionStatus() {
        return finalSubmissionStatus;
    }

    public void setFinalSubmissionStatus(String finalSubmissionStatus) {
        this.finalSubmissionStatus = finalSubmissionStatus;
    }

    public int getProjectMarks() {
        return projectMarks;
    }

    public void setProjectMarks(int projectMarks) {
        this.projectMarks = projectMarks;
    }

    public int getProjectCompletion() {
        return projectCompletion;
    }

    public void setProjectCompletion(int projectCompletion) {
        this.projectCompletion = projectCompletion;
    }

    public List<String> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<String> notifications) {
        this.notifications = notifications;
    }

    public List<FacultyNotificationResponseDTO> getFacultyNotifications() {
        return facultyNotifications;
    }

    public void setFacultyNotifications(List<FacultyNotificationResponseDTO> facultyNotifications) {
        this.facultyNotifications = facultyNotifications;
    }

    public static class WeeklyProgressItem {
        private String week;
        private int submitted;
        private int background = 1;

        public WeeklyProgressItem() {
        }

        public WeeklyProgressItem(String week, int submitted, int background) {
            this.week = week;
            this.submitted = submitted;
            this.background = background;
        }

        public String getWeek() {
            return week;
        }

        public void setWeek(String week) {
            this.week = week;
        }

        public int getSubmitted() {
            return submitted;
        }

        public void setSubmitted(int submitted) {
            this.submitted = submitted;
        }

        public int getBackground() {
            return background;
        }

        public void setBackground(int background) {
            this.background = background;
        }
    }
}
