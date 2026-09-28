package com.campus.campus_backend.repository;

import com.campus.campus_backend.entity.FacultyNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyNotificationRepository
        extends JpaRepository<FacultyNotification, Long> {

    List<FacultyNotification> findByStudentIdOrderByCreatedAtDesc(Integer studentId);

    List<FacultyNotification> findByFacultyIdOrderByCreatedAtDesc(Long facultyId);

    long countByStudentIdAndIsReadFalse(Integer studentId);

    @Query("SELECT n FROM FacultyNotification n WHERE n.studentId = :studentId OR n.studentId IS NULL ORDER BY n.createdAt DESC")
    List<FacultyNotification> findNotificationsForStudentOrBroadcast(@Param("studentId") Integer studentId);

    @Query("SELECT COUNT(n) FROM FacultyNotification n WHERE (n.studentId = :studentId OR n.studentId IS NULL) AND (n.isRead = false OR n.isRead IS NULL)")
    long countUnreadForStudentOrBroadcast(@Param("studentId") Integer studentId);
}