package vvp_company.gateway.filter;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.function.ServerRequest;
import vvp_company.gateway.client.AuthServiceClient;
import vvp_company.gateway.client.dto.ValidatieTokenRequest;

import java.util.Arrays;
import java.util.function.Function;

public class AuthHeaderGatewayFilter{

    public static Function<ServerRequest, ServerRequest> auth(AuthServiceClient authServiceClient) {
        return request -> {
            try {
                var authToken = request.headers().header("Authorization").get(0);
                var token = authToken.substring("Bearer ".length());
                var response = authServiceClient.validate(new ValidatieTokenRequest(token));
                request = ServerRequest.from(request)
                        .header("Employee-Id", response.getEmployee_id().toString())
                        .header("Department", response.getDepartment())
                        .header("Roles", response.getRoles().toArray(new String[0]))
                        .build();
            } catch (Exception ignored) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
            return request;
        };
    }
}
