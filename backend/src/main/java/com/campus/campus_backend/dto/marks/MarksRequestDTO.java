package com.campus.campus_backend.dto.marks;

public class MarksRequestDTO {

    private Integer studentId;

    private Integer proposalId;

    private Integer proposalMarks;

    private Integer weeklyProgressMarks;

    private Integer finalReportMarks;

    private Integer presentationVivaMarks;

    private Integer sourceCodeMarks;

    private String strengths;

    private String areasForImprovement;

    private String overallComments;


    public MarksRequestDTO() {
    }


    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
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