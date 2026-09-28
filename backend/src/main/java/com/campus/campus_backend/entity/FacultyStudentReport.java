package com.campus.campus_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "faculty_student_reports")
public class FacultyStudentReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_no", nullable = false)
    private Integer groupNo;

    // 1st Student
    @Column(name = "student1_enrollment_no", nullable = false)
    private String student1EnrollmentNo;

    @Column(name = "student1_name", nullable = false)
    private String student1Name;

    // 2nd Student
    @Column(name = "student2_enrollment_no", nullable = false)
    private String student2EnrollmentNo;

    @Column(name = "student2_name", nullable = false)
    private String student2Name;

    // 3rd Student
    @Column(name = "student3_enrollment_no", nullable = false)
    private String student3EnrollmentNo;

    @Column(name = "student3_name", nullable = false)
    private String student3Name;

    // Faculty Guide
    @Column(name = "faculty_guide", nullable = false)
    private String facultyGuide;

    public FacultyStudentReport() {
    }

    public Integer getGroupNo() {
        return groupNo;
    }

    public void setGroupNo(Integer groupNo) {
        this.groupNo = groupNo;
    }

    public String getStudent1EnrollmentNo() {
        return student1EnrollmentNo;
    }

    public void setStudent1EnrollmentNo(String student1EnrollmentNo) {
        this.student1EnrollmentNo = student1EnrollmentNo;
    }

    public String getStudent1Name() {
        return student1Name;
    }

    public void setStudent1Name(String student1Name) {
        this.student1Name = student1Name;
    }

    public String getStudent2EnrollmentNo() {
        return student2EnrollmentNo;
    }

    public void setStudent2EnrollmentNo(String student2EnrollmentNo) {
        this.student2EnrollmentNo = student2EnrollmentNo;
    }

    public String getStudent2Name() {
        return student2Name;
    }

    public void setStudent2Name(String student2Name) {
        this.student2Name = student2Name;
    }

    public String getStudent3EnrollmentNo() {
        return student3EnrollmentNo;
    }

    public void setStudent3EnrollmentNo(String student3EnrollmentNo) {
        this.student3EnrollmentNo = student3EnrollmentNo;
    }

    public String getStudent3Name() {
        return student3Name;
    }

    public void setStudent3Name(String student3Name) {
        this.student3Name = student3Name;
    }

    public String getFacultyGuide() {
        return facultyGuide;
    }

    public void setFacultyGuide(String facultyGuide) {
        this.facultyGuide = facultyGuide;
    }
}