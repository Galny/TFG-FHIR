package com.edu.tfgfhir.services;

import org.hl7.fhir.convertors.factory.VersionConvertorFactory_30_40;
import org.hl7.fhir.convertors.factory.VersionConvertorFactory_40_50;

import org.springframework.stereotype.Service;

import ca.uhn.fhir.context.FhirContext;

@Service
public class ServiceFHIRNormalizer implements IServiceFHIRNormalizer {

	private final FhirContext ctxSTU3 = FhirContext.forDstu3();
	private final FhirContext ctxR4 = FhirContext.forR4();
	private final FhirContext ctxR5 = FhirContext.forR5();

	public String normalizeToR4(String json) {
		try {
			// STU3 → R4
			org.hl7.fhir.dstu3.model.Resource stu3 = (org.hl7.fhir.dstu3.model.Resource) ctxSTU3.newJsonParser()
					.parseResource(json);
			org.hl7.fhir.r4.model.Resource convertedSTU3 = (org.hl7.fhir.r4.model.Resource) VersionConvertorFactory_30_40
					.convertResource(stu3);
			return ctxR4.newJsonParser().setPrettyPrint(true).encodeResourceToString(convertedSTU3);
		} catch (Exception ignore) {
		}

		try {
			// R5 → R4
			org.hl7.fhir.r5.model.Resource r5 = (org.hl7.fhir.r5.model.Resource) ctxR5.newJsonParser()
					.parseResource(json);
			org.hl7.fhir.r4.model.Resource convertedR5 = (org.hl7.fhir.r4.model.Resource) VersionConvertorFactory_40_50
					.convertResource(r5);
			return ctxR4.newJsonParser().setPrettyPrint(true).encodeResourceToString(convertedR5);
		} catch (Exception ignore) {
		}

		try {
			// Ya es R4
			org.hl7.fhir.r4.model.Resource r4 = (org.hl7.fhir.r4.model.Resource) ctxR4.newJsonParser()
					.parseResource(json);
			return ctxR4.newJsonParser().setPrettyPrint(true).encodeResourceToString(r4);
		} catch (Exception ignore) {
		}

		return "{ \"error\": \"No se pudo transformar el recurso a FHIR R4\" }";
	}
}
