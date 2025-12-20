package vvp_company.logisticsservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.openfeign.FeignClient;
import vvp_company.logisticsservice.config.FeignConfig;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(defaultConfiguration = FeignConfig.class)
public class LogisticsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LogisticsServiceApplication.class, args);
	}

}
