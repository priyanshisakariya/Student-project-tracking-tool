package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.finalsubmission.FinalSubmissionRequestDTO;
import com.campus.campus_backend.dto.finalsubmission.FinalSubmissionResponseDTO;
import com.campus.campus_backend.entity.FinalSubmission;
import com.campus.campus_backend.entity.Student;
import com.campus.campus_backend.repository.FinalSubmissionRepository;
import com.campus.campus_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FinalSubmissionService {

    @Autowired
    private FinalSubmissionRepository finalSubmissionRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private FacultyAuthorizationService facultyAuthorizationService;

    @Transactional
    public FinalSubmissionResponseDTO submitFinalProjectMultipart(
            Integer studentId,
            String projectTitle,
            String projectDomain,
            String technologiesUsed,
            String githubRepository,
            String liveProjectUrl,
            String demoVideoUrl,
            MultipartFile finalReportFile,
            MultipartFile sourceCodeFile,
            MultipartFile databaseFile,
            Boolean declaration
    ) {
        // 1. Check student
        Student student = studentRepository
                .findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        // 2. Fetch existing or create new
        FinalSubmission submission = finalSubmissionRepository.findByStudent(student).orElse(null);
        boolean isNew = (submission == null);

        // 3. Validations
        if (projectTitle == null || projectTitle.trim().isEmpty()) {
            throw new RuntimeException("Project title is required.");
        }
        if (projectDomain == null || projectDomain.trim().isEmpty()) {
            throw new RuntimeException("Project domain is required.");
        }
        if (technologiesUsed == null || technologiesUsed.trim().isEmpty()) {
            throw new RuntimeException("Technologies used are required.");
        }
        if (githubRepository == null || githubRepository.trim().isEmpty()) {
            throw new RuntimeException("GitHub repository URL is required.");
        }

        if (isNew) {
            if (finalReportFile == null || finalReportFile.isEmpty()) {
                throw new RuntimeException("Final report PDF is required.");
            }
            if (sourceCodeFile == null || sourceCodeFile.isEmpty()) {
                throw new RuntimeException("Source code ZIP is required.");
            }
            if (databaseFile == null || databaseFile.isEmpty()) {
                throw new RuntimeException("Database SQL file is required.");
            }
        } else {
            if ((finalReportFile == null || finalReportFile.isEmpty()) &&
                (submission.getFinalReportFile() == null || submission.getFinalReportFile().trim().isEmpty())) {
                throw new RuntimeException("Final report PDF is required.");
            }
            if ((sourceCodeFile == null || sourceCodeFile.isEmpty()) &&
                (submission.getSourceCodeFile() == null || submission.getSourceCodeFile().trim().isEmpty())) {
                throw new RuntimeException("Source code ZIP is required.");
            }
            if ((databaseFile == null || databaseFile.isEmpty()) &&
                (submission.getDatabaseFile() == null || submission.getDatabaseFile().trim().isEmpty())) {
                throw new RuntimeException("Database SQL file is required.");
            }
        }

        if (declaration == null || !declaration) {
            throw new RuntimeException("You must accept the declaration.");
        }

        if (isNew) {
            submission = new FinalSubmission();
            submission.setStudent(student);
        }

        // 4. Store files if provided
        if (finalReportFile != null && !finalReportFile.isEmpty()) {
            String reportPath = fileStorageService.storeFile(finalReportFile, "final-reports", "pdf");
            submission.setFinalReportFile(reportPath);
        }
        if (sourceCodeFile != null && !sourceCodeFile.isEmpty()) {
            String sourcePath = fileStorageService.storeFile(sourceCodeFile, "source-code", "zip");
            submission.setSourceCodeFile(sourcePath);
        }
        if (databaseFile != null && !databaseFile.isEmpty()) {
            String dbPath = fileStorageService.storeFile(databaseFile, "database", "sql");
            submission.setDatabaseFile(dbPath);
        }

        // 5. Update Entity
        submission.setProjectTitle(projectTitle.trim());
        submission.setProjectDomain(projectDomain.trim());
        submission.setTechnologiesUsed(technologiesUsed.trim());
        submission.setGithubRepository(githubRepository.trim());
        submission.setLiveProjectUrl(liveProjectUrl != null ? liveProjectUrl.trim() : null);
        submission.setDemoVideoUrl(demoVideoUrl != null ? demoVideoUrl.trim() : null);
        submission.setDeclaration(declaration);
        if (submission.getStatus() == null || submission.getStatus().trim().isEmpty()) {
            submission.setStatus("Submitted");
        }
        submission.setSubmissionDate(LocalDateTime.now());

        FinalSubmission saved = finalSubmissionRepository.save(submission);
        return convertToResponse(saved);
    }

    @Transactional
    public FinalSubmissionResponseDTO submitFinalProject(FinalSubmissionRequestDTO requestDTO) {
        Student student = studentRepository
                .findById(requestDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found."));

        FinalSubmission submission = finalSubmissionRepository.findByStudent(student).orElse(null);
        boolean isNew = (submission == null);
        if (isNew) {
            submission = new FinalSubmission();
            submission.setStudent(student);
        }

        if (requestDTO.getProjectTitle() == null || requestDTO.getProjectTitle().trim().isEmpty()) {
            throw new RuntimeException("Project title is required.");
        }
        if (requestDTO.getProjectDomain() == null || requestDTO.getProjectDomain().trim().isEmpty()) {
            throw new RuntimeException("Project domain is required.");
        }
        if (requestDTO.getTechnologiesUsed() == null || requestDTO.getTechnologiesUsed().trim().isEmpty()) {
            throw new RuntimeException("Technologies used are required.");
        }
        if (requestDTO.getGithubRepository() == null || requestDTO.getGithubRepository().trim().isEmpty()) {
            throw new RuntimeException("GitHub repository URL is required.");
        }
        if (requestDTO.getFinalReportFile() != null && !requestDTO.getFinalReportFile().trim().isEmpty()) {
            submission.setFinalReportFile(requestDTO.getFinalReportFile().trim());
        }
        if (requestDTO.getSourceCodeFile() != null && !requestDTO.getSourceCodeFile().trim().isEmpty()) {
            submission.setSourceCodeFile(requestDTO.getSourceCodeFile().trim());
        }
        if (requestDTO.getDatabaseFile() != null && !requestDTO.getDatabaseFile().trim().isEmpty()) {
            submission.setDatabaseFile(requestDTO.getDatabaseFile().trim());
        }
        if (requestDTO.getDeclaration() == null || !requestDTO.getDeclaration()) {
            throw new RuntimeException("You must accept the declaration.");
        }

        submission.setProjectTitle(requestDTO.getProjectTitle().trim());
        submission.setProjectDomain(requestDTO.getProjectDomain().trim());
        submission.setTechnologiesUsed(requestDTO.getTechnologiesUsed().trim());
        submission.setGithubRepository(requestDTO.getGithubRepository().trim());
        submission.setLiveProjectUrl(requestDTO.getLiveProjectUrl() == null ? null : requestDTO.getLiveProjectUrl().trim());
        submission.setDemoVideoUrl(requestDTO.getDemoVideoUrl() == null ? null : requestDTO.getDemoVideoUrl().trim());
        submission.setDeclaration(requestDTO.getDeclaration());
        if (submission.getStatus() == null || submission.getStatus().trim().isEmpty()) {
            submission.setStatus("Submitted");
        }
        submission.setSubmissionDate(LocalDateTime.now());

        FinalSubmission saved = finalSubmissionRepository.save(submission);
        return convertToResponse(saved);
    }

    public List<FinalSubmissionResponseDTO> getAllFinalSubmissions(Long facultyId, String facultyName) {
        List<FinalSubmission> list = finalSubmissionRepository.findAll();

        if (facultyId != null || (facultyName != null && !facultyName.trim().isEmpty())) {
            Set<Integer> assignedStudentIds = facultyAuthorizationService.getAssignedStudentIds(facultyId, facultyName);
            if (!assignedStudentIds.isEmpty()) {
                return list.stream()
                        .filter(f -> f.getStudent() != null && assignedStudentIds.contains(f.getStudent().getId()))
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());
            }
            // Graceful fallback when mentor allocations are not yet finalized by admin
            return list.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        }

        return list.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public FinalSubmissionResponseDTO getFinalSubmissionByStudent(Integer studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        FinalSubmission submission = finalSubmissionRepository.findByStudent(student)
                .orElse(null);

        if (submission == null) {
            return null;
        }

        return convertToResponse(submission);
    }

    private FinalSubmissionResponseDTO convertToResponse(FinalSubmission submission) {
        FinalSubmissionResponseDTO response = new FinalSubmissionResponseDTO();
        response.setSubmissionId(submission.getSubmissionId());
        if (submission.getStudent() != null) {
            response.setStudentId(submission.getStudent().getId());
            response.setStudentName(submission.getStudent().getFullName());
            response.setEnrollmentNo(submission.getStudent().getEnrollmentNo());
            response.setDepartment(submission.getStudent().getDepartment());
        }
        response.setProjectTitle(submission.getProjectTitle());
        response.setProjectDomain(submission.getProjectDomain());
        response.setTechnologiesUsed(submission.getTechnologiesUsed());
        response.setGithubRepository(submission.getGithubRepository());
        response.setLiveProjectUrl(submission.getLiveProjectUrl());
        response.setDemoVideoUrl(submission.getDemoVideoUrl());
        response.setFinalReportFile(submission.getFinalReportFile());
        response.setSourceCodeFile(submission.getSourceCodeFile());
        response.setDatabaseFile(submission.getDatabaseFile());
        response.setDeclaration(submission.getDeclaration());
        response.setStatus(submission.getStatus() != null ? submission.getStatus() : "Submitted");
        response.setSubmissionDate(submission.getSubmissionDate());
        return response;
    }
}