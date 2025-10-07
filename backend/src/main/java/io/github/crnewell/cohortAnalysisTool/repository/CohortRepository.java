package io.github.crnewell.cohortAnalysisTool.repository;

import org.springframework.stereotype.Repository;
import jakarta.annotation.PostConstruct;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class CohortRepository {
    private final Connection connection;

    public CohortRepository(Connection connection) {
        this.connection = connection;
    }

    @PostConstruct
    public void initializeViews() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE VIEW IF NOT EXISTS condition_occurrence AS SELECT * FROM read_csv_auto('./data/omop/CDM_CONDITION_OCCURRENCE.csv')");
            stmt.execute("CREATE VIEW IF NOT EXISTS person AS SELECT * FROM read_csv_auto('./data/omop/CDM_PERSON.csv')");
            stmt.execute("CREATE VIEW IF NOT EXISTS measurement AS SELECT * FROM read_csv_auto('./data/omop/MEASUREMENT.csv')");
            stmt.execute("CREATE VIEW IF NOT EXISTS concept AS SELECT * FROM read_csv_auto('./data/omop/CONCEPT.csv')");
        }
        System.out.println("Created views for DuckDB");

        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("PRAGMA show_tables")) {
            while (rs.next()) System.out.println("Loaded table: " + rs.getString("name"));
        }

        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("DESCRIBE person")) {
            while (rs.next()) System.out.println(rs.getString("column_name"));
        }
    }

    public List<Integer> getDiseasePersonIds(int diseaseConceptId) throws SQLException {
        String sql = "SELECT DISTINCT \"PERSON_ID\" FROM condition_occurrence WHERE \"CONDITION_CONCEPT_ID\" = " + diseaseConceptId;
        List<Integer> ids = new ArrayList<>();
        try (Statement stmt = connection.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) ids.add(rs.getInt("PERSON_ID"));
        }
        return ids;
    }

    public List<Integer> getNonDiseasePersonIds(int diseaseConceptId) throws SQLException {
        String sql = "SELECT DISTINCT \"PERSON_ID\" FROM person WHERE \"PERSON_ID\" NOT IN (" +
                    "SELECT \"PERSON_ID\" FROM condition_occurrence WHERE \"CONDITION_CONCEPT_ID\" = " + diseaseConceptId + ")";
        List<Integer> ids = new ArrayList<>();
        try (Statement stmt = connection.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) ids.add(rs.getInt("PERSON_ID"));
        }
        return ids;
    }

    public List<Map<String,Object>> getAgeGenderDistribution(List<Integer> personIds) throws SQLException {
        if (personIds.isEmpty()) return Collections.emptyList();
        String inClause = personIds.stream().map(String::valueOf).collect(Collectors.joining(","));
        String sql = """
        SELECT age_bucket, "GENDER_CONCEPT_ID", COUNT(*) AS count
        FROM (
          SELECT 
            "PERSON_ID",
            "GENDER_CONCEPT_ID",
            (2010 - "YEAR_OF_BIRTH") AS age,
            CAST(FLOOR(CAST((2010 - "YEAR_OF_BIRTH") AS DOUBLE) / 10) * 10 AS INTEGER) AS age_group_start,
            CASE
              WHEN CAST(FLOOR(CAST((2010 - "YEAR_OF_BIRTH") AS DOUBLE) / 10) * 10 AS INTEGER) < 20 THEN '<20'
              ELSE 
                CAST(CAST(FLOOR(CAST((2010 - "YEAR_OF_BIRTH") AS DOUBLE) / 10) * 10 AS INTEGER) AS VARCHAR) 
                || '-' || 
                CAST(CAST(FLOOR(CAST((2010 - "YEAR_OF_BIRTH") AS DOUBLE) / 10) * 10 + 9 AS INTEGER) AS VARCHAR)
            END AS age_bucket
          FROM person
          WHERE "PERSON_ID" IN (%s)
        ) t
        GROUP BY age_bucket, "GENDER_CONCEPT_ID"
        ORDER BY age_bucket, "GENDER_CONCEPT_ID"
    """.formatted(inClause);

        List<Map<String,Object>> results = new ArrayList<>();
        try (Statement stmt = connection.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Map<String,Object> row = new HashMap<>();
                row.put("age_group", rs.getString("age_bucket"));           // e.g. "70-79" or "<20"
                row.put("gender_concept_id", rs.getInt("GENDER_CONCEPT_ID"));
                row.put("count", rs.getInt("count"));
                results.add(row);
            }
        }
        return results;
    }

    public Map<String,Object> getMeasurementStats(List<Integer> personIds, int measurementConceptId) throws SQLException {
        if (personIds.isEmpty()) return Map.of("n", 0);
        String inClause = personIds.stream().map(String::valueOf).collect(Collectors.joining(","));
        String sql = """
            SELECT
                COUNT("VALUE_AS_NUMBER") AS n,
                quantile_cont("VALUE_AS_NUMBER", 0.25) AS p25,
                quantile_cont("VALUE_AS_NUMBER", 0.5) AS median,
                quantile_cont("VALUE_AS_NUMBER", 0.75) AS p75
            FROM measurement
            WHERE "PERSON_ID" IN (%s)
            AND "MEASUREMENT_CONCEPT_ID" = %d
        """.formatted(inClause, measurementConceptId);

        try (Statement stmt = connection.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                Map<String,Object> stats = new HashMap<>();
                stats.put("n", rs.getInt("n"));
                stats.put("p25", rs.getObject("p25"));
                stats.put("median", rs.getObject("median"));
                stats.put("p75", rs.getObject("p75"));
                return stats;
            }
        }
        return Map.of();
    }

    public void testConnection() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS test (id INTEGER, name VARCHAR)");
            stmt.execute("INSERT INTO test VALUES (1, 'This means the database is working')");
            ResultSet rs = stmt.executeQuery("SELECT * FROM test");

            while (rs.next()) {
                System.out.println(rs.getInt("id") + " - " + rs.getString("name"));
            }
        }
    }
}