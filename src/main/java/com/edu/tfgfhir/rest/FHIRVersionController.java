package com.edu.tfgfhir.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.tfgfhir.services.IServiceFHIRNormalizer;

@RestController
@RequestMapping("/normalize")
public class FHIRVersionController {

	private IServiceFHIRNormalizer servicio;
	
	@Autowired
	public FHIRVersionController(IServiceFHIRNormalizer servicio) {
		this.servicio = servicio;
	}
	
	@PostMapping(consumes = "application/json", produces = "application/json")
    public String normalize(@RequestBody String inputJson) {
        return servicio.normalizeToR4(inputJson);
    }
}
