package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.weekly.WeeklyProgressRequestDTO;
import com.campus.campus_backend.dto.weekly.WeeklyProgressResponseDTO;
import com.campus.campus_backend.service.WeeklyProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weekly-progress")
@CrossOrigin(origins = "http://localhost:5173")
public class WeeklyProgressController {

    @Autowired
    private WeeklyProgressService weeklyProgressService;

    // =====================================================
    // STUDENT - GET WEEKLY PROGRESS BY STUDENT ID
    // =====================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<WeeklyProgressResponseDTO>> getProgressByStudent(
            @PathVariable Integer studentId
    ) {
        return ResponseEntity.ok(
                weeklyProgressService.getProgressByStudentId(studentId)
        );
    }

    // =====================================================
    // STUDENT - SUBMIT WEEKLY PROGRESS (MULTIPART WITH FILE)
    // =====================================================

    @PostMapping(value = "/submit", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitProgressMultipart(
            @RequestParam("studentId") Integer studentId,
            @RequestParam("week") String week,
            @RequestParam(value = "projectTitle", required = false) String projectTitle,
            @RequestParam("progressTitle") String progressTitle,
            @RequestParam("workCompleted") String workCompleted,
            @RequestParam("status") String status,
            @RequestParam("percentage") Integer percentage,
            @RequestParam(value = "challenges", required = false) String challenges,
            @RequestParam(value = "nextPlan", required = false) String nextPlan,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file
    ) {
        try {
            WeeklyProgressResponseDTO response = weeklyProgressService.submitProgressMultipart(
                    studentId, week, projectTitle, progressTitle, workCompleted, status, percentage, challenges, nextPlan, file
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Error processing submission."));
        }
    }

    // =====================================================
    // STUDENT - SUBMIT WEEKLY PROGRESS (JSON FALLBACK)
    // =====================================================

    @PostMapping(value = "/submit", consumes = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> submitProgressJson(
            @RequestBody WeeklyProgressRequestDTO requestDTO) {
        try {
            WeeklyProgressResponseDTO response =
                    weeklyProgressService.submitProgress(requestDTO);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Error processing submission."));
        }
    }

    // =====================================================
    // FACULTY - GET ALL WEEKLY PROGRESS (SCOPED)
    // =====================================================

    @GetMapping
    public ResponseEntity<List<WeeklyProgressResponseDTO>> getAllProgress(
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        return ResponseEntity.ok(
                weeklyProgressService.getAllProgress(facultyId, facultyName)
        );
    }

    // =====================================================
    // FACULTY - UPDATE STATUS
    // =====================================================

    @PutMapping("/{progressId}/status")
    public ResponseEntity<WeeklyProgressResponseDTO> updateStatus(
            @PathVariable Integer progressId,
            @RequestBody Map<String, String> request,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        String status = request.get("status");

        return ResponseEntity.ok(
                weeklyProgressService.updateStatus(
                        progressId,
                        status,
                        facultyId,
                        facultyName
                )
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        String msg = ex.getMessage();
        if (msg == null || msg.trim().isEmpty()) {
            msg = "An error occurred: " + ex.getClass().getSimpleName();
        }
        return ResponseEntity.badRequest().body(Map.of("message", msg));
    }
}