package com.campus.campus_backend.dto.ReviewProposal;

import java.time.LocalDateTime;

public class ReviewProposalResponseDTO {

    private Integer reviewProposalId;
    private Integer proposalId;
    private Integer studentId;

    private String projectTitle;
    private String projectDomain;
    private String technologyStack;
    private String otherTechnology;

    private String member2Name;
    private String member2Enrollment;

    private String member3Name;
    private String member3Enrollment;

    private String projectDescription;
    private String proposalFile;

    private String status;
    private String comments;
    private LocalDateTime reviewedAt;


    public ReviewProposalResponseDTO() {
    }


    public Integer getReviewProposalId() {
        return reviewProposalId;
    }

    public void setReviewProposalId(Integer reviewProposalId) {
        this.reviewProposalId = reviewProposalId;
    }


    public Integer getProposalId() {
        return proposalId;
    }

    public void setProposalId(Integer proposalId) {
        this.proposalId = proposalId;
    }


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


    public String getTechnologyStack() {
        return technologyStack;
    }

    public void setTechnologyStack(String technologyStack) {
        this.technologyStack = technologyStack;
    }


    public String getOtherTechnology() {
        return otherTechnology;
    }

    public void setOtherTechnology(String otherTechnology) {
        this.otherTechnology = otherTechnology;
    }


    public String getMember2Name() {
        return member2Name;
    }

    public void setMember2Name(String member2Name) {
        this.member2Name = member2Name;
    }


    public String getMember2Enrollment() {
        return member2Enrollment;
    }

    public void setMember2Enrollment(String member2Enrollment) {
        this.member2Enrollment = member2Enrollment;
    }


    public String getMember3Name() {
        return member3Name;
    }

    public void setMember3Name(String member3Name) {
        this.member3Name = member3Name;
    }


    public String getMember3Enrollment() {
        return member3Enrollment;
    }

    public void setMember3Enrollment(String member3Enrollment) {
        this.member3Enrollment = member3Enrollment;
    }


    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }


    public String getProposalFile() {
        return proposalFile;
    }

    public void setProposalFile(String proposalFile) {
        this.proposalFile = proposalFile;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }


    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}