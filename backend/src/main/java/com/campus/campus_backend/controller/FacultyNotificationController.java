package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.notification.FacultyNotificationRequestDTO;
import com.campus.campus_backend.dto.notification.FacultyNotificationResponseDTO;
import com.campus.campus_backend.service.FacultyNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyNotificationController {

    private final FacultyNotificationService service;

    public FacultyNotificationController(
            FacultyNotificationService service) {
        this.service = service;
    }

    // ==========================================
    // SEND / CREATE NOTIFICATION (FACULTY -> ASSIGNED STUDENT)
    // ==========================================

    @PostMapping
    public ResponseEntity<FacultyNotificationResponseDTO> createNotification(
            @RequestBody FacultyNotificationRequestDTO request,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        return ResponseEntity.ok(
                service.createNotification(request, facultyId, facultyName)
        );
    }

    // ==========================================
    // GET NOTIFICATIONS FOR A STUDENT
    // ==========================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<FacultyNotificationResponseDTO>> getStudentNotifications(
            @PathVariable Integer studentId
    ) {
        return ResponseEntity.ok(
                service.getNotificationsForStudent(studentId)
        );
    }

    // ==========================================
    // GET UNREAD COUNT FOR A STUDENT
    // ==========================================

    @GetMapping("/student/{studentId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Integer studentId
    ) {
        long count = service.getUnreadCount(studentId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    // ==========================================
    // MARK NOTIFICATION AS READ
    // ==========================================

    @PutMapping("/{id}/read")
    public ResponseEntity<FacultyNotificationResponseDTO> markAsRead(
            @PathVariable Long id,
            @RequestParam(required = false) Integer studentId
    ) {
        return ResponseEntity.ok(
                service.markAsRead(id, studentId)
        );
    }

    // ==========================================
    // GET SENT NOTIFICATIONS FOR FACULTY
    // ==========================================

    @GetMapping("/faculty")
    public ResponseEntity<List<FacultyNotificationResponseDTO>> getFacultySentNotifications(
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        return ResponseEntity.ok(
                service.getSentNotificationsForFaculty(facultyId, facultyName)
        );
    }

    // ==========================================
    // GET ALL NOTIFICATIONS (FALLBACK)
    // ==========================================

    @GetMapping
    public ResponseEntity<List<FacultyNotificationResponseDTO>> getAllNotifications(
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName
    ) {
        if (facultyId != null || (facultyName != null && !facultyName.trim().isEmpty())) {
            return ResponseEntity.ok(service.getSentNotificationsForFaculty(facultyId, facultyName));
        }
        return ResponseEntity.ok(service.getAllNotifications());
    }
}