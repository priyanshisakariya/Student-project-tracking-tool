package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.mentor.MentorAssignmentRequestDTO;
import com.campus.campus_backend.dto.mentor.MentorAssignmentResponseDTO;
import com.campus.campus_backend.entity.Faculty;
import com.campus.campus_backend.entity.MentorAssignment;
import com.campus.campus_backend.repository.FacultyRepository;
import com.campus.campus_backend.repository.MentorAssignmentRepository;
import com.campus.campus_backend.entity.Student;
import com.campus.campus_backend.repository.StudentRepository;


import com.campus.campus_backend.entity.SubmitProposal;
import com.campus.campus_backend.repository.SubmitProposalRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MentorAssignmentServiceImpl
        implements MentorAssignmentService {

    private final MentorAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final SubmitProposalRepository submitProposalRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public MentorAssignmentServiceImpl(
            MentorAssignmentRepository assignmentRepository,
            FacultyRepository facultyRepository,
            StudentRepository studentRepository,
            SubmitProposalRepository submitProposalRepository

    ) {

        this.assignmentRepository =
                assignmentRepository;

        this.facultyRepository =
                facultyRepository;

        this.studentRepository = studentRepository;
        this.submitProposalRepository = submitProposalRepository;
    }


    // =====================================================
    // GET ALL ASSIGNMENTS
    // =====================================================

    @Override
    public List<MentorAssignmentResponseDTO>
    getAllAssignments() {

        return assignmentRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // GET ASSIGNMENT BY ID
    // =====================================================

    @Override
    public MentorAssignmentResponseDTO
    getAssignmentById(Long id) {

        MentorAssignment assignment =
                assignmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assignment not found with id: "
                                                + id
                                )
                        );

        return convertToResponse(assignment);
    }


    // =====================================================
    // CREATE ASSIGNMENT
    // =====================================================

    @Override
    public MentorAssignmentResponseDTO
    createAssignment(
            MentorAssignmentRequestDTO request
    ) {

        // ============================================
        // STUDENT
        // ============================================

        if (request.getStudentId() == null) {
            throw new RuntimeException(
                    "Student ID is required"
            );
        }

        Student student =
                studentRepository.findById(
                        request.getStudentId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with id: "
                                        + request.getStudentId()
                        )
                );

        // -----------------------------------------------
        // GROUP NUMBER VALIDATION
        // -----------------------------------------------

        if (request.getGroupNumber() == null) {

            throw new RuntimeException(
                    "Group number is required"
            );
        }

        if (request.getGroupNumber() <= 0) {

            throw new RuntimeException(
                    "Group number must be greater than 0"
            );
        }


        // -----------------------------------------------
        // DUPLICATE GROUP NUMBER
        // -----------------------------------------------

        if (assignmentRepository
                .existsByGroupNumber(
                        request.getGroupNumber()
                )) {

            throw new RuntimeException(
                    "Group number already exists: "
                            + request.getGroupNumber()
            );
        }


        // -----------------------------------------------
        // PROJECT VALIDATION
        // -----------------------------------------------

        if (request.getProject() == null ||
                request.getProject().isBlank()) {

            throw new RuntimeException(
                    "Project is required"
            );
        }


        // -----------------------------------------------
        // CREATE ENTITY
        // -----------------------------------------------

        MentorAssignment assignment =
                new MentorAssignment();

        assignment.setStudent(student);

        assignment.setGroupNumber(
                request.getGroupNumber()
        );


        assignment.setProject(
                request.getProject().trim()
        );


        // -----------------------------------------------
        // MENTOR
        // -----------------------------------------------

        if (request.getMentor() != null) {

            assignment.setMentor(
                    request.getMentor().trim()
            );
        }


        // -----------------------------------------------
        // DEPARTMENT
        // -----------------------------------------------

        if (request.getDepartment() != null) {

            assignment.setDepartment(
                    request.getDepartment().trim()
            );
        }


        // -----------------------------------------------
        // STATUS
        // -----------------------------------------------

        if (request.getStatus() == null ||
                request.getStatus().isBlank()) {

            assignment.setStatus("Pending");

        } else {

            assignment.setStatus(
                    request.getStatus().trim()
            );
        }


        // -----------------------------------------------
        // SAVE
        // -----------------------------------------------

        MentorAssignment saved =
                assignmentRepository.save(
                        assignment
                );


        return convertToResponse(saved);
    }


    // =====================================================
    // ASSIGN MENTOR
    // =====================================================

    @Override
    public MentorAssignmentResponseDTO
    assignMentor(
            Long id,
            Long facultyId
    ) {

        // -----------------------------------------------
        // FIND ASSIGNMENT
        // -----------------------------------------------

        MentorAssignment assignment =
                assignmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assignment not found with id: "
                                                + id
                                )
                        );


        // -----------------------------------------------
        // FIND FACULTY
        // -----------------------------------------------

        Faculty faculty =
                facultyRepository
                        .findById(facultyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Faculty not found with id: "
                                                + facultyId
                                )
                        );


        // -----------------------------------------------
        // RECOVER STUDENT IF NULL
        // -----------------------------------------------

        if (assignment.getStudent() == null) {
            SubmitProposal proposal = null;
            if (assignment.getGroupNumber() != null) {
                proposal = submitProposalRepository
                        .findById(assignment.getGroupNumber())
                        .orElse(null);
            }
            if (proposal == null && assignment.getProject() != null) {
                proposal = submitProposalRepository
                        .findByProjectTitle(assignment.getProject())
                        .orElse(null);
            }
            if (proposal != null && proposal.getStudent() != null) {
                assignment.setStudent(proposal.getStudent());
            }
        }


        // -----------------------------------------------
        // ASSIGN FACULTY
        // -----------------------------------------------

        assignment.setMentor(
                faculty.getFacultyName()
        );


        assignment.setDepartment(
                faculty.getDepartment()
        );


        assignment.setStatus(
                "Assigned"
        );

        // Update corresponding SubmitProposal guideName
        SubmitProposal proposalToUpdate = null;
        if (assignment.getGroupNumber() != null) {
            proposalToUpdate = submitProposalRepository.findById(assignment.getGroupNumber()).orElse(null);
        }
        if (proposalToUpdate == null && assignment.getStudent() != null) {
            proposalToUpdate = submitProposalRepository.findFirstByStudentIdOrderByProposalIdDesc(assignment.getStudent().getId()).orElse(null);
        }
        if (proposalToUpdate == null && assignment.getProject() != null) {
            proposalToUpdate = submitProposalRepository.findByProjectTitle(assignment.getProject()).orElse(null);
        }
        if (proposalToUpdate != null) {
            proposalToUpdate.setGuideName(faculty.getFacultyName());
            submitProposalRepository.save(proposalToUpdate);
        }

        // -----------------------------------------------
        // SAVE
        // -----------------------------------------------

        MentorAssignment updated =
                assignmentRepository.save(
                        assignment
                );

        return convertToResponse(updated);
    }


    // =====================================================
    // DELETE
    // =====================================================

    @Override
    public void deleteAssignment(Long id) {

        if (!assignmentRepository
                .existsById(id)) {

            throw new RuntimeException(
                    "Assignment not found with id: "
                            + id
            );
        }


        assignmentRepository.deleteById(id);
    }


    // =====================================================
    // GET FACULTY
    // =====================================================

    @Override
    public List<Faculty> getAllFaculty() {

        return facultyRepository.findAll();
    }


    // =====================================================
    // ENTITY -> RESPONSE DTO
    // =====================================================

    private MentorAssignmentResponseDTO
    convertToResponse(
            MentorAssignment assignment
    ) {

        Student student = assignment.getStudent();
        Integer studentId = (student != null) ? student.getId() : null;
        String studentName = (student != null) ? student.getFullName() : null;

        return new MentorAssignmentResponseDTO(

                assignment.getId(),

                assignment.getGroupNumber(),

                assignment.getProject(),

                assignment.getMentor(),

                assignment.getDepartment(),

                assignment.getStatus(),

                studentId,

                studentName
        );
    }
}