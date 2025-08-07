package com.unbound.backend.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class TeamMemberInfo {
    private String name;
    private String email;
    private String phone;
    private String college;
    private String branch;
    private Integer year;
    private Boolean isRegistered;
    private Integer studentId; // null for unregistered members
} 