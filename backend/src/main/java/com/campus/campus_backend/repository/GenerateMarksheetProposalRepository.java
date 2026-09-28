package com.campus.campus_backend.repository;

import com.campus.campus_backend.entity.SubmitProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenerateMarksheetProposalRepository
        extends JpaRepository<SubmitProposal, Integer> {

    @Query("""
        SELECT p
        FROM SubmitProposal p
        JOIN FETCH p.student s
        WHERE s.id = :studentId
    """)
    Optional<SubmitProposal> findProposalByStudentId(
            @Param("studentId") Integer studentId
    );
}