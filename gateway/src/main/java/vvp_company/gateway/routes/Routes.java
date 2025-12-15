package vvp_company.gateway.routes;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;
import vvp_company.gateway.client.AuthServiceClient;

import static org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions.lb;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;
import static vvp_company.gateway.filter.AuthHeaderGatewayFilter.auth;

@Configuration
@RequiredArgsConstructor
public class Routes {

    public final AuthServiceClient authServiceClient;

    @Bean
    public RouterFunction<ServerResponse> gatewayRouterFunctionsPath() {
        return route("request-service")
                .route(path("/request-service/**"), http())
                .filter(lb("request-service"))
                .before(auth(authServiceClient))
                .build()
                .and(route("auth-service")
                        .route(path("/auth/login", "/auth/register"), http())
                        .filter(lb("auth-service"))
                        .build())
                .and(route("logistic-service")
                        .route(path("/logistic-service/**"), http())
                        .filter(lb("logistic-service"))
                        .before(auth(authServiceClient))
                        .build())
                .and(route("station-service")
                        .route(path("/station-servic/**e"), http())
                        .filter(lb("station-service"))
                        .before(auth(authServiceClient))
                        .build())
                .and(route("store-service")
                        .route(path("/store-service/**"), http())
                        .filter(lb("store-service"))
                        .before(auth(authServiceClient))
                        .build())
                .and(route("mission-service")
                        .route(path("/mission-service/**"), http())
                        .filter(lb("mission-service"))
                        .before(auth(authServiceClient))
                        .build())
                .and(route("glossary-service")
                        .route(path("/glossary-service/**"), http())
                        .filter(lb("glossary-service"))
                        .before(auth(authServiceClient))
                        .build())
                .and(route("team-service")
                        .route(path("/team-service/**"), http())
                        .filter(lb("team-service"))
                        .before(auth(authServiceClient))
                        .build())
                .and(route("planet-service")
                        .route(path("/planet-service/**"), http())
                        .filter(lb("planet-service"))
                        .before(auth(authServiceClient))
                        .build())
                .and(route("employee-service")
                        .route(path("/employee-service/**"), http())
                        .filter(lb("employee-service"))
                        .before(auth(authServiceClient))
                        .build())
                .and(route("delivery-point-service")
                        .route(path("/delivery-point-service/**"), http())
                        .filter(lb("delivery-point-service"))
                        .before(auth(authServiceClient))
                        .build())
                .and(route("spaceship-service")
                        .route(path("/spaceship-service/**"), http())
                        .filter(lb("spaceship-service"))
                        .before(auth(authServiceClient))
                        .build());
    }
}
