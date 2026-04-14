package com.unbound.backend.service;

import com.unbound.backend.dto.request.BulkClubActionRequest;
import com.unbound.backend.dto.request.ClubRequest;
import com.unbound.backend.dto.request.ClubStatusRequest;
import com.unbound.backend.dto.response.BulkActionResponse;
import com.unbound.backend.dto.response.ClubResponse;
import com.unbound.backend.dto.response.ClubStatisticsResponse;
import com.unbound.backend.entity.Club;
import com.unbound.backend.entity.User;
import com.unbound.backend.enums.ClubStatus;
import com.unbound.backend.enums.Role;
import com.unbound.backend.exception.BadRequestException;
import com.unbound.backend.exception.ResourceNotFoundException;
import com.unbound.backend.repository.ClubRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClubService {

    private final ClubRepository clubRepository;
    private final UserService userService;
    private final EmailService emailService;

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private ClubResponse toResponse(Club club) {
        return ClubResponse.builder()
                .id(club.getId())
                .name(club.getName())
                .description(club.getDescription())
                .logoUrl(club.getLogoUrl())
                .category(club.getCategory())
                .contactEmail(club.getContactEmail())
                .status(club.getStatus())
                .rejectionReason(club.getRejectionReason())
                .isActive(club.isActive())
                .collegeName(club.getCollege() != null ? club.getCollege().getName() : null)
                .ownerId(club.getCreatedBy().getId())
                .ownerName(club.getCreatedBy().getName())
                .ownerEmail(club.getCreatedBy().getEmail())
                .createdAt(club.getCreatedAt())
                .updatedAt(club.getUpdatedAt())
                .build();
    }

    private Club getActiveClubById(Long id) {
        return clubRepository.findById(id)
                .filter(Club::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + id));
    }

    // ─── CLUB_ADMIN operations ───────────────────────────────────────────────────

    @Transactional
    public ClubResponse createClub(ClubRequest request) {
        User currentUser = userService.getCurrentUser();

        log.info("User {} attempting to create club: {}", currentUser.getId(), request.getName());

        if (clubRepository.existsByCreatedBy(currentUser)) {
            log.warn("User {} already has a registered club", currentUser.getId());
            throw new BadRequestException("You have already registered a club. Each admin can manage only one club.");
        }
        if (clubRepository.existsByName(request.getName())) {
            log.warn("Club name already exists: {}", request.getName());
            throw new BadRequestException("A club with this name already exists");
        }
        if (clubRepository.existsByContactEmail(request.getContactEmail())) {
            log.warn("Club contact email already exists: {}", request.getContactEmail());
            throw new BadRequestException("A club with this contact email already exists");
        }

        Club club = Club.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .category(request.getCategory())
                .contactEmail(request.getContactEmail())
                .college(currentUser.getCollege())
                .status(ClubStatus.PENDING)
                .createdBy(currentUser)
                .isActive(true)
                .build();

        Club savedClub = clubRepository.save(club);
        log.info("Club created successfully. ID: {}, Name: {}, Status: PENDING", 
                savedClub.getId(), savedClub.getName());

        return toResponse(savedClub);
    }

    @Transactional
    public ClubResponse updateClub(Long id, ClubRequest request) {
        User currentUser = userService.getCurrentUser();
        Club club = getActiveClubById(id);

        log.info("User {} attempting to update club {}", currentUser.getId(), id);

        if (!club.getCreatedBy().getId().equals(currentUser.getId())
                && currentUser.getRole() != Role.COLLEGE_ADMIN
                && currentUser.getRole() != Role.SUPER_ADMIN) {
            log.warn("Unauthorized update attempt by user {} for club {}", currentUser.getId(), id);
            throw new BadRequestException("You are not authorized to edit this club");
        }
        if (!club.getName().equals(request.getName()) && clubRepository.existsByName(request.getName())) {
            throw new BadRequestException("A club with this name already exists");
        }
        if (!club.getContactEmail().equals(request.getContactEmail())
                && clubRepository.existsByContactEmail(request.getContactEmail())) {
            throw new BadRequestException("A club with this contact email already exists");
        }

        club.setName(request.getName());
        club.setDescription(request.getDescription());
        club.setLogoUrl(request.getLogoUrl());
        club.setCategory(request.getCategory());
        club.setContactEmail(request.getContactEmail());

        Club updatedClub = clubRepository.save(club);
        log.info("Club {} updated successfully", id);

        return toResponse(updatedClub);
    }

    // ─── Public operations ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ClubResponse> getAllApprovedClubs() {
        return clubRepository.findAllByStatusAndIsActiveTrueOrderByCreatedAtDesc(ClubStatus.APPROVED)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClubResponse getClubById(Long id) {
        return toResponse(getActiveClubById(id));
    }

    // ─── Admin operations ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ClubResponse> getAllClubsForAdmin() {
        return clubRepository.findAllByIsActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClubResponse> getClubsByStatus(ClubStatus status) {
        log.info("Fetching clubs with status: {}", status);
        return clubRepository.findAllByStatusAndIsActiveTrueOrderByCreatedAtDesc(status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClubResponse> filterClubs(ClubStatus status, Long collegeId) {
        log.info("Filtering clubs - Status: {}, CollegeId: {}", status, collegeId);
        return clubRepository.filterClubs(status, collegeId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClubStatisticsResponse getClubStatistics() {
        User currentUser = userService.getCurrentUser();
        
        int total = clubRepository.findAllByIsActiveTrue().size();
        int pending = clubRepository.countByStatus(ClubStatus.PENDING);
        int approved = clubRepository.countByStatus(ClubStatus.APPROVED);
        int rejected = clubRepository.countByStatus(ClubStatus.REJECTED);

        log.info("Club statistics - Total: {}, Pending: {}, Approved: {}, Rejected: {}", 
                total, pending, approved, rejected);

        return ClubStatisticsResponse.builder()
                .totalClubs(total)
                .pendingClubs(pending)
                .approvedClubs(approved)
                .rejectedClubs(rejected)
                .activeClubs(total)
                .build();
    }

    @Transactional
    public ClubResponse approveClub(Long id) {
        Club club = getActiveClubById(id);
        
        log.info("Approving club: {} (ID: {})", club.getName(), id);

        if (club.getStatus() == ClubStatus.APPROVED) {
            log.warn("Club {} is already approved", id);
            throw new BadRequestException("Club is already approved");
        }
        
        club.setStatus(ClubStatus.APPROVED);
        club.setRejectionReason(null);
        Club updatedClub = clubRepository.save(club);
        
        log.info("Club {} approved successfully", id);

        try {
            emailService.sendClubApprovalNotification(
                    updatedClub.getCreatedBy().getEmail(),
                    updatedClub.getCreatedBy().getName(),
                    updatedClub.getName());
        } catch (Exception ex) {
            log.error("Club approval email failed for club {}", updatedClub.getId(), ex);
        }
        
        return toResponse(updatedClub);
    }

    @Transactional
    public ClubResponse rejectClub(Long id, ClubStatusRequest request) {
        Club club = getActiveClubById(id);
        
        log.info("Rejecting club: {} (ID: {})", club.getName(), id);

        if (club.getStatus() == ClubStatus.REJECTED) {
            log.warn("Club {} is already rejected", id);
            throw new BadRequestException("Club is already rejected");
        }
        if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
            throw new BadRequestException("Rejection reason is required");
        }
        
        club.setStatus(ClubStatus.REJECTED);
        club.setRejectionReason(request.getRejectionReason());
        Club updatedClub = clubRepository.save(club);
        
        log.info("Club {} rejected with reason: {}", id, request.getRejectionReason());

        try {
            emailService.sendClubRejectionNotification(
                    updatedClub.getCreatedBy().getEmail(),
                    updatedClub.getCreatedBy().getName(),
                    updatedClub.getName(),
                    updatedClub.getRejectionReason());
        } catch (Exception ex) {
            log.error("Club rejection email failed for club {}", updatedClub.getId(), ex);
        }
        
        return toResponse(updatedClub);
    }

    @Transactional
    public BulkActionResponse bulkApproveOrReject(BulkClubActionRequest request) {
        log.info("Bulk {} action for {} clubs", request.getAction(), request.getClubIds().size());

        List<Long> successfulIds = new ArrayList<>();
        List<Long> failedIds = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (Long clubId : request.getClubIds()) {
            try {
                Club club = getActiveClubById(clubId);

                if (request.getAction() == BulkClubActionRequest.BulkAction.APPROVE) {
                    if (club.getStatus() != ClubStatus.APPROVED) {
                        club.setStatus(ClubStatus.APPROVED);
                        club.setRejectionReason(null);
                        clubRepository.save(club);
                        
                        try {
                            emailService.sendClubApprovalNotification(
                                    club.getCreatedBy().getEmail(),
                                    club.getCreatedBy().getName(),
                                    club.getName());
                        } catch (Exception ex) {
                            log.error("Email notification failed for club {}", clubId, ex);
                        }
                        
                        successfulIds.add(clubId);
                        log.info("Club {} approved in bulk action", clubId);
                    } else {
                        failedIds.add(clubId);
                        errors.add("Club " + clubId + " is already approved");
                    }
                } else if (request.getAction() == BulkClubActionRequest.BulkAction.REJECT) {
                    if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                        failedIds.add(clubId);
                        errors.add("Rejection reason is required for club " + clubId);
                        continue;
                    }
                    
                    if (club.getStatus() != ClubStatus.REJECTED) {
                        club.setStatus(ClubStatus.REJECTED);
                        club.setRejectionReason(request.getRejectionReason());
                        clubRepository.save(club);
                        
                        try {
                            emailService.sendClubRejectionNotification(
                                    club.getCreatedBy().getEmail(),
                                    club.getCreatedBy().getName(),
                                    club.getName(),
                                    club.getRejectionReason());
                        } catch (Exception ex) {
                            log.error("Email notification failed for club {}", clubId, ex);
                        }
                        
                        successfulIds.add(clubId);
                        log.info("Club {} rejected in bulk action", clubId);
                    } else {
                        failedIds.add(clubId);
                        errors.add("Club " + clubId + " is already rejected");
                    }
                }
            } catch (Exception e) {
                failedIds.add(clubId);
                errors.add("Club " + clubId + ": " + e.getMessage());
                log.error("Bulk action failed for club {}", clubId, e);
            }
        }

        log.info("Bulk action completed - Success: {}, Failed: {}", 
                successfulIds.size(), failedIds.size());

        return BulkActionResponse.builder()
                .successCount(successfulIds.size())
                .failureCount(failedIds.size())
                .successfulIds(successfulIds)
                .failedIds(failedIds)
                .errors(errors)
                .build();
    }

    @Transactional
    public void deleteClub(Long id) {
        Club club = getActiveClubById(id);
        log.info("Soft deleting club: {} (ID: {})", club.getName(), id);
        club.setActive(false);
        clubRepository.save(club);
        log.info("Club {} deactivated successfully", id);
    }
}
