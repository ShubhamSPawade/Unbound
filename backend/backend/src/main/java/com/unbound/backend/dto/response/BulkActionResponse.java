package com.unbound.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkActionResponse {
    private int successCount;
    private int failureCount;
    private List<String> errors;
    private List<Long> successfulIds;
    private List<Long> failedIds;
}
