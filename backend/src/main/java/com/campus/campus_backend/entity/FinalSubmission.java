package com.campus.campus_backend.entity;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "final_submission")
public class FinalSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer submissionId;

    private String projectTitle;

    private String projectDomain;

    @Column(columnDefinition = "TEXT")
    private String technologiesUsed;

    @Column(columnDefinition = "TEXT")
    private String githubRepository;

    @Column(columnDefinition = "TEXT")
    private String liveProjectUrl;

    @Column(columnDefinition = "TEXT")
    private String demoVideoUrl;

    private String finalReportFile;

    private String sourceCodeFile;

    private String databaseFile;

    private Boolean declaration;

    private String status = "Submitted";

    private LocalDateTime submissionDate;
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;


    // Getters and Setters

    public String getStatus() {
        return status != null ? status : "Submitted";
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Integer submissionId) {
        this.submissionId = submissionId;
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

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }
}