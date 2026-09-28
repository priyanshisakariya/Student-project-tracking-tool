package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.studentmarks.StudentMarksResponseDTO;
import com.campus.campus_backend.service.StudentMarksService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student/marks")
@CrossOrigin(origins = "*")
public class StudentMarksController {

    private final StudentMarksService studentMarksService;

    public StudentMarksController(
            StudentMarksService studentMarksService) {

        this.studentMarksService = studentMarksService;
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<?> getStudentMarks(
            @PathVariable Integer studentId) {

        StudentMarksResponseDTO marks = studentMarksService.getStudentMarks(studentId);
        if (marks == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Marks not published yet for student id: " + studentId));
        }

        return ResponseEntity.ok(marks);
    }
}