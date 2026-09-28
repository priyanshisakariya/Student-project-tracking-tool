package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.Faculty.FacultyLoginRequest;
import com.campus.campus_backend.dto.Faculty.FacultyRegistrationRequest;
import com.campus.campus_backend.dto.Faculty.FacultyResponse;
import com.campus.campus_backend.service.FacultyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.campus.campus_backend.dto.dashboard.FacultyDashboardDTO;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyService facultyService;


    public FacultyController(
            FacultyService facultyService
    ) {
        this.facultyService = facultyService;
    }


    // ============================
    // FACULTY REGISTRATION
    // ============================

    @PostMapping("/register")
    public ResponseEntity<?> registerFaculty(
            @Valid @RequestBody FacultyRegistrationRequest request
    ) {

        try {

            FacultyResponse response =
                    facultyService.registerFaculty(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


    // ============================
    // FACULTY LOGIN
    // ============================

    @PostMapping("/login")
    public ResponseEntity<?> loginFaculty(
            @Valid @RequestBody FacultyLoginRequest request
    ) {

        try {

            FacultyResponse response =
                    facultyService.loginFaculty(request);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    // ============================
    // GET FACULTY BY ID
    // ============================

    @GetMapping("/{id}")
    public ResponseEntity<?> getFacultyById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(facultyService.getFacultyById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ============================
    // GET FACULTY DASHBOARD BY ID
    // ============================

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<FacultyDashboardDTO> getFacultyDashboardById(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getFacultyDashboard(id, null));
    }

    // ============================
    // GET FACULTY DASHBOARD BY NAME / QUERY
    // ============================

    @GetMapping("/dashboard")
    public ResponseEntity<FacultyDashboardDTO> getFacultyDashboardByName(
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String name
    ) {
        return ResponseEntity.ok(facultyService.getFacultyDashboard(facultyId, name));
    }
}