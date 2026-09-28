package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.Faculty.FacultyLoginRequest;
import com.campus.campus_backend.dto.Faculty.FacultyRegistrationRequest;
import com.campus.campus_backend.dto.Faculty.FacultyResponse;
import com.campus.campus_backend.dto.dashboard.FacultyDashboardDTO;
import com.campus.campus_backend.entity.Faculty;
import com.campus.campus_backend.entity.FacultyNotification;
import com.campus.campus_backend.entity.MentorAssignment;
import com.campus.campus_backend.entity.Student;
import com.campus.campus_backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final MentorAssignmentRepository mentorAssignmentRepository;
    private final SubmitProposalRepository submitProposalRepository;
    private final WeeklyProgressRepository weeklyProgressRepository;
    private final FinalSubmissionRepository finalSubmissionRepository;
    private final FacultyNotificationRepository facultyNotificationRepository;
    private final FacultyAuthorizationService facultyAuthorizationService;

    public FacultyService(
            FacultyRepository facultyRepository,
            MentorAssignmentRepository mentorAssignmentRepository,
            SubmitProposalRepository submitProposalRepository,
            WeeklyProgressRepository weeklyProgressRepository,
            FinalSubmissionRepository finalSubmissionRepository,
            FacultyNotificationRepository facultyNotificationRepository,
            FacultyAuthorizationService facultyAuthorizationService
    ) {
        this.facultyRepository = facultyRepository;
        this.mentorAssignmentRepository = mentorAssignmentRepository;
        this.submitProposalRepository = submitProposalRepository;
        this.weeklyProgressRepository = weeklyProgressRepository;
        this.finalSubmissionRepository = finalSubmissionRepository;
        this.facultyNotificationRepository = facultyNotificationRepository;
        this.facultyAuthorizationService = facultyAuthorizationService;
    }

    // ============================
    // FACULTY REGISTRATION
    // ============================

    public FacultyResponse registerFaculty(
            FacultyRegistrationRequest request
    ) {
        if (request == null) {
            throw new RuntimeException("Faculty registration request cannot be empty.");
        }

        if (request.getFacultyName() == null || request.getFacultyName().trim().length() < 3) {
            throw new RuntimeException("Faculty name must be at least 3 characters long.");
        }

        if (request.getPhoneNumber() == null || !request.getPhoneNumber().trim().matches("^\\d{10}$")) {
            throw new RuntimeException("Faculty phone number must be exactly 10 digits.");
        }

        if (facultyRepository.existsByPhoneNumber(request.getPhoneNumber().trim())) {
            throw new RuntimeException("Faculty with this phone number already exists");
        }

        Faculty faculty = new Faculty();
        faculty.setFacultyName(request.getFacultyName());
        faculty.setPhoneNumber(request.getPhoneNumber());
        faculty.setDesignation(request.getDesignation());
        faculty.setDepartment(request.getDepartment());
        faculty.setPassword(request.getPhoneNumber());

        Faculty savedFaculty = facultyRepository.save(faculty);
        return new FacultyResponse(savedFaculty);
    }

    // ============================
    // FACULTY LOGIN
    // ============================

    public FacultyResponse loginFaculty(
            FacultyLoginRequest request
    ) {
        Faculty faculty = facultyRepository
                .findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        boolean passwordMatches = request.getPassword().equals(faculty.getPassword());
        if (!passwordMatches) {
            throw new RuntimeException("Invalid phone number or password");
        }

        return new FacultyResponse(faculty);
    }

    // ============================
    // GET FACULTY BY ID
    // ============================

    public FacultyResponse getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found with id: " + id));
        return new FacultyResponse(faculty);
    }

    // ============================
    // GET FACULTY DASHBOARD (SCOPED)
    // ============================

    public FacultyDashboardDTO getFacultyDashboard(Long facultyId, String nameParam) {
        Faculty faculty = facultyAuthorizationService.resolveFaculty(facultyId, nameParam);
        String name = faculty != null ? faculty.getFacultyName() : (nameParam != null ? nameParam : "Faculty");
        Long actualFacultyId = faculty != null ? faculty.getFacultyId() : facultyId;

        FacultyDashboardDTO dto = new FacultyDashboardDTO();
        dto.setFacultyName(name);

        Set<Integer> assignedStudentIds = facultyAuthorizationService.getAssignedStudentIds(actualFacultyId, name);

        List<MentorAssignment> assignments = (name != null && !name.trim().isEmpty())
                ? mentorAssignmentRepository.findAllByMentorIgnoreCase(name.trim())
                : new ArrayList<>();

        dto.setAssignedStudentsCount(assignedStudentIds.size());

        List<FacultyDashboardDTO.StudentProgress> studentList = new ArrayList<>();
        List<FacultyDashboardDTO.Activity> activityList = new ArrayList<>();

        int weeklyReviewsCount = 0;
        int pendingPropsCount = 0;

        for (MentorAssignment assignment : assignments) {
            Student student = assignment.getStudent();
            Integer sId = student != null ? student.getId() : null;
            String studentName = student != null ? student.getFullName() : (assignment.getProject() != null ? assignment.getProject() : "Group " + assignment.getGroupNumber());

            int progress = 0;
            if (sId != null) {
                var proposalOpt = submitProposalRepository.findFirstByStudentIdOrderByProposalIdDesc(sId);
                if (proposalOpt.isPresent()) {
                    progress += 20;
                    String status = proposalOpt.get().getStatus();
                    if (status == null || status.trim().isEmpty() || status.equalsIgnoreCase("Pending") || status.equalsIgnoreCase("PENDING")) {
                        pendingPropsCount++;
                    }
                }

                long weeklyCount = weeklyProgressRepository.countByStudentId(sId);
                weeklyReviewsCount += (int) weeklyCount;
                progress += Math.min(6, (int) weeklyCount) * 10;

                boolean finalSub = finalSubmissionRepository.existsByStudentId(sId);
                if (finalSub) progress += 20;
            } else {
                progress = 50;
            }

            studentList.add(new FacultyDashboardDTO.StudentProgress(sId, studentName, Math.min(100, progress)));
        }

        dto.setPendingProposalsCount(pendingPropsCount);
        dto.setWeeklyReviewsCount(weeklyReviewsCount);

        // Notifications sent by this faculty
        List<FacultyNotification> notifs = actualFacultyId != null
                ? facultyNotificationRepository.findByFacultyIdOrderByCreatedAtDesc(actualFacultyId)
                : facultyNotificationRepository.findAll();

        dto.setNotificationsCount(notifs.size());
        List<FacultyDashboardDTO.Notice> noticesList = notifs.stream()
                .limit(5)
                .map(n -> new FacultyDashboardDTO.Notice(n.getId(), n.getMessage()))
                .collect(Collectors.toList());
        dto.setNotices(noticesList);

        // Activities scoped to assigned students only
        submitProposalRepository.findAll().stream()
                .filter(p -> p.getStudent() != null && assignedStudentIds.contains(p.getStudent().getId()))
                .limit(3)
                .forEach(p -> {
                    String sName = p.getStudent() != null ? p.getStudent().getFullName() : "Student";
                    activityList.add(new FacultyDashboardDTO.Activity("prop-" + p.getProposalId(), "📄", sName + " submitted proposal for '" + p.getProjectTitle() + "'"));
                });

        weeklyProgressRepository.findAll().stream()
                .filter(w -> w.getStudent() != null && assignedStudentIds.contains(w.getStudent().getId()))
                .limit(3)
                .forEach(w -> {
                    String sName = w.getStudent() != null ? w.getStudent().getFullName() : "Student";
                    activityList.add(new FacultyDashboardDTO.Activity("prog-" + w.getProgressId(), "📝", sName + " submitted " + (w.getWeek() != null ? w.getWeek() : "weekly") + " report"));
                });

        dto.setStudents(studentList);
        dto.setActivities(activityList);

        return dto;
    }
}