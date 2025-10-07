package io.github.crnewell.cohortAnalysisTool.service;

import io.github.crnewell.cohortAnalysisTool.repository.CohortRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.sql.SQLException;


@Service
public class CohortService {
    private final CohortRepository cohortRepository;

    public CohortService(CohortRepository cohortRepository) {
        this.cohortRepository = cohortRepository;
    }

    public void testConnection() throws Exception {
        cohortRepository.testConnection();
    }

    public Map<String, Object> compareCohorts(int diseaseConceptId, int measurementConceptId) throws SQLException {
        List<Integer> disease = cohortRepository.getDiseasePersonIds(diseaseConceptId);
        List<Integer> nonDisease = cohortRepository.getNonDiseasePersonIds(diseaseConceptId);

        Map<String,Object> result = new HashMap<>();
        result.put("disease_age_gender", cohortRepository.getAgeGenderDistribution(disease));
        result.put("non_disease_age_gender", cohortRepository.getAgeGenderDistribution(nonDisease));
        result.put("disease_stats", cohortRepository.getMeasurementStats(disease, measurementConceptId));
        result.put("non_disease_stats", cohortRepository.getMeasurementStats(nonDisease, measurementConceptId));
        result.put("disease_count", disease.size());
        result.put("non_disease_count", nonDisease.size());
        return result;
    }
}