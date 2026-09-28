package com.campus.campus_backend.dto.studentAdminDTO;

public class StudentDTO {

    private Long id;
    private String name;
    private String enrollment;
    private String project;
    private String faculty;
    private String status;

    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public StudentDTO() {
    }

    // =========================================================
    // PARAMETERIZED CONSTRUCTOR
    // =========================================================

    public StudentDTO(
            Long id,
            String name,
            String enrollment,
            String project,
            String faculty,
            String status
    ) {
        this.id = id;
        this.name = name;
        this.enrollment = enrollment;
        this.project = project;
        this.faculty = faculty;
        this.status = status;
    }

    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(String enrollment) {
        this.enrollment = enrollment;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}