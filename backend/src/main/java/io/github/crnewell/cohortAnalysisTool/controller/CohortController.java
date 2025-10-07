package io.github.crnewell.cohortAnalysisTool.controller;

import io.github.crnewell.cohortAnalysisTool.repository.CohortRepository;
import io.github.crnewell.cohortAnalysisTool.service.CohortService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cohort")
public class CohortController {
    private final CohortService cohortService;

    public CohortController(CohortService cohortService) {
        this.cohortService = cohortService;
    }

@GetMapping("/test-db")
public void testDb() throws Exception {
    cohortService.testConnection();
}
}