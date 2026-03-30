package com.unbound.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClubStatusRequest {

    @Size(max = 500, message = "Rejection reason cannot exceed 500 characters")
    private String rejectionReason;
}
