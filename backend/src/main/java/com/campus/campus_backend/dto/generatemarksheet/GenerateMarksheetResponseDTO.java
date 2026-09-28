package com.campus.campus_backend.dto.generatemarksheet;

import java.math.BigDecimal;

public class GenerateMarksheetResponseDTO {

    private Integer studentId;
    private Integer marksId;

    private String studentName;
    private String enrollment;
    private String projectTitle;
    private String guideName;

    private Integer proposalMarks;
    private Integer weeklyProgressMarks;
    private Integer finalReportMarks;
    private Integer presentationVivaMarks;
    private Integer sourceCodeMarks;

    private Integer totalMarks;
    private BigDecimal percentage;

    private String grade;
    private String result;

    private String overallComments;

    public GenerateMarksheetResponseDTO() {
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getMarksId() {
        return marksId;
    }

    public void setMarksId(Integer marksId) {
        this.marksId = marksId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(String enrollment) {
        this.enrollment = enrollment;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getGuideName() {
        return guideName;
    }

    public void setGuideName(String guideName) {
        this.guideName = guideName;
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

    public String getOverallComments() {
        return overallComments;
    }

    public void setOverallComments(String overallComments) {
        this.overallComments = overallComments;
    }
}
