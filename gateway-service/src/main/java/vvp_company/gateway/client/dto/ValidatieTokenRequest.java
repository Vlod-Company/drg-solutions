package vvp_company.gateway.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ValidatieTokenRequest {

    private String token;
}
