package vvp_company.stationservice.dto;

import java.util.Optional;

public record AttackedDTO(
        Long id,
        Optional<String> description
) {}
