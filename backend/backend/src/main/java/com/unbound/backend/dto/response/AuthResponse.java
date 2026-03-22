package com.unbound.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.unbound.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
}
