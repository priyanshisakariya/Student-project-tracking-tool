package com.campus.campus_backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class CampusBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE review_proposal ALTER COLUMN project_description TYPE TEXT");
                jdbcTemplate.execute("ALTER TABLE review_proposal ALTER COLUMN technology_stack TYPE TEXT");
                jdbcTemplate.execute("ALTER TABLE submit_proposal ALTER COLUMN project_description TYPE TEXT");
                jdbcTemplate.execute("ALTER TABLE submit_proposal ALTER COLUMN technology_stack TYPE TEXT");
                System.out.println("PostgreSQL columns project_description and technology_stack altered to TEXT successfully.");
            } catch (Exception e) {
                System.out.println("Schema migration notice: " + e.getMessage());
            }
        };
    }
}
