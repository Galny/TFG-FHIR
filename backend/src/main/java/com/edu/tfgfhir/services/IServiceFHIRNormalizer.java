package com.edu.tfgfhir.services;

import org.springframework.context.annotation.ComponentScan;

@ComponentScan
public interface IServiceFHIRNormalizer {

	String normalizeToR4(String json);
	
}
