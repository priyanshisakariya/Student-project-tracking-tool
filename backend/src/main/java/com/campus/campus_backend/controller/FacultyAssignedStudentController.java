package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.facultyAssignedStudentDTO.FacultyAssignedStudentDTO;
import com.campus.campus_backend.service.FacultyAssignedStudentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty-assigned-students")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyAssignedStudentController {

    private final FacultyAssignedStudentService service;

    public FacultyAssignedStudentController(
            FacultyAssignedStudentService service
    ) {
        this.service = service;
    }

    // =====================================================
    // GET STUDENTS ASSIGNED TO FACULTY
    // =====================================================

    @GetMapping
    public ResponseEntity<List<FacultyAssignedStudentDTO>> getAssignedStudents(
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        return ResponseEntity.ok(
                service.getAssignedStudents(facultyId, facultyName)
        );
    }
}