package io.github.crnewell.cohortAnalysisTool.service;

import io.github.crnewell.cohortAnalysisTool.repository.CohortRepository;
import org.springframework.stereotype.Service;

@Service
public class CohortService {
    private final CohortRepository cohortRepository;

    public CohortService(CohortRepository cohortRepository) {
        this.cohortRepository = cohortRepository;
    }

    public void testConnection() throws Exception {
        cohortRepository.testConnection();
    }
}