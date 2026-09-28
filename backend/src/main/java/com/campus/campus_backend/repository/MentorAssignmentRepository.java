package com.campus.campus_backend.repository;

import com.campus.campus_backend.entity.MentorAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorAssignmentRepository
        extends JpaRepository<MentorAssignment, Long> {

    Optional<MentorAssignment> findByGroupNumber(
            Integer groupNumber
    );

    boolean existsByGroupNumber(
            Integer groupNumber
    );

    List<MentorAssignment> findByStudent_Id(
            Integer studentId
    );

    List<MentorAssignment> findAllByMentorIgnoreCase(
            String mentor
    );

    Optional<MentorAssignment> findFirstByProject(
            String project
    );
}