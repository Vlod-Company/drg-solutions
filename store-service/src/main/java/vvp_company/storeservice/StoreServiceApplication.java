package vvp_company.storeservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import vvp_company.storeservice.config.FeignConfig;

@SpringBootApplication
@EnableFeignClients(defaultConfiguration = FeignConfig.class)
@EnableDiscoveryClient
public class StoreServiceApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(StoreServiceApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(StoreServiceApplication.class, args);
    }

}
