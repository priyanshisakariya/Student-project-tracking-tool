package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.studentAdminDTO.StudentDTO;
import com.campus.campus_backend.service.StudentAdminService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studentAdminControls")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentAdminController {

    private final StudentAdminService studentAdminService;

    public StudentAdminController(
            StudentAdminService studentAdminService
    ) {
        this.studentAdminService = studentAdminService;
    }

    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    @GetMapping("/all")
    public ResponseEntity<List<StudentDTO>> getAllStudents() {

        return ResponseEntity.ok(
                studentAdminService.getAllStudents()
        );
    }

    // =========================================================
    // GET STUDENT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(
            @PathVariable Integer id
    ) {

        return ResponseEntity.ok(
                studentAdminService.getStudentById(id)
        );
    }

    // =========================================================
    // UPDATE PROJECT + STATUS ONLY
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(
            @PathVariable Integer id,
            @RequestBody StudentDTO studentDTO
    ) {

        return ResponseEntity.ok(
                studentAdminService.updateStudent(
                        id,
                        studentDTO
                )
        );
    }

    // =========================================================
    // DELETE STUDENT
    // =========================================================

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Integer id
    ) {

        studentAdminService.deleteStudent(id);

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // SEARCH / FILTER STUDENTS
    // =========================================================

    @GetMapping("/search")
    public ResponseEntity<List<StudentDTO>> searchStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String project
    ) {

        return ResponseEntity.ok(
                studentAdminService.searchStudents(
                        search,
                        status,
                        project
                )
        );
    }
}
