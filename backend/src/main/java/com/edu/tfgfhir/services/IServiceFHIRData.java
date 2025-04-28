package com.edu.tfgfhir.services;

import org.springframework.context.annotation.ComponentScan;

import java.util.List;
import java.util.Map;

@ComponentScan
public interface IServiceFHIRData {

	List<Map<String, Object>> getAllPatients();
	
	List<Map<String, Object>> getAllObservations();
}
