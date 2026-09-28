package com.campus.campus_backend.repository;

import com.campus.campus_backend.entity.WeeklyReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WeeklyReviewRepository
        extends JpaRepository<WeeklyReview, Integer> {

    Optional<WeeklyReview> findByProgressId(
            Integer progressId
    );
}