package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.mentor.MentorAssignmentRequestDTO;
import com.campus.campus_backend.dto.mentor.MentorAssignmentResponseDTO;
import com.campus.campus_backend.entity.Faculty;

import java.util.List;

public interface MentorAssignmentService {

    List<MentorAssignmentResponseDTO> getAllAssignments();

    MentorAssignmentResponseDTO getAssignmentById(Long id);

    MentorAssignmentResponseDTO createAssignment(
            MentorAssignmentRequestDTO request
    );

    MentorAssignmentResponseDTO assignMentor(
            Long id,
            Long facultyId
    );

    void deleteAssignment(Long id);

    List<Faculty> getAllFaculty();
}