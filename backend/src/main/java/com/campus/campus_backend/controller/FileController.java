package com.campus.campus_backend.controller;

import com.campus.campus_backend.entity.FinalSubmission;
import com.campus.campus_backend.entity.SubmitProposal;
import com.campus.campus_backend.entity.WeeklyProgress;
import com.campus.campus_backend.repository.FinalSubmissionRepository;
import com.campus.campus_backend.repository.SubmitProposalRepository;
import com.campus.campus_backend.repository.WeeklyProgressRepository;
import com.campus.campus_backend.service.FacultyAuthorizationService;
import com.campus.campus_backend.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URLConnection;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    private final FileStorageService fileStorageService;
    private final FacultyAuthorizationService facultyAuthorizationService;
    private final SubmitProposalRepository submitProposalRepository;
    private final FinalSubmissionRepository finalSubmissionRepository;
    private final WeeklyProgressRepository weeklyProgressRepository;

    public FileController(
            FileStorageService fileStorageService,
            FacultyAuthorizationService facultyAuthorizationService,
            SubmitProposalRepository submitProposalRepository,
            FinalSubmissionRepository finalSubmissionRepository,
            WeeklyProgressRepository weeklyProgressRepository
    ) {
        this.fileStorageService = fileStorageService;
        this.facultyAuthorizationService = facultyAuthorizationService;
        this.submitProposalRepository = submitProposalRepository;
        this.finalSubmissionRepository = finalSubmissionRepository;
        this.weeklyProgressRepository = weeklyProgressRepository;
    }

    /**
     * Resolve the owning Student ID for a given file path.
     */
    private Integer findStudentIdForFile(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) return null;

        // Check proposal files
        for (SubmitProposal p : submitProposalRepository.findAll()) {
            if (p.getProposalFile() != null && (p.getProposalFile().equals(filePath) || filePath.endsWith(p.getProposalFile()) || p.getProposalFile().endsWith(filePath))) {
                if (p.getStudent() != null) return p.getStudent().getId();
            }
        }

        // Check final submissions
        for (FinalSubmission fs : finalSubmissionRepository.findAll()) {
            if ((fs.getFinalReportFile() != null && (fs.getFinalReportFile().equals(filePath) || filePath.endsWith(fs.getFinalReportFile())))
                    || (fs.getSourceCodeFile() != null && (fs.getSourceCodeFile().equals(filePath) || filePath.endsWith(fs.getSourceCodeFile())))
                    || (fs.getDatabaseFile() != null && (fs.getDatabaseFile().equals(filePath) || filePath.endsWith(fs.getDatabaseFile())))) {
                if (fs.getStudent() != null) return fs.getStudent().getId();
            }
        }

        // Check weekly progress files
        for (WeeklyProgress wp : weeklyProgressRepository.findAll()) {
            if (wp.getFileName() != null && (wp.getFileName().equals(filePath) || filePath.endsWith(wp.getFileName()))) {
                if (wp.getStudent() != null) return wp.getStudent().getId();
            }
        }

        return null;
    }

    /**
     * Validate authorization to access a file.
     */
    private void checkFileAuthorization(String filePath, Long facultyId, String facultyName, Integer requesterStudentId, Integer explicitStudentId) {
        Integer ownerStudentId = explicitStudentId != null ? explicitStudentId : findStudentIdForFile(filePath);

        if (ownerStudentId != null) {
            // If faculty request
            if (facultyId != null || (facultyName != null && !facultyName.trim().isEmpty())) {
                facultyAuthorizationService.validateFacultyAccessToStudent(ownerStudentId, facultyId, facultyName);
            }
            // If student request
            else if (requesterStudentId != null) {
                if (!ownerStudentId.equals(requesterStudentId)) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: You cannot access another student's file.");
                }
            }
        }
    }

    /**
     * View/Preview a file inline (PDF, text, image, etc.).
     */
    @GetMapping("/view")
    public ResponseEntity<Resource> viewFile(
            @RequestParam String path,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName,
            @RequestParam(required = false) Integer requesterStudentId,
            @RequestParam(required = false) Integer studentId
    ) {
        checkFileAuthorization(path, facultyId, facultyName, requesterStudentId, studentId);

        Resource resource = fileStorageService.loadFileAsResource(path);
        if (resource == null || !resource.exists()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found or unavailable on server.");
        }

        String mimeType = null;
        try {
            mimeType = URLConnection.guessContentTypeFromName(resource.getFilename());
        } catch (Exception ignored) {}

        if (mimeType == null) {
            if (path.toLowerCase().endsWith(".pdf")) {
                mimeType = "application/pdf";
            } else if (path.toLowerCase().endsWith(".sql") || path.toLowerCase().endsWith(".txt")) {
                mimeType = "text/plain";
            } else {
                mimeType = "application/octet-stream";
            }
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + Paths.get(path).getFileName().toString() + "\"")
                .body(resource);
    }

    /**
     * Download a file attachment safely.
     */
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(
            @RequestParam String path,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName,
            @RequestParam(required = false) Integer requesterStudentId,
            @RequestParam(required = false) Integer studentId
    ) {
        checkFileAuthorization(path, facultyId, facultyName, requesterStudentId, studentId);

        Resource resource = fileStorageService.loadFileAsResource(path);
        if (resource == null || !resource.exists()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found or unavailable on server.");
        }

        String filename = Paths.get(path).getFileName().toString();
        // Strip UUID prefix if present for friendly download name
        if (filename.contains("_")) {
            filename = filename.substring(filename.indexOf('_') + 1);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    /**
     * Inspect contents of a ZIP file archive (returns file/folder tree metadata).
     */
    @GetMapping("/zip-contents")
    public ResponseEntity<List<Map<String, Object>>> getZipContents(
            @RequestParam String path,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName,
            @RequestParam(required = false) Integer requesterStudentId,
            @RequestParam(required = false) Integer studentId
    ) {
        checkFileAuthorization(path, facultyId, facultyName, requesterStudentId, studentId);

        try {
            List<Map<String, Object>> contents = fileStorageService.getZipContents(path);
            return ResponseEntity.ok(contents);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to read ZIP contents: " + e.getMessage());
        }
    }

    /**
     * Read the content of a specific file inside a ZIP archive for safe preview.
     */
    @GetMapping("/zip-entry")
    public ResponseEntity<Map<String, Object>> getZipEntryContent(
            @RequestParam String path,
            @RequestParam String entryPath,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String facultyName,
            @RequestParam(required = false) Integer requesterStudentId,
            @RequestParam(required = false) Integer studentId
    ) {
        checkFileAuthorization(path, facultyId, facultyName, requesterStudentId, studentId);

        try {
            Map<String, Object> content = fileStorageService.getZipEntryContent(path, entryPath);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to read file inside ZIP: " + e.getMessage());
        }
    }
}
