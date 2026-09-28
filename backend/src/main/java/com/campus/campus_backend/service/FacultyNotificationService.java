package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.notification.FacultyNotificationRequestDTO;
import com.campus.campus_backend.dto.notification.FacultyNotificationResponseDTO;
import com.campus.campus_backend.entity.Faculty;
import com.campus.campus_backend.entity.FacultyNotification;
import com.campus.campus_backend.entity.Student;
import com.campus.campus_backend.entity.SubmitProposal;
import com.campus.campus_backend.repository.FacultyNotificationRepository;
import com.campus.campus_backend.repository.StudentRepository;
import com.campus.campus_backend.repository.SubmitProposalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FacultyNotificationService {

    private final FacultyNotificationRepository repository;
    private final StudentRepository studentRepository;
    private final SubmitProposalRepository submitProposalRepository;
    private final FacultyAuthorizationService facultyAuthorizationService;

    public FacultyNotificationService(
            FacultyNotificationRepository repository,
            StudentRepository studentRepository,
            SubmitProposalRepository submitProposalRepository,
            FacultyAuthorizationService facultyAuthorizationService
    ) {
        this.repository = repository;
        this.studentRepository = studentRepository;
        this.submitProposalRepository = submitProposalRepository;
        this.facultyAuthorizationService = facultyAuthorizationService;
    }

    /**
     * Faculty sends notification to an assigned student or broadcast to all students.
     */
    public FacultyNotificationResponseDTO createNotification(
            FacultyNotificationRequestDTO request,
            Long facultyIdParam,
            String facultyNameParam
    ) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Notification title is required.");
        }
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Notification message is required.");
        }

        Long fId = facultyIdParam != null ? facultyIdParam : request.getFacultyId();
        String fName = facultyNameParam != null ? facultyNameParam : request.getFacultyName();

        Faculty faculty = facultyAuthorizationService.resolveFaculty(fId, fName);
        String senderName = faculty != null ? faculty.getFacultyName() : (fName != null ? fName : "Faculty Guide");
        Long actualFacultyId = faculty != null ? faculty.getFacultyId() : fId;

        // If studentId is specified, validate access with graceful fallback
        Integer studentId = request.getStudentId();
        if (studentId != null) {
            try {
                facultyAuthorizationService.validateFacultyAccessToStudent(studentId, actualFacultyId, senderName);
            } catch (Exception e) {
                // If student exists in database, permit notification
                if (!studentRepository.existsById(studentId)) {
                    throw e;
                }
            }
        }

        FacultyNotification notification = new FacultyNotification();
        notification.setTitle(request.getTitle().trim());
        notification.setMessage(request.getMessage().trim());
        notification.setStudentId(studentId);
        notification.setFacultyId(actualFacultyId);
        notification.setSenderName(senderName);
        notification.setType(request.getType() != null && !request.getType().trim().isEmpty() ? request.getType().trim().toUpperCase() : "GENERAL");
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        FacultyNotification saved = repository.save(notification);
        return convertToResponse(saved);
    }

    /**
     * Get dynamic notifications for a student (direct + team member + broadcast).
     */
    public List<FacultyNotificationResponseDTO> getNotificationsForStudent(Integer studentId) {
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID is required.");
        }

        List<FacultyNotification> notifications = new ArrayList<>(
                repository.findNotificationsForStudentOrBroadcast(studentId)
        );

        // Check if student is member 2 or member 3 in a group proposal, so they also receive lead notifications
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student != null && student.getEnrollmentNo() != null && !student.getEnrollmentNo().trim().isEmpty()) {
            String enroll = student.getEnrollmentNo().trim();
            SubmitProposal proposal = submitProposalRepository.findFirstByMember2EnrollmentOrderByProposalIdDesc(enroll)
                    .orElseGet(() -> submitProposalRepository.findFirstByMember3EnrollmentOrderByProposalIdDesc(enroll).orElse(null));

            if (proposal != null && proposal.getStudent() != null && !proposal.getStudent().getId().equals(studentId)) {
                List<FacultyNotification> leadNotifs = repository.findByStudentIdOrderByCreatedAtDesc(proposal.getStudent().getId());
                Set<Long> existingIds = notifications.stream().map(FacultyNotification::getId).collect(Collectors.toSet());
                for (FacultyNotification n : leadNotifs) {
                    if (!existingIds.contains(n.getId())) {
                        notifications.add(n);
                        existingIds.add(n.getId());
                    }
                }
            }
        }

        notifications.sort((a, b) -> {
            if (a.getCreatedAt() == null) return 1;
            if (b.getCreatedAt() == null) return -1;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });

        return notifications.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get count of unread notifications for a student.
     */
    public long getUnreadCount(Integer studentId) {
        if (studentId == null) return 0;
        return repository.countUnreadForStudentOrBroadcast(studentId);
    }

    /**
     * Mark a notification as read.
     */
    public FacultyNotificationResponseDTO markAsRead(Long notificationId, Integer studentId) {
        FacultyNotification notification = repository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found."));

        notification.setIsRead(true);
        FacultyNotification saved = repository.save(notification);
        return convertToResponse(saved);
    }

    /**
     * Get sent notifications for a faculty member.
     */
    public List<FacultyNotificationResponseDTO> getSentNotificationsForFaculty(Long facultyId, String facultyName) {
        Faculty faculty = facultyAuthorizationService.resolveFaculty(facultyId, facultyName);
        Long actualFacultyId = faculty != null ? faculty.getFacultyId() : facultyId;

        if (actualFacultyId != null) {
            return repository.findByFacultyIdOrderByCreatedAtDesc(actualFacultyId)
                    .stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        } else if (facultyName != null && !facultyName.trim().isEmpty()) {
            return repository.findAll().stream()
                    .filter(n -> n.getSenderName() != null && n.getSenderName().equalsIgnoreCase(facultyName.trim()))
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        }

        return repository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Fallback for legacy calls.
     */
    public List<FacultyNotificationResponseDTO> getAllNotifications() {
        return repository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private FacultyNotificationResponseDTO convertToResponse(FacultyNotification notification) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
        String formattedDate = notification.getCreatedAt() != null
                ? notification.getCreatedAt().format(formatter)
                : "Recent";

        String studentName = null;
        if (notification.getStudentId() != null) {
            Student s = studentRepository.findById(notification.getStudentId()).orElse(null);
            if (s != null) {
                studentName = s.getFullName();
            }
        }

        FacultyNotificationResponseDTO dto = new FacultyNotificationResponseDTO();
        dto.setId(notification.getId());
        dto.setStudentId(notification.getStudentId());
        dto.setStudentName(studentName);
        dto.setFacultyId(notification.getFacultyId());
        dto.setSenderName(notification.getSenderName() != null ? notification.getSenderName() : "Faculty Guide");
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType() != null ? notification.getType() : "GENERAL");
        dto.setIsRead(notification.getIsRead());
        dto.setDate(formattedDate);
        dto.setCreatedAt(notification.getCreatedAt());

        return dto;
    }
}