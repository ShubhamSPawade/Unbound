package com.unbound.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubStatisticsResponse {
    private int totalClubs;
    private int pendingClubs;
    private int approvedClubs;
    private int rejectedClubs;
    private int activeClubs;
}
