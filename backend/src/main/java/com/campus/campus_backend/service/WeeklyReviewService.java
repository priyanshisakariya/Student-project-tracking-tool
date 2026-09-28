package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.WeeklyReview.WeeklyReviewRequestDTO;
import com.campus.campus_backend.dto.WeeklyReview.WeeklyReviewResponseDTO;
import com.campus.campus_backend.entity.WeeklyProgress;
import com.campus.campus_backend.entity.WeeklyReview;
import com.campus.campus_backend.repository.WeeklyProgressRepository;
import com.campus.campus_backend.repository.WeeklyReviewRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class WeeklyReviewService {

    private final WeeklyReviewRepository weeklyReviewRepository;
    private final WeeklyProgressRepository weeklyProgressRepository;
    private final FacultyAuthorizationService facultyAuthorizationService;

    public WeeklyReviewService(
            WeeklyReviewRepository weeklyReviewRepository,
            WeeklyProgressRepository weeklyProgressRepository,
            FacultyAuthorizationService facultyAuthorizationService
    ) {
        this.weeklyReviewRepository = weeklyReviewRepository;
        this.weeklyProgressRepository = weeklyProgressRepository;
        this.facultyAuthorizationService = facultyAuthorizationService;
    }

    // =====================================================
    // GET REVIEW BY PROGRESS ID (WITH AUTHORIZATION)
    // =====================================================

    public WeeklyReviewResponseDTO getReviewByProgressId(
            Integer progressId,
            Long facultyId,
            String facultyName
    ) {
        if (progressId == null) {
            throw new IllegalArgumentException("Progress ID is required.");
        }

        if (facultyId != null || (facultyName != null && !facultyName.trim().isEmpty())) {
            WeeklyProgress progress = weeklyProgressRepository.findById(progressId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Weekly progress not found."));
            if (progress.getStudent() != null) {
                facultyAuthorizationService.validateFacultyAccessToStudent(progress.getStudent().getId(), facultyId, facultyName);
            }
        }

        Optional<WeeklyReview> review = weeklyReviewRepository.findByProgressId(progressId);
        if (review.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No faculty review found for this weekly progress.");
        }

        return convertToResponse(review.get());
    }

    // =====================================================
    // CREATE OR UPDATE REVIEW (WITH AUTHORIZATION)
    // =====================================================

    public WeeklyReviewResponseDTO saveReview(
            WeeklyReviewRequestDTO request,
            Long facultyId,
            String facultyName
    ) {
        if (request.getProgressId() == null) {
            throw new IllegalArgumentException("Progress ID is required.");
        }

        if (request.getFacultyFeedback() == null || request.getFacultyFeedback().trim().isEmpty()) {
            throw new IllegalArgumentException("Faculty feedback is required.");
        }

        WeeklyProgress progress = weeklyProgressRepository.findById(request.getProgressId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Weekly progress not found."));

        if (facultyId != null || (facultyName != null && !facultyName.trim().isEmpty())) {
            if (progress.getStudent() != null) {
                facultyAuthorizationService.validateFacultyAccessToStudent(progress.getStudent().getId(), facultyId, facultyName);
            }
        }

        WeeklyReview review = weeklyReviewRepository
                .findByProgressId(request.getProgressId())
                .orElseGet(WeeklyReview::new);

        review.setProgressId(request.getProgressId());
        review.setFacultyFeedback(request.getFacultyFeedback().trim());

        WeeklyReview saved = weeklyReviewRepository.save(review);
        return convertToResponse(saved);
    }

    private WeeklyReviewResponseDTO convertToResponse(WeeklyReview review) {
        WeeklyReviewResponseDTO response = new WeeklyReviewResponseDTO();
        response.setWeeklyReviewId(review.getWeeklyReviewId());
        response.setProgressId(review.getProgressId());
        response.setFacultyFeedback(review.getFacultyFeedback());
        return response;
    }
}