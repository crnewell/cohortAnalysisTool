package io.github.crnewell.cohortAnalysisTool.controller;

import io.github.crnewell.cohortAnalysisTool.repository.CohortRepository;
import io.github.crnewell.cohortAnalysisTool.service.CohortService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.sql.SQLException;


@RestController
@RequestMapping("/api/cohort")
@CrossOrigin(origins = "http://localhost:8000")
public class CohortController {
    private final CohortService cohortService;

    public CohortController(CohortService cohortService) {
        this.cohortService = cohortService;
    }

@GetMapping("/test-db")
public void testDb() throws Exception {
    cohortService.testConnection();
}

@GetMapping("/compare")
public Map<String, Object> compareCohorts(
        @RequestParam int diseaseConceptId,
        @RequestParam int measurementConceptId
) throws SQLException {
    return cohortService.compareCohorts(diseaseConceptId, measurementConceptId);
}

}