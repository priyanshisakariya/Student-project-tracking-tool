package com.campus.campus_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_proposal")

public class ReviewProposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_proposal_id")
    private Integer reviewProposalId;

    @Column(name = "proposal_id", nullable = false, unique = true)
    private Integer proposalId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "project_title", nullable = false, length = 200)
    private String projectTitle;

    @Column(name = "project_domain", nullable = false, length = 100)
    private String projectDomain;

    @Column(name = "technology_stack", nullable = false, columnDefinition = "TEXT")
    private String technologyStack;

    @Column(name = "other_technology")
    private String otherTechnology;

    @Column(name = "member2_name")
    private String member2Name;

    @Column(name = "member2_enrollment")
    private String member2Enrollment;

    @Column(name = "member3_name")
    private String member3Name;

    @Column(name = "member3_enrollment")
    private String member3Enrollment;

    @Column(name = "project_description", nullable = false, columnDefinition = "TEXT")
    private String projectDescription;

    @Column(name = "proposal_file", nullable = false)
    private String proposalFile;

    @Column(name = "status", nullable = false)
    private String status = "PENDING";

    @Column(name = "comments")
    private String comments;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;


    public ReviewProposal() {
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
