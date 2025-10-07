package io.github.crnewell.cohortAnalysisTool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class CohortAnalysisToolApplication {

	public static void main(String[] args) {
		SpringApplication.run(CohortAnalysisToolApplication.class, args);
	}

}
