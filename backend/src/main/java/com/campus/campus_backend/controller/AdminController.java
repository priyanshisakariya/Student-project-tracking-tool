package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.adminLogin.*;
import com.campus.campus_backend.service.AdminService;
import com.campus.campus_backend.dto.dashboard.AdminDashboardDTO;
import com.campus.campus_backend.entity.SubmitProposal;
import com.campus.campus_backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final SubmitProposalRepository submitProposalRepository;
    private final MentorAssignmentRepository mentorAssignmentRepository;
    private final WeeklyProgressRepository weeklyProgressRepository;

    public AdminController(
            AdminService adminService,
            StudentRepository studentRepository,
            FacultyRepository facultyRepository,
            SubmitProposalRepository submitProposalRepository,
            MentorAssignmentRepository mentorAssignmentRepository,
            WeeklyProgressRepository weeklyProgressRepository
    ) {
        this.adminService = adminService;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.submitProposalRepository = submitProposalRepository;
        this.mentorAssignmentRepository = mentorAssignmentRepository;
        this.weeklyProgressRepository = weeklyProgressRepository;
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequestDTO request) {

        return adminService.login(request);
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequestDTO request) {

        return adminService.resetPassword(request);
    }

    // =========================================================
    // DASHBOARD STATS
    // =========================================================

    @GetMapping("/dashboard-stats")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalFaculty = facultyRepository.count();
        long totalProjects = submitProposalRepository.count();

        List<SubmitProposal> allProposals = submitProposalRepository.findAll();
        long pendingApprovals = allProposals
                .stream()
                .filter(p -> p.getStatus() == null || p.getStatus().trim().isEmpty() || p.getStatus().equalsIgnoreCase("Pending"))
                .count();

        long completedProjects = allProposals
                .stream()
                .filter(p -> p.getStatus() != null && (p.getStatus().equalsIgnoreCase("Approved") || p.getStatus().equalsIgnoreCase("Completed")))
                .count();

        long inProgressProjects = Math.max(0, totalProjects - pendingApprovals - completedProjects);

        AdminDashboardDTO dto = new AdminDashboardDTO(
                totalStudents,
                totalFaculty,
                totalProjects,
                pendingApprovals
        );

        long mentorAssignedCount = mentorAssignmentRepository.count();
        long totalWeeklyProgressCount = weeklyProgressRepository.count();

        dto.setAssignedStudents(totalStudents);
        dto.setMentorAssignments(mentorAssignedCount > 0 ? mentorAssignedCount : totalProjects);
        dto.setReports(totalWeeklyProgressCount > 0 ? totalWeeklyProgressCount : totalProjects);

        List<AdminDashboardDTO.ProjectStatusItem> statusList = new ArrayList<>();
        statusList.add(new AdminDashboardDTO.ProjectStatusItem("Completed", completedProjects));
        statusList.add(new AdminDashboardDTO.ProjectStatusItem("In Progress", inProgressProjects));
        statusList.add(new AdminDashboardDTO.ProjectStatusItem("Pending", pendingApprovals));
        dto.setProjectStatusData(statusList);

        Map<String, Long> mentorMap = mentorAssignmentRepository.findAll()
                .stream()
                .filter(m -> m.getMentor() != null && !m.getMentor().trim().isEmpty())
                .collect(Collectors.groupingBy(m -> m.getMentor().trim(), Collectors.counting()));

        if (mentorMap.isEmpty()) {
            facultyRepository.findAll().forEach(f -> mentorMap.put(f.getFacultyName(), 0L));
        }

        List<AdminDashboardDTO.MentorDataItem> mentorItems = mentorMap.entrySet().stream()
                .map(e -> new AdminDashboardDTO.MentorDataItem(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        dto.setMentorData(mentorItems);

        List<AdminDashboardDTO.ReportDataItem> reportItems = new ArrayList<>();
        reportItems.add(new AdminDashboardDTO.ReportDataItem("Jan", Math.min(totalWeeklyProgressCount, 2)));
        reportItems.add(new AdminDashboardDTO.ReportDataItem("Feb", Math.min(totalWeeklyProgressCount, 5)));
        reportItems.add(new AdminDashboardDTO.ReportDataItem("Mar", Math.min(totalWeeklyProgressCount, 8)));
        reportItems.add(new AdminDashboardDTO.ReportDataItem("Apr", Math.min(totalWeeklyProgressCount, 12)));
        reportItems.add(new AdminDashboardDTO.ReportDataItem("May", Math.min(totalWeeklyProgressCount, 15)));
        reportItems.add(new AdminDashboardDTO.ReportDataItem("Jun", Math.max(totalWeeklyProgressCount, 20)));
        dto.setReportData(reportItems);

        return ResponseEntity.ok(dto);
    }
}