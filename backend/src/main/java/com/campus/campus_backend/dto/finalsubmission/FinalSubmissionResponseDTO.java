package com.campus.campus_backend.dto.finalsubmission;

import java.time.LocalDateTime;

public class FinalSubmissionResponseDTO {

    private Integer submissionId;

    private Integer studentId;

    private String studentName;

    private String enrollmentNo;

    private String department;

    private String projectTitle;

    private String projectDomain;

    private String technologiesUsed;

    private String githubRepository;

    private String liveProjectUrl;

    private String demoVideoUrl;

    private String finalReportFile;

    private String sourceCodeFile;

    private String databaseFile;

    private Boolean declaration;

    private String status;

    private LocalDateTime submissionDate;

    public Integer getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Integer submissionId) {
        this.submissionId = submissionId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getEnrollmentNo() {
        return enrollmentNo;
    }

    public void setEnrollmentNo(String enrollmentNo) {
        this.enrollmentNo = enrollmentNo;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getProjectDomain() {
        return projectDomain;
    }

    public void setProjectDomain(String projectDomain) {
        this.projectDomain = projectDomain;
    }

    public String getTechnologiesUsed() {
        return technologiesUsed;
    }

    public void setTechnologiesUsed(String technologiesUsed) {
        this.technologiesUsed = technologiesUsed;
    }

    public String getGithubRepository() {
        return githubRepository;
    }

    public void setGithubRepository(String githubRepository) {
        this.githubRepository = githubRepository;
    }

    public String getLiveProjectUrl() {
        return liveProjectUrl;
    }

    public void setLiveProjectUrl(String liveProjectUrl) {
        this.liveProjectUrl = liveProjectUrl;
    }

    public String getDemoVideoUrl() {
        return demoVideoUrl;
    }

    public void setDemoVideoUrl(String demoVideoUrl) {
        this.demoVideoUrl = demoVideoUrl;
    }

    public String getFinalReportFile() {
        return finalReportFile;
    }

    public void setFinalReportFile(String finalReportFile) {
        this.finalReportFile = finalReportFile;
    }

    public String getSourceCodeFile() {
        return sourceCodeFile;
    }

    public void setSourceCodeFile(String sourceCodeFile) {
        this.sourceCodeFile = sourceCodeFile;
    }

    public String getDatabaseFile() {
        return databaseFile;
    }

    public void setDatabaseFile(String databaseFile) {
        this.databaseFile = databaseFile;
    }

    public Boolean getDeclaration() {
        return declaration;
    }

    public void setDeclaration(Boolean declaration) {
        this.declaration = declaration;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getStatus() {
        return status != null ? status : "Submitted";
    }

    public void setStatus(String status) {
        this.status = status;
    }
}