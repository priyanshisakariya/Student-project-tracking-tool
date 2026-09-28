package com.campus.campus_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "mentor_assignments")
public class MentorAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // GROUP NUMBER
    // =====================================================

    @Column(name = "group_number", nullable = false, unique = true)
    private Integer groupNumber;

    // =====================================================
    // PROJECT
    // =====================================================

    @Column(nullable = false)
    private String project;

    // =====================================================
    // MENTOR
    // =====================================================

    private String mentor;

    // =====================================================
    // DEPARTMENT
    // =====================================================

    private String department;

    // =====================================================
    // STATUS
    // =====================================================

    private String status;

    // =====================================================
    // STUDENT
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public MentorAssignment() {
    }

    // =====================================================
    // ID
    // =====================================================

    public Long getId() {
        return id;
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

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}