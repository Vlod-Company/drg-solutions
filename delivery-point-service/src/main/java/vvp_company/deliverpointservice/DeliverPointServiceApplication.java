package vvp_company.deliverpointservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class DeliverPointServiceApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(DeliverPointServiceApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(DeliverPointServiceApplication.class, args);
    }

}
