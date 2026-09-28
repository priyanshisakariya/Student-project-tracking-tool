package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.generatemarksheet.GenerateMarksheetResponseDTO;
import com.campus.campus_backend.service.GenerateMarksheetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/generate-marksheet")
@CrossOrigin(origins = "*")
public class GenerateMarksheetController {

    private final GenerateMarksheetService service;

    public GenerateMarksheetController(
            GenerateMarksheetService service
    ) {
        this.service = service;
    }

    // =========================================================
    // GET STUDENTS WHO HAVE MARKS (FACULTY-SCOPED)
    // =========================================================

    @GetMapping("/students")
    public ResponseEntity<List<GenerateMarksheetResponseDTO>> getStudents(
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        return ResponseEntity.ok(
                service.getAllStudents(facultyId, facultyName)
        );
    }

    // =========================================================
    // GET MARKSHEET FOR ONE STUDENT (WITH AUTHORIZATION)
    // =========================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentMarksheet(
            @PathVariable Integer studentId,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        try {
            return ResponseEntity.ok(
                    service.getStudentMarksheet(studentId, facultyId, facultyName)
            );
        } catch (RuntimeException exception) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(exception.getMessage());
        }
    }
}