package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.report.FacultyStudentReportResponseDTO;
import com.campus.campus_backend.service.FacultyStudentReportService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty-student-reports")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyStudentReportController {

    private final FacultyStudentReportService service;


    public FacultyStudentReportController(
            FacultyStudentReportService service
    ) {

        this.service = service;
    }


    // =====================================================
    // GET FACULTY STUDENT ALLOCATION
    // =====================================================

    @GetMapping
    public ResponseEntity<
            List<FacultyStudentReportResponseDTO>
            > getAllReports() {

        return ResponseEntity.ok(
                service.getFacultyStudentAllocation()
        );
    }
}