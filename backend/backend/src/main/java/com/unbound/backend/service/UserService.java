package com.unbound.backend.service;

import com.unbound.backend.dto.request.UpdateProfileRequest;
import com.unbound.backend.dto.response.UserResponse;
import com.unbound.backend.entity.User;
import com.unbound.backend.exception.BadRequestException;
import com.unbound.backend.exception.ResourceNotFoundException;
import com.unbound.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Get currently authenticated user from SecurityContext
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    // Map entity → DTO
    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .college(user.getCollege() != null ? user.getCollege().getName() : null)
                .department(user.getDepartment())
                .role(user.getRole())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    // GET /api/users/me
    public UserResponse getMyProfile() {
        return toResponse(getCurrentUser());
    }

    // PUT /api/users/me
    public UserResponse updateMyProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (request.getPhone() != null
                && !request.getPhone().equals(user.getPhone())
                && userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number already in use");
        }

        if (request.getName() != null)       user.setName(request.getName());
        if (request.getPhone() != null)      user.setPhone(request.getPhone());
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());

        return toResponse(userRepository.save(user));
    }

    // GET /api/users/{id} — ADMIN only
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toResponse(user);
    }

    // GET /api/users — ADMIN only
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // DELETE /api/users/{id} — soft delete, ADMIN only
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (!user.isActive()) {
            throw new BadRequestException("User is already deactivated");
        }
        user.setActive(false);
        userRepository.save(user);
    }
}
