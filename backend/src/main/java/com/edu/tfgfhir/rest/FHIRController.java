package com.edu.tfgfhir.rest;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edu.tfgfhir.services.IServiceFHIRData;
import com.edu.tfgfhir.services.IServiceFHIRNormalizer;

@RestController
@RequestMapping("/")
public class FHIRController {

	private IServiceFHIRNormalizer servicioNormalizer;
	private IServiceFHIRData servicioData;

	@Autowired
	public FHIRController(IServiceFHIRNormalizer servicioNormalizer, IServiceFHIRData servicioData) {
		this.servicioNormalizer = servicioNormalizer;
		this.servicioData = servicioData;

	}

	@PostMapping("/patients/upload")
	public ResponseEntity<String> uploadAndNormalizePatients(@RequestParam("file") MultipartFile[] files)
	{
	    try {
	        Path folder = Paths.get("data/patients");
	        if (!Files.exists(folder)) {
	            Files.createDirectories(folder);
	        }

	        for (MultipartFile file : files) {
	            if (!file.getOriginalFilename().endsWith(".json")) {
	                return ResponseEntity.badRequest().body("Solo se permiten archivos .json");
	            }

	            String originalJson = new String(file.getBytes(), StandardCharsets.UTF_8);
	            String normalizedJson = servicioNormalizer.normalizeToR4(originalJson);

	            String filename = file.getOriginalFilename().replace(".json", "_normalized.json");
	            Path destinationPath = folder.resolve(filename);

	            Files.write(destinationPath, normalizedJson.getBytes(StandardCharsets.UTF_8));
	        }

	        return ResponseEntity.ok("Pacientes subidos y normalizados correctamente.");
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body("Error al procesar los pacientes: " + e.getMessage());
	    }
	}


	@PostMapping("/observations/upload")
	public ResponseEntity<String> uploadAndNormalizeObservations(@RequestParam("file") MultipartFile[] files)
	{
	    try {
	        Path folder = Paths.get("data/observations");
	        if (!Files.exists(folder)) {
	            Files.createDirectories(folder);
	        }

	        for (MultipartFile file : files) {
	            if (!file.getOriginalFilename().endsWith(".json")) {
	                return ResponseEntity.badRequest().body("Solo se permiten archivos .json");
	            }

	            String originalJson = new String(file.getBytes(), StandardCharsets.UTF_8);
	            String normalizedJson = servicioNormalizer.normalizeToR4(originalJson);

	            String filename = file.getOriginalFilename().replace(".json", "_normalized.json");
	            Path destinationPath = folder.resolve(filename);

	            Files.write(destinationPath, normalizedJson.getBytes(StandardCharsets.UTF_8));
	        }

	        return ResponseEntity.ok("Observaciones subidas y normalizadas correctamente.");
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body("Error al procesar las observaciones: " + e.getMessage());
	    }
	}


	@GetMapping("/patients")
	public List<Map<String, Object>> getAllPatients() {
		return servicioData.getAllPatients();
	}

	@GetMapping("/observations")
	public List<Map<String, Object>> getObservations() {
		return servicioData.getAllObservations();
	}
}