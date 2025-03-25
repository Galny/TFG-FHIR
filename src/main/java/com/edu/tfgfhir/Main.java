package com.edu.tfgfhir;

import ca.uhn.fhir.context.FhirContext;
import org.hl7.fhir.r4.model.Patient;
import java.io.InputStream;

public class Main {

	public static void main(String[] args) {
        // Crear el contexto de FHIR R4
        FhirContext ctx = FhirContext.forR4();

        // Leer el JSON desde resources
        InputStream inputStream = Main.class.getResourceAsStream("/patient-example.json");
        if (inputStream == null) {
            System.err.println("No se pudo encontrar el archivo JSON");
            return;
        }

        // Parsear el recurso Patient
        Patient patient = (Patient) ctx.newJsonParser().parseResource(inputStream);

        // Imprimir información del paciente
        System.out.println("ID: " + patient.getIdElement().getIdPart());
        System.out.println("Nombre: " + patient.getNameFirstRep().getNameAsSingleString());
        System.out.println("Género: " + patient.getGender());
        System.out.println("Fecha de nacimiento: " + patient.getBirthDate());
    }
}
