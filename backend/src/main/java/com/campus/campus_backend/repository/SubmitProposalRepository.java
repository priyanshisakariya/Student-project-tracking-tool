package com.campus.campus_backend.repository;

import com.campus.campus_backend.entity.Student;
import com.campus.campus_backend.entity.SubmitProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmitProposalRepository extends JpaRepository<SubmitProposal, Integer> {

    boolean existsByStudent(Student student);

    boolean existsByProjectTitle(String projectTitle);

    Optional<SubmitProposal> findByStudent(Student student);

    Optional<SubmitProposal> findByStudentId(Integer studentId);

    Optional<SubmitProposal> findFirstByStudentIdOrderByProposalIdDesc(Integer studentId);

    List<SubmitProposal> findAllByStudentId(Integer studentId);

    Optional<SubmitProposal> findByProjectTitle(String projectTitle);

    Optional<SubmitProposal> findFirstByMember2EnrollmentOrderByProposalIdDesc(String member2Enrollment);

    Optional<SubmitProposal> findFirstByMember3EnrollmentOrderByProposalIdDesc(String member3Enrollment);

    @Modifying
    @Query("DELETE FROM SubmitProposal p WHERE p.student.id = :studentId") void deleteByStudentId(@Param("studentId") Integer studentId );

}