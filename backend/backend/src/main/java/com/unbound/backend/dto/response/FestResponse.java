package com.unbound.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FestResponse {
    private Long id;
    private String name;
    private String description;
    private String bannerUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long collegeId;
    private String collegeName;
    private LocalDateTime createdAt;
}
