package com.campus.campus_backend.dto.finalsubmission;

public class FinalSubmissionRequestDTO {

    private Integer studentId;

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


    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
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
}