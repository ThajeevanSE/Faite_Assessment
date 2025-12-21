package com.faite_assessment.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

        // Load .env file
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing() // Don't crash if .env is missing (e.g. in production)
                .load();

        // Set system properties so Spring can see them
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        SpringApplication.run(BackendApplication.class, args);
	}

}
