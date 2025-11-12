package com.rental.divine_costume;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DivineCostumeApplication {

	public static void main(String[] args) {
		SpringApplication.run(DivineCostumeApplication.class, args);
	}

}
