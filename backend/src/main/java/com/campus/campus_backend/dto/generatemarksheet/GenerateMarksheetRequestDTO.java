package com.campus.campus_backend.dto.generatemarksheet;

public class GenerateMarksheetRequestDTO {

    private Integer studentId;
    private String subject;
    private String finalVivaDate;
    private String remarks;

    public GenerateMarksheetRequestDTO() {
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getFinalVivaDate() {
        return finalVivaDate;
    }

    public void setFinalVivaDate(String finalVivaDate) {
        this.finalVivaDate = finalVivaDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}