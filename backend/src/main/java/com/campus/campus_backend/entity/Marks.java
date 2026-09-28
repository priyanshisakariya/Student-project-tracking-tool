package com.campus.campus_backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "marks")
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "marks_id")
    private Integer marksId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "proposal_id")
    private Integer proposalId;

    @Column(name = "proposal_marks", nullable = false)
    private Integer proposalMarks = 0;

    @Column(name = "weekly_progress_marks", nullable = false)
    private Integer weeklyProgressMarks = 0;

    @Column(name = "final_report_marks", nullable = false)
    private Integer finalReportMarks = 0;

    @Column(name = "presentation_viva_marks", nullable = false)
    private Integer presentationVivaMarks = 0;

    @Column(name = "source_code_marks", nullable = false)
    private Integer sourceCodeMarks = 0;

    @Column(name = "total_marks", nullable = false)
    private Integer totalMarks = 0;

    @Column(name = "percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage = BigDecimal.ZERO;

    @Column(name = "grade", length = 5)
    private String grade;

    @Column(name = "result", length = 10)
    private String result;

    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "areas_for_improvement", columnDefinition = "TEXT")
    private String areasForImprovement;

    @Column(name = "overall_comments", columnDefinition = "TEXT")
    private String overallComments;


    public Marks() {
    }


    public Integer getMarksId() {
        return marksId;
    }

    public void setMarksId(Integer marksId) {
        this.marksId = marksId;
    }


    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }


    public Integer getProposalId() {
        return proposalId;
    }

    public void setProposalId(Integer proposalId) {
        this.proposalId = proposalId;
    }


    public Integer getProposalMarks() {
        return proposalMarks;
    }

    public void setProposalMarks(Integer proposalMarks) {
        this.proposalMarks = proposalMarks;
    }


    public Integer getWeeklyProgressMarks() {
        return weeklyProgressMarks;
    }

    public void setWeeklyProgressMarks(Integer weeklyProgressMarks) {
        this.weeklyProgressMarks = weeklyProgressMarks;
    }


    public Integer getFinalReportMarks() {
        return finalReportMarks;
    }

    public void setFinalReportMarks(Integer finalReportMarks) {
        this.finalReportMarks = finalReportMarks;
    }


    public Integer getPresentationVivaMarks() {
        return presentationVivaMarks;
    }

    public void setPresentationVivaMarks(Integer presentationVivaMarks) {
        this.presentationVivaMarks = presentationVivaMarks;
    }


    public Integer getSourceCodeMarks() {
        return sourceCodeMarks;
    }

    public void setSourceCodeMarks(Integer sourceCodeMarks) {
        this.sourceCodeMarks = sourceCodeMarks;
    }


    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }


    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }


    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }


    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }


    public String getStrengths() {
        return strengths;
    }

    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }


    public String getAreasForImprovement() {
        return areasForImprovement;
    }

    public void setAreasForImprovement(String areasForImprovement) {
        this.areasForImprovement = areasForImprovement;
    }


    public String getOverallComments() {
        return overallComments;
    }

    public void setOverallComments(String overallComments) {
        this.overallComments = overallComments;
    }


}