package com.campus.campus_backend.dto.Faculty;

import com.campus.campus_backend.entity.Faculty;

public class FacultyResponse {


    private Long facultyId;
    private String facultyName;
    private String phoneNumber;
    private String designation;
    private String department;


    public FacultyResponse(Faculty faculty) {

        this.facultyId = faculty.getFacultyId();
        this.facultyName = faculty.getFacultyName();
        this.phoneNumber = faculty.getPhoneNumber();
        this.designation = faculty.getDesignation();
        this.department = faculty.getDepartment();
    }


    public Long getFacultyId() {
        return facultyId;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getDesignation() {
        return designation;
    }

    public String getDepartment() {
        return department;
    }

}
