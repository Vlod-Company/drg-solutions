package vvp_company.stationservice.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor headerPropagationInterceptor() {
        return new HeaderPropagationInterceptor();
    }
}
