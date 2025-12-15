package vvp_company.gateway.filter;

import feign.FeignException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.HandlerFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;
import vvp_company.gateway.client.AuthServiceClient;
import vvp_company.gateway.client.dto.ValidatieTokenRequest;

import java.util.function.Function;

public class AuthHeaderGatewayFilter{

    public static Function<ServerRequest, ServerRequest> auth(AuthServiceClient authServiceClient) {
        return request -> {
            try {
                var authToken = request.headers().header("Authorization").get(0);
                var response = authServiceClient.validate(new ValidatieTokenRequest(authToken));
                request = ServerRequest.from(request)
                        .header("Employee-Id", response.getUsername())
                        .header("Department", response.getDepartment())
                        .header("Roles", response.getRoles().toArray(new String[0]))
                        .build();
            } catch (Exception ignored) {}
            return request;
        };
    }
}
