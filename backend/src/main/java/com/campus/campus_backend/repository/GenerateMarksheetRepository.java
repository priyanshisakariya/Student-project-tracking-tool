package com.campus.campus_backend.repository;

import com.campus.campus_backend.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenerateMarksheetRepository extends JpaRepository<Marks, Integer> {

    @Query("""
           SELECT m
           FROM Marks m
           JOIN FETCH m.student s
           ORDER BY s.id
           """)
    List<Marks> findAllStudentsWithMarks();

    @Query("""
           SELECT m
           FROM Marks m
           JOIN FETCH m.student s
           WHERE s.id = :studentId
           """)
    Optional<Marks> findByStudentId(
            @Param("studentId") Integer studentId
    );
}