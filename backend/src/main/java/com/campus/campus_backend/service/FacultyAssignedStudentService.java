package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.facultyAssignedStudentDTO.FacultyAssignedStudentDTO;

import java.util.List;

public interface FacultyAssignedStudentService {

    List<FacultyAssignedStudentDTO> getAssignedStudents(
            String facultyName
    );

    List<FacultyAssignedStudentDTO> getAssignedStudents(
            Long facultyId,
            String facultyName
    );
}
