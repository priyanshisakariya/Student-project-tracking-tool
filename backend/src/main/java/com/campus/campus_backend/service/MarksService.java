package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.marks.MarksRequestDTO;
import com.campus.campus_backend.dto.marks.MarksResponseDTO;
import com.campus.campus_backend.dto.marks.MarksStudentResponseDTO;

import java.util.List;

public interface MarksService {

    List<MarksStudentResponseDTO> getStudentsForMarks();

    List<MarksStudentResponseDTO> getStudentsForMarks(Long facultyId, String facultyName);

    MarksResponseDTO getMarksByStudentId(Integer studentId);

    MarksResponseDTO getMarksByStudentId(Integer studentId, Long facultyId, String facultyName);

    MarksResponseDTO saveMarks(MarksRequestDTO requestDTO);

    MarksResponseDTO saveMarks(MarksRequestDTO requestDTO, Long facultyId, String facultyName);
}