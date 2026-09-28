package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.studentAdminDTO.StudentDTO;
import com.campus.campus_backend.entity.MentorAssignment;
import com.campus.campus_backend.entity.Student;
import com.campus.campus_backend.entity.SubmitProposal;
import com.campus.campus_backend.repository.MentorAssignmentRepository;
import com.campus.campus_backend.repository.StudentRepository;
import com.campus.campus_backend.repository.SubmitProposalRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentAdminServiceImpl implements StudentAdminService {

    private final StudentRepository studentRepository;
    private final SubmitProposalRepository submitProposalRepository;
    private final MentorAssignmentRepository mentorAssignmentRepository;

    public StudentAdminServiceImpl(
            StudentRepository studentRepository,
            SubmitProposalRepository submitProposalRepository,
            MentorAssignmentRepository mentorAssignmentRepository
    ) {
        this.studentRepository = studentRepository;
        this.submitProposalRepository = submitProposalRepository;
        this.mentorAssignmentRepository = mentorAssignmentRepository;
    }

    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    @Override
    public List<StudentDTO> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET STUDENT BY ID
    // =========================================================

    @Override
    public StudentDTO getStudentById(Integer id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with id: " + id
                        )
                );

        return convertToDTO(student);
    }

    // =========================================================
    // UPDATE PROJECT + STATUS ONLY
    // =========================================================

    @Override
    @Transactional
    public StudentDTO updateStudent(
            Integer id,
            StudentDTO dto
    ) {

        // ---------------------------------------------------------
        // FIND STUDENT
        // ---------------------------------------------------------

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with id: " + id
                        )
                );

        // ---------------------------------------------------------
        // FIND STUDENT'S PROPOSAL
        // ---------------------------------------------------------

        SubmitProposal proposal =
                getProposal(student.getId());

        if (proposal == null) {
            throw new RuntimeException(
                    "No proposal found for this student."
            );
        }

        // ---------------------------------------------------------
        // UPDATE PROJECT ONLY
        // ---------------------------------------------------------

        if (dto.getProject() != null) {

            String project =
                    dto.getProject().trim();

            if (!project.isEmpty()) {
                proposal.setProjectTitle(project);
            }
        }

        // ---------------------------------------------------------
        // UPDATE STATUS ONLY
        // ---------------------------------------------------------

        if (dto.getStatus() != null) {

            String status =
                    dto.getStatus().trim();

            if (!status.isEmpty()) {
                proposal.setStatus(status);
            }
        }

        // ---------------------------------------------------------
        // SAVE PROPOSAL
        // ---------------------------------------------------------

        submitProposalRepository.save(proposal);

        // ---------------------------------------------------------
        // RETURN UPDATED DATA
        // ---------------------------------------------------------

        return convertToDTO(student);
    }

    // =========================================================
    // DELETE STUDENT
    // =========================================================

    @Override
    @Transactional
    public void deleteStudent(Integer id) {

        // ---------------------------------------------------------
        // CHECK STUDENT
        // ---------------------------------------------------------

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with id: " + id
                        )
                );

        // ---------------------------------------------------------
        // DELETE PROPOSAL FIRST
        // ---------------------------------------------------------


        submitProposalRepository.deleteByStudentId( student.getId() );


        submitProposalRepository.flush();

        // ---------------------------------------------------------
        // DELETE STUDENT
        // ---------------------------------------------------------

        studentRepository.delete(student);
        studentRepository.flush();
    }

    // =========================================================
    // SEARCH / FILTER STUDENTS
    // =========================================================

    @Override
    public List<StudentDTO> searchStudents(
            String search,
            String status,
            String project
    ) {

        String searchText =
                search == null
                        ? ""
                        : search.trim().toLowerCase();

        String statusText =
                status == null
                        ? ""
                        : status.trim().toLowerCase();

        String projectText =
                project == null
                        ? ""
                        : project.trim().toLowerCase();

        return studentRepository.findAll()
                .stream()
                .filter(student -> {

                    SubmitProposal proposal =
                            getProposal(student.getId());

                    // -------------------------------------------------
                    // SEARCH
                    // -------------------------------------------------

                    boolean searchMatch = true;

                    if (!searchText.isEmpty()) {

                        searchMatch =
                                containsIgnoreCase(
                                        student.getFullName(),
                                        searchText
                                )
                                        ||
                                        containsIgnoreCase(
                                                student.getEnrollmentNo(),
                                                searchText
                                        )
                                        ||
                                        (
                                                proposal != null
                                                        &&
                                                        containsIgnoreCase(
                                                                proposal.getProjectTitle(),
                                                                searchText
                                                        )
                                        )
                                        ||
                                        (
                                                mentorAssignmentRepository
                                                        .findByStudent_Id(student.getId())
                                                        .stream()
                                                        .anyMatch(ma -> containsIgnoreCase(ma.getMentor(), searchText))
                                        );
                    }

                    // -------------------------------------------------
                    // PROJECT FILTER
                    // -------------------------------------------------

                    boolean projectMatch = true;

                    if (!projectText.isEmpty()) {

                        projectMatch =
                                proposal != null
                                        &&
                                        containsIgnoreCase(
                                                proposal.getProjectTitle(),
                                                projectText
                                        );
                    }

                    // -------------------------------------------------
                    // STATUS FILTER
                    // -------------------------------------------------

                    boolean statusMatch = true;

                    if (!statusText.isEmpty()) {

                        String studentStatus =
                                getStatus(proposal);

                        statusMatch =
                                studentStatus
                                        .toLowerCase()
                                        .equals(statusText);
                    }

                    return searchMatch
                            && projectMatch
                            && statusMatch;
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // FIND PROPOSAL
    // =========================================================

    private SubmitProposal getProposal(
            Integer studentId
    ) {

        if (studentId == null) {
            return null;
        }

        return submitProposalRepository
                .findFirstByStudentIdOrderByProposalIdDesc(studentId)
                .orElse(null);
    }

    // =========================================================
    // GET STATUS
    // =========================================================

    private String getStatus(
            SubmitProposal proposal
    ) {

        if (proposal == null) {
            return "Not Submitted";
        }

        if (proposal.getStatus() == null
                || proposal.getStatus().trim().isEmpty()) {

            return "Submitted";
        }

        return proposal.getStatus();
    }

    // =========================================================
    // CASE-INSENSITIVE SEARCH
    // =========================================================

    private boolean containsIgnoreCase(
            String value,
            String search
    ) {

        return value != null
                &&
                value.toLowerCase().contains(search);
    }

    // =========================================================
    // STUDENT ENTITY -> DTO
    // =========================================================

    private StudentDTO convertToDTO(
            Student student
    ) {

        if (student == null) {
            return null;
        }

        SubmitProposal proposal =
                getProposal(student.getId());

        String project = "-";
        String faculty = "-";
        String status = "Not Submitted";

        if (proposal != null) {

            project =
                    proposal.getProjectTitle() != null
                            ? proposal.getProjectTitle()
                            : "-";

            MentorAssignment assignment =
                    mentorAssignmentRepository.findByStudent_Id(student.getId())
                            .stream()
                            .findFirst()
                            .orElse(null);

            faculty =
                    (assignment != null && assignment.getMentor() != null)
                            ? assignment.getMentor()
                            : "Not Assigned";

            status = getStatus(proposal);
        }

        return new StudentDTO(
                student.getId() != null ? student.getId().longValue() : null,
                student.getFullName(),
                student.getEnrollmentNo(),
                project,
                faculty,
                status
        );
    }
}
