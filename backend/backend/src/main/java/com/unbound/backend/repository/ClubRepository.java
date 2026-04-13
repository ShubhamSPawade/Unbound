package com.unbound.backend.repository;

import com.unbound.backend.entity.Club;
import com.unbound.backend.entity.College;
import com.unbound.backend.entity.User;
import com.unbound.backend.enums.ClubStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    boolean existsByCreatedBy(User createdBy);
    Optional<Club> findByCreatedBy(User createdBy);
    boolean existsByName(String name);
    boolean existsByContactEmail(String contactEmail);

    // Optimized queries with JOIN FETCH
    @Query("SELECT c FROM Club c " +
           "LEFT JOIN FETCH c.college col " +
           "LEFT JOIN FETCH c.createdBy u " +
           "WHERE c.status = :status AND c.isActive = true " +
           "ORDER BY c.createdAt DESC")
    List<Club> findAllByStatusAndIsActiveTrueWithRelations(@Param("status") ClubStatus status);

    @Query("SELECT c FROM Club c " +
           "LEFT JOIN FETCH c.college col " +
           "LEFT JOIN FETCH c.createdBy u " +
           "WHERE c.isActive = true")
    List<Club> findAllByIsActiveTrueWithRelations();

    @Query("SELECT c FROM Club c " +
           "LEFT JOIN FETCH c.college col " +
           "LEFT JOIN FETCH c.createdBy u " +
           "WHERE c.id = :clubId AND c.isActive = true")
    Optional<Club> findByIdWithRelations(@Param("clubId") Long clubId);

    // Original methods for backward compatibility
    List<Club> findAllByStatusAndIsActiveTrue(ClubStatus status);
    List<Club> findAllByIsActiveTrue();

    // Enhanced queries for approval system
    List<Club> findAllByStatusAndIsActiveTrueOrderByCreatedAtDesc(ClubStatus status);
    List<Club> findAllByCollegeAndStatusAndIsActiveTrue(College college, ClubStatus status);
    int countByStatus(ClubStatus status);
    int countByCollegeAndStatus(College college, ClubStatus status);

    // Optimized filter with JOIN FETCH
    @Query("SELECT c FROM Club c " +
           "LEFT JOIN FETCH c.college col " +
           "LEFT JOIN FETCH c.createdBy u " +
           "WHERE c.isActive = true " +
           "AND (:status IS NULL OR c.status = :status) " +
           "AND (:collegeId IS NULL OR c.college.id = :collegeId) " +
           "ORDER BY c.createdAt DESC")
    List<Club> filterClubsOptimized(@Param("status") ClubStatus status, @Param("collegeId") Long collegeId);

    // Original filter
    @Query("SELECT c FROM Club c WHERE c.isActive = true " +
           "AND (:status IS NULL OR c.status = :status) " +
           "AND (:collegeId IS NULL OR c.college.id = :collegeId) " +
           "ORDER BY c.createdAt DESC")
    List<Club> filterClubs(@Param("status") ClubStatus status, @Param("collegeId") Long collegeId);

    // Batch operations
    @Query("SELECT c FROM Club c " +
           "LEFT JOIN FETCH c.college col " +
           "LEFT JOIN FETCH c.createdBy u " +
           "WHERE c.id IN :clubIds AND c.isActive = true")
    List<Club> findAllByIdInWithRelations(@Param("clubIds") List<Long> clubIds);
}
