package com.campus.campus_backend.dto.facultyAssignedStudentDTO;

public class FacultyAssignedStudentDTO {

    private Integer id;
    private String name;
    private String enrollment;
    private String department;
    private String project;
    private Integer progress;
    private String status;

    public FacultyAssignedStudentDTO() {
    }

    public FacultyAssignedStudentDTO(
            Integer id,
            String name,
            String enrollment,
            String department,
            String project,
            Integer progress,
            String status
    ) {
        this.id = id;
        this.name = name;
        this.enrollment = enrollment;
        this.department = department;
        this.project = project;
        this.progress = progress;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEnrollment() {
        return enrollment;
    }

    public String getDepartment() {
        return department;
    }

    public String getProject() {
        return project;
    }

    public Integer getProgress() {
        return progress;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEnrollment(String enrollment) {
        this.enrollment = enrollment;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}