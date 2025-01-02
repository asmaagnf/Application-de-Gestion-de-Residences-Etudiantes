package dev.asmaa.ResidenceETU;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ResidenceEtuApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResidenceEtuApplication.class, args);
	}
}

