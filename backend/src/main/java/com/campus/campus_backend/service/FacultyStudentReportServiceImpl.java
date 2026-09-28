package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.report.FacultyStudentReportResponseDTO;
import com.campus.campus_backend.entity.MentorAssignment;
import com.campus.campus_backend.entity.SubmitProposal;
import com.campus.campus_backend.repository.MentorAssignmentRepository;
import com.campus.campus_backend.repository.SubmitProposalRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class FacultyStudentReportServiceImpl
        implements FacultyStudentReportService {

    private final SubmitProposalRepository submitProposalRepository;

    private final MentorAssignmentRepository mentorAssignmentRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public FacultyStudentReportServiceImpl(
            SubmitProposalRepository submitProposalRepository,
            MentorAssignmentRepository mentorAssignmentRepository
    ) {

        this.submitProposalRepository =
                submitProposalRepository;

        this.mentorAssignmentRepository =
                mentorAssignmentRepository;
    }


    // =====================================================
    // GET FACULTY STUDENT ALLOCATION
    // =====================================================


    @Override
    @Transactional(readOnly = true)
    public List<FacultyStudentReportResponseDTO>
    getFacultyStudentAllocation() {

        List<SubmitProposal> proposals =
                submitProposalRepository.findAll();

        List<FacultyStudentReportResponseDTO> result =
                new ArrayList<>();

        // =====================================================
        // GROUP NUMBER
        // =====================================================

        int generatedGroupNo = 1;


        // =====================================================
        // LOOP THROUGH ALL SUBMITTED PROPOSALS
        // =====================================================

        for (SubmitProposal proposal : proposals) {

            if (proposal == null ||
                    proposal.getStudent() == null) {

                continue;
            }


            // =================================================
            // STUDENT 1
            // =================================================

            String student1Name =
                    proposal.getStudent().getFullName();

            String student1Enrollment =
                    proposal.getStudent().getEnrollmentNo();


            // =================================================
            // STUDENT 2
            // =================================================

            String student2Name =
                    proposal.getMember2Name();

            String student2Enrollment =
                    proposal.getMember2Enrollment();


            // =================================================
            // STUDENT 3
            // =================================================

            String student3Name =
                    proposal.getMember3Name();

            String student3Enrollment =
                    proposal.getMember3Enrollment();


            // =================================================
            // FACULTY GUIDE
            // =================================================

            String facultyGuide =
                    "Not Assigned";


            // =================================================
            // CHECK MENTOR ASSIGNMENT
            // =================================================

            MentorAssignment assignment =
                    mentorAssignmentRepository
                            .findByStudent_Id(
                                    proposal.getStudent().getId()
                            )
                            .stream()
                            .findFirst()
                            .orElse(null);

            if (assignment == null && proposal.getProposalId() != null) {
                assignment = mentorAssignmentRepository
                        .findByGroupNumber(proposal.getProposalId())
                        .orElse(null);
                if (assignment != null && assignment.getStudent() == null) {
                    assignment.setStudent(proposal.getStudent());
                    mentorAssignmentRepository.save(assignment);
                }
            }


            // =================================================
            // IF MENTOR ASSIGNMENT EXISTS
            // =================================================

            if (assignment != null) {

                /*
                 * If a mentor has actually been assigned,
                 * use the faculty assigned through
                 * MentorAssignment.
                 */

                if (assignment.getMentor() != null &&
                        !assignment.getMentor().trim().isEmpty()) {

                    facultyGuide =
                            assignment.getMentor();
                }
            }


            // =================================================
            // CREATE RESPONSE
            // =================================================

            FacultyStudentReportResponseDTO response =
                    new FacultyStudentReportResponseDTO(

                            generatedGroupNo,

                            student1Enrollment,
                            student1Name,

                            student2Enrollment,
                            student2Name,

                            student3Enrollment,
                            student3Name,

                            facultyGuide
                    );


            result.add(response);


            // =================================================
            // NEXT GROUP
            // =================================================

            generatedGroupNo++;
        }


        return result;
    }
}