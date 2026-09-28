package com.campus.campus_backend.dto.mentor;

public class MentorAssignmentResponseDTO {

    private Long id;

    private Integer groupNumber;

    private String project;

    private String mentor;

    private String department;

    private String status;

    private Integer studentId;

    private String studentName;

    public MentorAssignmentResponseDTO() {
    }

    public MentorAssignmentResponseDTO(
            Long id,
            Integer groupNumber,
            String project,
            String mentor,
            String department,
            String status
    ) {

        this.id = id;
        this.groupNumber = groupNumber;
        this.project = project;
        this.mentor = mentor;
        this.department = department;
        this.status = status;
    }

    public MentorAssignmentResponseDTO(
            Long id,
            Integer groupNumber,
            String project,
            String mentor,
            String department,
            String status,
            Integer studentId,
            String studentName
    ) {

        this.id = id;
        this.groupNumber = groupNumber;
        this.project = project;
        this.mentor = mentor;
        this.department = department;
        this.status = status;
        this.studentId = studentId;
        this.studentName = studentName;
    }

    // =====================================================
    // ID
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    // =====================================================
    // STUDENT
    // =====================================================

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
}