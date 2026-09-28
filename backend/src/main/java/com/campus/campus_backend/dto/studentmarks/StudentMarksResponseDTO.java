package com.campus.campus_backend.dto.studentmarks;

import java.math.BigDecimal;

public class StudentMarksResponseDTO {

    private Integer marksId;
    private Integer studentId;

    private Integer proposalMarks;
    private Integer weeklyProgressMarks;
    private Integer finalReportMarks;
    private Integer presentationVivaMarks;
    private Integer sourceCodeMarks;

    private Integer totalMarks;
    private BigDecimal percentage;

    private String grade;
    private String result;

    private String strengths;
    private String areasForImprovement;
    private String overallComments;

    public StudentMarksResponseDTO() {
    }

    public Integer getMarksId() {
        return marksId;
    }

    public void setMarksId(Integer marksId) {
        this.marksId = marksId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
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