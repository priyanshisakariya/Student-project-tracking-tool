package com.campus.campus_backend.repository;

import com.campus.campus_backend.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Integer> {

    Optional<Marks> findTopByStudent_IdOrderByMarksIdDesc(Integer studentId);

    List<Marks> findAllByStudent_IdOrderByMarksIdDesc(Integer studentId);

    Optional<Marks> findTopByProposalIdOrderByMarksIdDesc(Integer proposalId);

    default Optional<Marks> findMarksByStudentId(Integer studentId) {
        return findTopByStudent_IdOrderByMarksIdDesc(studentId);
    }
}