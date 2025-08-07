package com.unbound.backend.dto;

import lombok.Data;
import lombok.Builder;
import java.util.List;
import com.unbound.backend.dto.TeamMemberInfo;

@Data
@Builder
public class TeamResponse {
    private Long teamId;
    private String teamName;
    private String eventName;
    private Long eventId;
    private String leaderName;
    private String leaderEmail;
    private List<TeamMemberInfo> registeredMembers;
    private List<TeamMemberInfo> unregisteredMembers;
    private Integer totalMembers;
    private Integer minTeamSize;
    private Integer maxTeamSize;
    private Boolean isComplete; // true if team meets minimum size requirement
}

 