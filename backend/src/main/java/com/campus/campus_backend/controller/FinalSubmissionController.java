package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.finalsubmission.FinalSubmissionRequestDTO;
import com.campus.campus_backend.dto.finalsubmission.FinalSubmissionResponseDTO;
import com.campus.campus_backend.service.FacultyAuthorizationService;
import com.campus.campus_backend.service.FinalSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/final-submission")
@CrossOrigin(origins = "http://localhost:5173")
public class FinalSubmissionController {

    @Autowired
    private FinalSubmissionService finalSubmissionService;

    @Autowired
    private FacultyAuthorizationService facultyAuthorizationService;

    // =====================================================
    // SUBMIT FINAL PROJECT (MULTIPART FORM DATA)
    // =====================================================

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FinalSubmissionResponseDTO> submitFinalProjectMultipart(
            @RequestParam("studentId") Integer studentId,
            @RequestParam("projectTitle") String projectTitle,
            @RequestParam("projectDomain") String projectDomain,
            @RequestParam("technologiesUsed") String technologiesUsed,
            @RequestParam("githubRepository") String githubRepository,
            @RequestParam(value = "liveProjectUrl", required = false) String liveProjectUrl,
            @RequestParam(value = "demoVideoUrl", required = false) String demoVideoUrl,
            @RequestParam(value = "finalReportFile", required = false) MultipartFile finalReportFile,
            @RequestParam(value = "sourceCodeFile", required = false) MultipartFile sourceCodeFile,
            @RequestParam(value = "databaseFile", required = false) MultipartFile databaseFile,
            @RequestParam("declaration") Boolean declaration
    ) {
        FinalSubmissionResponseDTO response = finalSubmissionService.submitFinalProjectMultipart(
                studentId,
                projectTitle,
                projectDomain,
                technologiesUsed,
                githubRepository,
                liveProjectUrl,
                demoVideoUrl,
                finalReportFile,
                sourceCodeFile,
                databaseFile,
                declaration
        );
        return ResponseEntity.ok(response);
    }

    // =====================================================
    // SUBMIT FINAL PROJECT (JSON FALLBACK)
    // =====================================================

    @PostMapping(value = "/submit", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FinalSubmissionResponseDTO> submitFinalProject(
            @RequestBody FinalSubmissionRequestDTO requestDTO
    ) {
        FinalSubmissionResponseDTO response = finalSubmissionService.submitFinalProject(requestDTO);
        return ResponseEntity.ok(response);
    }

    // =====================================================
    // GET FINAL SUBMISSION BY STUDENT ID
    // =====================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getFinalSubmissionByStudent(
            @PathVariable Integer studentId,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName,
            @RequestParam(required = false) Integer requesterStudentId
    ) {
        // Faculty check: must be assigned to student
        if (facultyId != null || (facultyName != null && !facultyName.trim().isEmpty())) {
            facultyAuthorizationService.validateFacultyAccessToStudent(studentId, facultyId, facultyName);
        } else if (requesterStudentId != null && !requesterStudentId.equals(studentId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied.");
        }

        FinalSubmissionResponseDTO submission = finalSubmissionService.getFinalSubmissionByStudent(studentId);
        if (submission == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Final submission not found for this student."));
        }
        return ResponseEntity.ok(submission);
    }

    // =====================================================
    // GET ALL FINAL SUBMISSIONS (FACULTY-SCOPED / FALLBACK)
    // =====================================================

    @GetMapping
    public ResponseEntity<List<FinalSubmissionResponseDTO>> getAllFinalSubmissions(
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        return ResponseEntity.ok(
                finalSubmissionService.getAllFinalSubmissions(facultyId, facultyName)
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}