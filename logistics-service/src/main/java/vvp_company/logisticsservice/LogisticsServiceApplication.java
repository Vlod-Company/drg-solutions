package vvp_company.logisticsservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.openfeign.FeignClient;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class LogisticsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LogisticsServiceApplication.class, args);
	}

}
