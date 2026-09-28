package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.facultyAssignedStudentDTO.FacultyAssignedStudentDTO;
import com.campus.campus_backend.entity.Faculty;
import com.campus.campus_backend.entity.MentorAssignment;
import com.campus.campus_backend.entity.Student;
import com.campus.campus_backend.entity.SubmitProposal;
import com.campus.campus_backend.repository.FinalSubmissionRepository;
import com.campus.campus_backend.repository.MentorAssignmentRepository;
import com.campus.campus_backend.repository.StudentRepository;
import com.campus.campus_backend.repository.SubmitProposalRepository;
import com.campus.campus_backend.repository.WeeklyProgressRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class FacultyAssignedStudentServiceImpl
        implements FacultyAssignedStudentService {

    private final MentorAssignmentRepository mentorAssignmentRepository;
    private final SubmitProposalRepository submitProposalRepository;
    private final StudentRepository studentRepository;
    private final FacultyAuthorizationService facultyAuthorizationService;
    private final WeeklyProgressRepository weeklyProgressRepository;
    private final FinalSubmissionRepository finalSubmissionRepository;

    public FacultyAssignedStudentServiceImpl(
            MentorAssignmentRepository mentorAssignmentRepository,
            SubmitProposalRepository submitProposalRepository,
            StudentRepository studentRepository,
            FacultyAuthorizationService facultyAuthorizationService,
            WeeklyProgressRepository weeklyProgressRepository,
            FinalSubmissionRepository finalSubmissionRepository
    ) {
        this.mentorAssignmentRepository = mentorAssignmentRepository;
        this.submitProposalRepository = submitProposalRepository;
        this.studentRepository = studentRepository;
        this.facultyAuthorizationService = facultyAuthorizationService;
        this.weeklyProgressRepository = weeklyProgressRepository;
        this.finalSubmissionRepository = finalSubmissionRepository;
    }

    @Override
    public List<FacultyAssignedStudentDTO> getAssignedStudents(String facultyName) {
        return getAssignedStudents(null, facultyName);
    }

    @Override
    public List<FacultyAssignedStudentDTO> getAssignedStudents(Long facultyId, String facultyName) {
        Faculty faculty = facultyAuthorizationService.resolveFaculty(facultyId, facultyName);
        String name = faculty != null ? faculty.getFacultyName() : facultyName;

        if (name == null || name.trim().isEmpty()) {
            return new ArrayList<>();
        }

        List<MentorAssignment> assignments =
                mentorAssignmentRepository.findAllByMentorIgnoreCase(name.trim());

        List<FacultyAssignedStudentDTO> result = new ArrayList<>();
        Set<Integer> addedStudentIds = new HashSet<>();

        for (MentorAssignment assignment : assignments) {
            Student student1 = assignment.getStudent();
            SubmitProposal proposal = null;

            if (student1 == null) {
                if (assignment.getGroupNumber() != null) {
                    proposal = submitProposalRepository.findById(assignment.getGroupNumber()).orElse(null);
                }
                if (proposal == null && assignment.getProject() != null) {
                    proposal = submitProposalRepository.findByProjectTitle(assignment.getProject()).orElse(null);
                }
                if (proposal != null && proposal.getStudent() != null) {
                    student1 = proposal.getStudent();
                    assignment.setStudent(student1);
                    mentorAssignmentRepository.save(assignment);
                }
            } else {
                proposal = submitProposalRepository.findByStudentId(student1.getId()).orElse(null);
            }

            if (student1 == null) {
                continue;
            }

            if (proposal == null) {
                if (assignment.getGroupNumber() != null) {
                    proposal = submitProposalRepository.findById(assignment.getGroupNumber()).orElse(null);
                }
                if (proposal == null && assignment.getProject() != null) {
                    proposal = submitProposalRepository.findByProjectTitle(assignment.getProject()).orElse(null);
                }
            }

            String project = (proposal != null && proposal.getProjectTitle() != null)
                    ? proposal.getProjectTitle()
                    : (assignment.getProject() != null ? assignment.getProject() : "N/A");

            String status = (proposal != null && proposal.getStatus() != null && !proposal.getStatus().trim().isEmpty())
                    ? proposal.getStatus()
                    : (assignment.getStatus() != null ? assignment.getStatus() : "Active");

            if (student1.getId() != null && !addedStudentIds.contains(student1.getId())) {
                addedStudentIds.add(student1.getId());
                result.add(createDTO(student1, project, status, proposal));
            }

            if (proposal != null && proposal.getMember2Enrollment() != null && !proposal.getMember2Enrollment().trim().isEmpty()) {
                Student student2 = studentRepository.findByEnrollmentNo(proposal.getMember2Enrollment().trim()).orElse(null);
                if (student2 != null && !addedStudentIds.contains(student2.getId())) {
                    addedStudentIds.add(student2.getId());
                    result.add(createDTO(student2, project, status, proposal));
                }
            }

            if (proposal != null && proposal.getMember3Enrollment() != null && !proposal.getMember3Enrollment().trim().isEmpty()) {
                Student student3 = studentRepository.findByEnrollmentNo(proposal.getMember3Enrollment().trim()).orElse(null);
                if (student3 != null && !addedStudentIds.contains(student3.getId())) {
                    addedStudentIds.add(student3.getId());
                    result.add(createDTO(student3, project, status, proposal));
                }
            }
        }

        // Graceful Fallback: If no explicit assignments exist for this faculty yet,
        // display all students who submitted proposals or final projects
        if (result.isEmpty()) {
            List<SubmitProposal> allProposals = submitProposalRepository.findAll();
            for (SubmitProposal proposal : allProposals) {
                Student s = proposal.getStudent();
                if (s != null && s.getId() != null && !addedStudentIds.contains(s.getId())) {
                    addedStudentIds.add(s.getId());
                    String project = proposal.getProjectTitle() != null ? proposal.getProjectTitle() : "Project";
                    String status = proposal.getStatus() != null ? proposal.getStatus() : "Active";
                    result.add(createDTO(s, project, status, proposal));
                }

                if (proposal.getMember2Enrollment() != null && !proposal.getMember2Enrollment().trim().isEmpty()) {
                    Student student2 = studentRepository.findByEnrollmentNo(proposal.getMember2Enrollment().trim()).orElse(null);
                    if (student2 != null && !addedStudentIds.contains(student2.getId())) {
                        addedStudentIds.add(student2.getId());
                        result.add(createDTO(student2, proposal.getProjectTitle(), proposal.getStatus(), proposal));
                    }
                }

                if (proposal.getMember3Enrollment() != null && !proposal.getMember3Enrollment().trim().isEmpty()) {
                    Student student3 = studentRepository.findByEnrollmentNo(proposal.getMember3Enrollment().trim()).orElse(null);
                    if (student3 != null && !addedStudentIds.contains(student3.getId())) {
                        addedStudentIds.add(student3.getId());
                        result.add(createDTO(student3, proposal.getProjectTitle(), proposal.getStatus(), proposal));
                    }
                }
            }
        }

        return result;
    }

    private FacultyAssignedStudentDTO createDTO(
            Student student,
            String project,
            String status,
            SubmitProposal proposal
    ) {
        int progress = calculateStudentProgress(student.getId(), proposal);
        return new FacultyAssignedStudentDTO(
                student.getId(),
                student.getFullName(),
                student.getEnrollmentNo(),
                student.getDepartment(),
                project,
                progress,
                status
        );
    }

    private int calculateStudentProgress(Integer studentId, SubmitProposal proposal) {
        if (studentId == null) return 0;
        int progress = 0;
        if (proposal != null) {
            progress += 20; // Proposal submitted
            if ("APPROVED".equalsIgnoreCase(proposal.getStatus())) {
                progress += 10; // Proposal approved
            }
        }
        long weeklyCount = weeklyProgressRepository.countByStudentId(studentId);
        progress += Math.min(5, (int) weeklyCount) * 10; // Up to 50% for weekly progress reports

        if (finalSubmissionRepository.existsByStudentId(studentId)) {
            progress += 20; // Final project submitted
        }
        return Math.min(100, progress);
    }
}