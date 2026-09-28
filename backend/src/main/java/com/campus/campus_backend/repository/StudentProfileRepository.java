package com.campus.campus_backend.repository;

import com.campus.campus_backend.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile,Integer> {
    StudentProfile findByStudentId(Integer studentId);
}