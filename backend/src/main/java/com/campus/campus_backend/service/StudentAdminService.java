package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.studentAdminDTO.StudentDTO;

import java.util.List;

public interface StudentAdminService {

    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    List<StudentDTO> getAllStudents();

    // =========================================================
    // GET STUDENT BY ID
    // =========================================================

    StudentDTO getStudentById(Integer id);

    // =========================================================
    // UPDATE PROJECT + STATUS ONLY
    // =========================================================

    StudentDTO updateStudent(
            Integer id,
            StudentDTO studentDTO
    );

    // =========================================================
    // DELETE STUDENT
    // =========================================================

    void deleteStudent(Integer id);

    // =========================================================
    // SEARCH / FILTER
    // =========================================================

    List<StudentDTO> searchStudents(
            String search,
            String status,
            String project
    );
}