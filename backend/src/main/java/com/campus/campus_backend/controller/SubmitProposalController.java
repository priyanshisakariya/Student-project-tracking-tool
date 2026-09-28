package com.campus.campus_backend.controller;

import com.campus.campus_backend.dto.praporsal.ProposalRequestDTO;
import com.campus.campus_backend.dto.praporsal.ProposalResponseDTO;
import com.campus.campus_backend.service.SubmitProposalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/proposal")
@CrossOrigin(origins = "http://localhost:5173")
public class SubmitProposalController {

    @Autowired
    private SubmitProposalService submitProposalService;

    // =====================================================
    // SUBMIT PROJECT PROPOSAL (MULTIPART FORM DATA)
    // =====================================================

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProposalResponseDTO> submitProposalMultipart(
            @RequestParam("studentId") Integer studentId,
            @RequestParam("projectTitle") String projectTitle,
            @RequestParam("projectDomain") String projectDomain,
            @RequestParam("technologyStack") String technologyStack,
            @RequestParam(value = "otherTechnology", required = false) String otherTechnology,
            @RequestParam(value = "member2Name", required = false) String member2Name,
            @RequestParam(value = "member2Enrollment", required = false) String member2Enrollment,
            @RequestParam(value = "member3Name", required = false) String member3Name,
            @RequestParam(value = "member3Enrollment", required = false) String member3Enrollment,
            @RequestParam("projectDescription") String projectDescription,
            @RequestParam(value = "proposalFile", required = false) MultipartFile proposalFile
    ) {
        ProposalResponseDTO response = submitProposalService.submitProposalMultipart(
                studentId,
                projectTitle,
                projectDomain,
                technologyStack,
                otherTechnology,
                member2Name,
                member2Enrollment,
                member3Name,
                member3Enrollment,
                projectDescription,
                proposalFile
        );
        return ResponseEntity.ok(response);
    }

    // =====================================================
    // SUBMIT PROJECT PROPOSAL (JSON FALLBACK)
    // =====================================================

    @PostMapping(value = "/submit", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProposalResponseDTO> submitProposalJson(
            @RequestBody ProposalRequestDTO requestDTO
    ) {
        ProposalResponseDTO response = submitProposalService.submitProposal(requestDTO);
        return ResponseEntity.ok(response);
    }

    // =====================================================
    // GET PROPOSAL BY STUDENT
    // =====================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ProposalResponseDTO> getProposalByStudent(
            @PathVariable Integer studentId
    ) {
        return ResponseEntity.ok(submitProposalService.getProposalByStudent(studentId));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        String msg = ex.getMessage();
        if (msg == null || msg.trim().isEmpty()) {
            msg = "An error occurred: " + ex.getClass().getSimpleName();
        }
        response.put("message", msg);
        return ResponseEntity.badRequest().body(response);
    }
}