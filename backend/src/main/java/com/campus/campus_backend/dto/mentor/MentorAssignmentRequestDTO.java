package com.campus.campus_backend.dto.mentor;

public class MentorAssignmentRequestDTO {

    private Integer groupNumber;

    private Integer studentId;

    private String project;

    private String mentor;

    private String department;

    private String status;

    public MentorAssignmentRequestDTO() {
    }

    // =====================================================
    // GROUP NUMBER
    // =====================================================

    public Integer getGroupNumber() {
        return groupNumber;
    }

    public void setGroupNumber(Integer groupNumber) {
        this.groupNumber = groupNumber;
    }


    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    // =====================================================
    // PROJECT
    // =====================================================

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    // =====================================================
    // MENTOR
    // =====================================================

    public String getMentor() {
        return mentor;
    }

    public void setMentor(String mentor) {
        this.mentor = mentor;
    }

    // =====================================================
    // DEPARTMENT
    // =====================================================

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    // =====================================================
    // STATUS
    // =====================================================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}