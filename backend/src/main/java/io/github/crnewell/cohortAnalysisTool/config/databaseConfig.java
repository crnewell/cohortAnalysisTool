package io.github.crnewell.cohortAnalysisTool.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Configuration
public class databaseConfig {
    @Bean
    public Connection duckDbConnection() {
    try {
        String url = "jdbc:duckdb:./data/cohort_analysis.db";
        return DriverManager.getConnection(url);
    }
    catch (SQLException e) {
        throw new RuntimeException("Failure to connect to database", e);
    }
}
}

