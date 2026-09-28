package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.mentor.MentorAssignmentRequestDTO;
import com.campus.campus_backend.dto.mentor.MentorAssignmentResponseDTO;
import com.campus.campus_backend.entity.Faculty;
import com.campus.campus_backend.service.MentorAssignmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor-assignments")
@CrossOrigin(origins = "http://localhost:5173")
public class MentorAssignmentController {

    private final MentorAssignmentService service;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public MentorAssignmentController(
            MentorAssignmentService service) {

        this.service = service;
    }


    // =====================================================
    // GET ALL ASSIGNMENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<MentorAssignmentResponseDTO>>
    getAllAssignments() {

        return ResponseEntity.ok(
                service.getAllAssignments()
        );
    }


    // =====================================================
    // GET ASSIGNMENT BY DATABASE ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<MentorAssignmentResponseDTO>
    getAssignmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getAssignmentById(id)
        );
    }


    // =====================================================
    // CREATE ASSIGNMENT
    // =====================================================

    @PostMapping
    public ResponseEntity<MentorAssignmentResponseDTO>
    createAssignment(
            @RequestBody MentorAssignmentRequestDTO request) {

        MentorAssignmentResponseDTO response =
                service.createAssignment(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // ASSIGN MENTOR
    // =====================================================

    @PutMapping("/{id}/assign/{facultyId}")
    public ResponseEntity<MentorAssignmentResponseDTO>
    assignMentor(
            @PathVariable Long id,
            @PathVariable Long facultyId) {

        MentorAssignmentResponseDTO response =
                service.assignMentor(
                        id,
                        facultyId
                );

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // DELETE ASSIGNMENT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteAssignment(
            @PathVariable Long id) {

        service.deleteAssignment(id);

        return ResponseEntity
                .noContent()
                .build();
    }


    // =====================================================
    // GET ALL FACULTY
    // =====================================================

    @GetMapping("/faculty")
    public ResponseEntity<List<Faculty>>
    getAllFaculty() {

        return ResponseEntity.ok(
                service.getAllFaculty()
        );
    }
}