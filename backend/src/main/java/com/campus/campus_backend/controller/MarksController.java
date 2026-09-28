package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.marks.MarksRequestDTO;
import com.campus.campus_backend.dto.marks.MarksResponseDTO;
import com.campus.campus_backend.dto.marks.MarksStudentResponseDTO;
import com.campus.campus_backend.service.MarksService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/marks")
@CrossOrigin(origins = "http://localhost:5173")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    // Get students for Mark Management table (FACULTY-SCOPED)
    @GetMapping("/students")
    public ResponseEntity<List<MarksStudentResponseDTO>> getStudentsForMarks(
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        return ResponseEntity.ok(
                marksService.getStudentsForMarks(facultyId, facultyName)
        );
    }

    // Get marks of one student (WITH AUTHORIZATION)
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getMarksByStudent(
            @PathVariable Integer studentId,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        MarksResponseDTO response =
                marksService.getMarksByStudentId(studentId, facultyId, facultyName);

        if (response == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Marks not assigned for this student.");
        }

        return ResponseEntity.ok(response);
    }

    // Save or update marks (WITH AUTHORIZATION)
    @PostMapping
    public ResponseEntity<MarksResponseDTO> saveMarks(
            @RequestBody MarksRequestDTO requestDTO,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(marksService.saveMarks(requestDTO, facultyId, facultyName));
    }
}