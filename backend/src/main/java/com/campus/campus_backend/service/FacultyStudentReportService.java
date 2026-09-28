package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.report.FacultyStudentReportResponseDTO;

import java.util.List;

public interface FacultyStudentReportService {

    List<FacultyStudentReportResponseDTO>
    getFacultyStudentAllocation();

//   List<FacultyStudentReportResponseDTO> getAllReports();
}