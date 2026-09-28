package com.campus.campus_backend.repository;

import com.campus.campus_backend.entity.MentorAssignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FacultyStudentReportRepository
        extends JpaRepository<MentorAssignment, Long> {

    @Query("""
        SELECT ma
        FROM MentorAssignment ma
        JOIN FETCH ma.student s
        ORDER BY ma.groupNumber ASC
    """)
    List<MentorAssignment> findAllFacultyAllocations();
}