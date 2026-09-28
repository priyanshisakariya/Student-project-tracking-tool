package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.studentmarks.StudentMarksResponseDTO;
import com.campus.campus_backend.entity.Marks;
import com.campus.campus_backend.entity.Student;
import com.campus.campus_backend.entity.SubmitProposal;
import com.campus.campus_backend.repository.MarksRepository;
import com.campus.campus_backend.repository.StudentRepository;
import com.campus.campus_backend.repository.SubmitProposalRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentMarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final SubmitProposalRepository submitProposalRepository;

    public StudentMarksService(
            MarksRepository marksRepository,
            StudentRepository studentRepository,
            SubmitProposalRepository submitProposalRepository
    ) {
        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
        this.submitProposalRepository = submitProposalRepository;
    }

    public StudentMarksResponseDTO getStudentMarks(Integer studentId) {
        if (studentId == null) {
            return null;
        }

        // 1. Direct marks lookup for this student
        Marks marks = marksRepository.findMarksByStudentId(studentId).orElse(null);

        // 2. Fallback: Check if student is a team member in a group proposal
        if (marks == null) {
            Student student = studentRepository.findById(studentId).orElse(null);
            if (student != null) {
                SubmitProposal proposal = submitProposalRepository.findFirstByStudentIdOrderByProposalIdDesc(studentId).orElse(null);
                if (proposal == null && student.getEnrollmentNo() != null && !student.getEnrollmentNo().trim().isEmpty()) {
                    String enroll = student.getEnrollmentNo().trim();
                    proposal = submitProposalRepository.findFirstByMember2EnrollmentOrderByProposalIdDesc(enroll)
                            .orElseGet(() -> submitProposalRepository.findFirstByMember3EnrollmentOrderByProposalIdDesc(enroll).orElse(null));
                }

                if (proposal != null) {
                    if (proposal.getProposalId() != null) {
                        marks = marksRepository.findTopByProposalIdOrderByMarksIdDesc(proposal.getProposalId()).orElse(null);
                    }
                    if (marks == null && proposal.getStudent() != null) {
                        marks = marksRepository.findMarksByStudentId(proposal.getStudent().getId()).orElse(null);
                    }
                }
            }
        }

        if (marks == null) {
            return null;
        }

        return convertToResponse(marks);
    }

    private StudentMarksResponseDTO convertToResponse(Marks marks) {

        StudentMarksResponseDTO response =
                new StudentMarksResponseDTO();

        response.setMarksId(
                marks.getMarksId()
        );

        if (marks.getStudent() != null) {
            response.setStudentId(
                    marks.getStudent().getId()
            );
        }

        response.setProposalMarks(
                marks.getProposalMarks()
        );

        response.setWeeklyProgressMarks(
                marks.getWeeklyProgressMarks()
        );

        response.setFinalReportMarks(
                marks.getFinalReportMarks()
        );

        response.setPresentationVivaMarks(
                marks.getPresentationVivaMarks()
        );

        response.setSourceCodeMarks(
                marks.getSourceCodeMarks()
        );

        response.setTotalMarks(
                marks.getTotalMarks()
        );

        response.setPercentage(
                marks.getPercentage()
        );

        response.setGrade(
                marks.getGrade()
        );

        response.setResult(
                marks.getResult()
        );

        response.setStrengths(
                marks.getStrengths()
        );

        response.setAreasForImprovement(
                marks.getAreasForImprovement()
        );

        response.setOverallComments(
                marks.getOverallComments()
        );

        return response;
    }
}