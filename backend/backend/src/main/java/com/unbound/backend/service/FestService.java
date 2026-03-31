package com.unbound.backend.service;

import com.unbound.backend.dto.request.FestRequest;
import com.unbound.backend.dto.response.FestResponse;
import com.unbound.backend.entity.College;
import com.unbound.backend.entity.Fest;
import com.unbound.backend.exception.BadRequestException;
import com.unbound.backend.exception.ResourceNotFoundException;
import com.unbound.backend.repository.CollegeRepository;
import com.unbound.backend.repository.FestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FestService {

    private final FestRepository festRepository;
    private final CollegeRepository collegeRepository;

    private FestResponse toResponse(Fest fest) {
        return FestResponse.builder()
                .id(fest.getId())
                .name(fest.getName())
                .description(fest.getDescription())
                .bannerUrl(fest.getBannerUrl())
                .startDate(fest.getStartDate())
                .endDate(fest.getEndDate())
                .collegeId(fest.getCollege().getId())
                .collegeName(fest.getCollege().getName())
                .createdAt(fest.getCreatedAt())
                .build();
    }

    private College getCollege(Long collegeId) {
        return collegeRepository.findById(collegeId)
                .orElseThrow(() -> new ResourceNotFoundException("College not found with id: " + collegeId));
    }

    // POST /api/fests
    public FestResponse createFest(FestRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        College college = getCollege(request.getCollegeId());

        if (festRepository.existsByNameAndCollege(request.getName(), college)) {
            throw new BadRequestException("A fest with this name already exists for this college");
        }

        Fest fest = Fest.builder()
                .name(request.getName())
                .description(request.getDescription())
                .bannerUrl(request.getBannerUrl())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .college(college)
                .build();

        return toResponse(festRepository.save(fest));
    }

    // GET /api/fests
    public List<FestResponse> getAllFests() {
        return festRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // GET /api/fests/{id}
    public FestResponse getFestById(Long id) {
        return toResponse(festRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fest not found with id: " + id)));
    }

    // GET /api/fests/college/{collegeId}
    public List<FestResponse> getFestsByCollege(Long collegeId) {
        College college = getCollege(collegeId);
        return festRepository.findAllByCollege(college)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // PUT /api/fests/{id}
    public FestResponse updateFest(Long id, FestRequest request) {
        Fest fest = festRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fest not found with id: " + id));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        College college = getCollege(request.getCollegeId());

        if (!fest.getName().equals(request.getName())
                && festRepository.existsByNameAndCollege(request.getName(), college)) {
            throw new BadRequestException("A fest with this name already exists for this college");
        }

        fest.setName(request.getName());
        fest.setDescription(request.getDescription());
        fest.setBannerUrl(request.getBannerUrl());
        fest.setStartDate(request.getStartDate());
        fest.setEndDate(request.getEndDate());
        fest.setCollege(college);

        return toResponse(festRepository.save(fest));
    }

    // DELETE /api/fests/{id}
    public void deleteFest(Long id) {
        Fest fest = festRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fest not found with id: " + id));
        festRepository.delete(fest);
    }
}
