package com.campus.campus_backend.repository;

import com.campus.campus_backend.entity.Student;
import com.campus.campus_backend.entity.WeeklyProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeeklyProgressRepository
        extends JpaRepository<WeeklyProgress, Integer> {

    boolean existsByStudentAndWeek(Student student, String week);

    java.util.Optional<WeeklyProgress> findByStudentAndWeek(Student student, String week);

    java.util.Optional<WeeklyProgress> findByStudentIdAndWeek(Integer studentId, String week);

    List<WeeklyProgress> findByStudentId(Integer studentId);

    long countByStudentId(Integer studentId);
}