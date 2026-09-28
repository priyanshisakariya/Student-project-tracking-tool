package com.campus.campus_backend.dto.report;

public class FacultyStudentReportResponseDTO {

//    private Long id;
    private Integer groupNo;

    private String student1EnrollmentNo;
    private String student1Name;

    private String student2EnrollmentNo;
    private String student2Name;

    private String student3EnrollmentNo;
    private String student3Name;

    private String facultyGuide;

    public FacultyStudentReportResponseDTO() {
    }

    public FacultyStudentReportResponseDTO(
//            Long id,
            Integer groupNo,
            String student1EnrollmentNo,
            String student1Name,
            String student2EnrollmentNo,
            String student2Name,
            String student3EnrollmentNo,
            String student3Name,
            String facultyGuide) {

//        this.id = id;
        this.groupNo = groupNo;

        this.student1EnrollmentNo = student1EnrollmentNo;
        this.student1Name = student1Name;

        this.student2EnrollmentNo = student2EnrollmentNo;
        this.student2Name = student2Name;

        this.student3EnrollmentNo = student3EnrollmentNo;
        this.student3Name = student3Name;

        this.facultyGuide = facultyGuide;
    }

//    public Long getId() {
//        return id;
//    }

    public Integer getGroupNo() {
        return groupNo;
    }

    public String getStudent1EnrollmentNo() {
        return student1EnrollmentNo;
    }

    public String getStudent1Name() {
        return student1Name;
    }

    public String getStudent2EnrollmentNo() {
        return student2EnrollmentNo;
    }

    public String getStudent2Name() {
        return student2Name;
    }

    public String getStudent3EnrollmentNo() {
        return student3EnrollmentNo;
    }

    public String getStudent3Name() {
        return student3Name;
    }

    public String getFacultyGuide() {
        return facultyGuide;
    }
}