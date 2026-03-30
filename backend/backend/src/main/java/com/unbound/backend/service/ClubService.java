package com.unbound.backend.service;

import com.unbound.backend.dto.request.ClubRequest;
import com.unbound.backend.dto.request.ClubStatusRequest;
import com.unbound.backend.dto.response.ClubResponse;
import com.unbound.backend.entity.Club;
import com.unbound.backend.entity.User;
import com.unbound.backend.enums.ClubStatus;
import com.unbound.backend.enums.Role;
import com.unbound.backend.exception.BadRequestException;
import com.unbound.backend.exception.ResourceNotFoundException;
import com.unbound.backend.repository.ClubRepository;
import com.unbound.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;
    private final UserService userService;

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

    public ClubResponse createClub(ClubRequest request) {
        User currentUser = userService.getCurrentUser();

        if (clubRepository.existsByCreatedBy(currentUser)) {
            throw new BadRequestException("You have already registered a club. Each admin can manage only one club.");
        }
        if (clubRepository.existsByName(request.getName())) {
            throw new BadRequestException("A club with this name already exists");
        }
        if (clubRepository.existsByContactEmail(request.getContactEmail())) {
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

        return toResponse(clubRepository.save(club));
    }

    public ClubResponse updateClub(Long id, ClubRequest request) {
        User currentUser = userService.getCurrentUser();
        Club club = getActiveClubById(id);

        if (!club.getCreatedBy().getId().equals(currentUser.getId())
                && currentUser.getRole() != Role.COLLEGE_ADMIN
                && currentUser.getRole() != Role.SUPER_ADMIN) {
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

        return toResponse(clubRepository.save(club));
    }

    // ─── Public operations ───────────────────────────────────────────────────────

    public List<ClubResponse> getAllApprovedClubs() {
        return clubRepository.findAllByStatusAndIsActiveTrue(ClubStatus.APPROVED)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ClubResponse getClubById(Long id) {
        return toResponse(getActiveClubById(id));
    }

    // ─── Admin operations ────────────────────────────────────────────────────────

    public List<ClubResponse> getAllClubsForAdmin() {
        return clubRepository.findAllByIsActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ClubResponse approveClub(Long id) {
        Club club = getActiveClubById(id);
        if (club.getStatus() == ClubStatus.APPROVED) {
            throw new BadRequestException("Club is already approved");
        }
        club.setStatus(ClubStatus.APPROVED);
        club.setRejectionReason(null);
        return toResponse(clubRepository.save(club));
    }

    public ClubResponse rejectClub(Long id, ClubStatusRequest request) {
        Club club = getActiveClubById(id);
        if (club.getStatus() == ClubStatus.REJECTED) {
            throw new BadRequestException("Club is already rejected");
        }
        if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
            throw new BadRequestException("Rejection reason is required");
        }
        club.setStatus(ClubStatus.REJECTED);
        club.setRejectionReason(request.getRejectionReason());
        return toResponse(clubRepository.save(club));
    }

    public void deleteClub(Long id) {
        Club club = getActiveClubById(id);
        club.setActive(false);
        clubRepository.save(club);
    }
}
