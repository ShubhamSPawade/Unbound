package com.unbound.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkClubActionRequest {

    @NotEmpty(message = "Club IDs list cannot be empty")
    private List<Long> clubIds;

    @NotNull(message = "Action is required")
    private BulkAction action;

    private String rejectionReason; // Required only for REJECT action

    public enum BulkAction {
        APPROVE,
        REJECT
    }
}
