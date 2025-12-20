package vvp_company.stationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import vvp_company.stationservice.config.FeignConfig;

@SpringBootApplication
@EnableFeignClients(defaultConfiguration = FeignConfig.class)
@EnableDiscoveryClient
public class StationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(StationServiceApplication.class, args);
	}
}
