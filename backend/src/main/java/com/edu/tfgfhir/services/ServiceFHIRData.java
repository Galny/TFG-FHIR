package com.edu.tfgfhir.services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.IParser;
import org.hl7.fhir.r4.model.HumanName;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.Resource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.file.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ServiceFHIRData implements IServiceFHIRData {

	private final FhirContext ctx = FhirContext.forR4();
	private final IParser parser = ctx.newJsonParser();

	@Override
	public List<Map<String, Object>> getAllPatients() {
		List<Map<String, Object>> result = new ArrayList<>();
		try {
			Path dir = Paths.get("data/patients");

			try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir, "*.json")) {
				for (Path path : stream) {
					try (InputStream is = Files.newInputStream(path)) {
						Resource res = (Resource) parser.parseResource(is);
						if (res instanceof Patient) {
							Patient patient = (Patient) res;
							result.add(convertPatientToMap(patient));
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	private Map<String, Object> convertPatientToMap(Patient patient) {
		Map<String, Object> map = new HashMap<>();

		// ID
		String id = patient.getIdElement().getIdPart();
		map.put("id", id != null ? id : "—");

		// Nombre completo
		if (patient.hasName() && !patient.getName().isEmpty()) {
			HumanName name = patient.getName().get(0);
			String fullName = String.join(" ",
					name.getGiven().stream().map(t -> t.getValue()).collect(Collectors.toList())) + " "
					+ (name.getFamily() != null ? name.getFamily() : "—");
			map.put("name", fullName.trim());
		} else {
			map.put("name", "—");
		}

		// Género
		map.put("gender", patient.getGender() != null ? patient.getGender().toCode() : "unknown");

		// Fecha de nacimiento (formato dd/MM/yyyy)
		if (patient.hasBirthDate()) {
			Date birthDate = patient.getBirthDate();
			map.put("birthDate", new SimpleDateFormat("dd/MM/yyyy").format(birthDate));

			// Edad
			Calendar dob = Calendar.getInstance();
			dob.setTime(birthDate);
			int age = Calendar.getInstance().get(Calendar.YEAR) - dob.get(Calendar.YEAR);
			if (Calendar.getInstance().get(Calendar.DAY_OF_YEAR) < dob.get(Calendar.DAY_OF_YEAR)) {
				age--;
			}
			map.put("age", age);
		} else {
			map.put("birthDate", "—");
			map.put("age", "—");
		}

		// Idioma (desde communication.language.text o language en la raíz)
		if (patient.hasCommunication() && patient.getCommunication().get(0).hasLanguage()) {
			var lang = patient.getCommunication().get(0).getLanguage();
			if (!lang.getCoding().isEmpty() && lang.getCodingFirstRep().hasCode()) {
				map.put("language", lang.getCodingFirstRep().getCode());
			} else {
				map.put("language", "—");
			}
		} else if (patient.hasLanguage()) {
			map.put("language", patient.getLanguage());
		} else {
			map.put("language", "—");
		}

		// Estado civil
		if (patient.hasMaritalStatus()) {
			String gender = patient.getGender() != null ? patient.getGender().toCode() : "unknown";

			Map<String, Map<String, String>> estadoCivilPorGenero = Map.of("male",
					Map.of("M", "Casado", "S", "Soltero", "D", "Divorciado", "W", "Viudo", "U", "Desconocido"),
					"female",
					Map.of("M", "Casada", "S", "Soltera", "D", "Divorciada", "W", "Viuda", "U", "Desconocido"), "other",
					Map.of("M", "Casade", "S", "Soltere", "D", "Divorciade", "W", "Viude", "U", "Desconocido"),
					"unknown",
					Map.of("M", "Casado", "S", "Soltero", "D", "Divorciado", "W", "Viudo", "U", "Desconocido"));

			String code = patient.getMaritalStatus().getCoding().isEmpty() ? ""
					: patient.getMaritalStatus().getCoding().get(0).getCode();

			String estado = estadoCivilPorGenero.getOrDefault(gender, estadoCivilPorGenero.get("unknown"))
					.getOrDefault(code, "Desconocido");

			map.put("maritalStatus", estado);
		} else {
			map.put("maritalStatus", "—");
		}

		// Dirección
		if (patient.hasAddress()) {
			var address = patient.getAddress().get(0);

			String line = address.hasLine()
					? String.join(" ", address.getLine().stream().map(t -> t.getValue()).collect(Collectors.toList()))
					: "";
			String city = address.hasCity() ? address.getCity() : "";
			String state = address.hasState() ? address.getState() : "";
			String postal = address.hasPostalCode() ? address.getPostalCode() : "";

			String fullAddress = String.join(", ", Arrays.asList(line, city, state, postal).stream()
					.filter(s -> s != null && !s.isBlank()).collect(Collectors.toList()));

			map.put("address", fullAddress.isEmpty() ? "—" : fullAddress);
			map.put("country", address.hasCountry() ? address.getCountry() : "—");

		} else {
			map.put("address", "—");
			map.put("country", "—");
		}

		// Observaciones: este campo de momento lo dejamos vacío
		map.put("observations", "Ver observaciones");

		return map;
	}

	@Override
	public List<Map<String, Object>> getAllObservations() {
		List<Map<String, Object>> result = new ArrayList<>();
		Path dir = Paths.get("data/observations");

		try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir, "*.json")) {
			for (Path path : stream) {
				try (InputStream is = Files.newInputStream(path)) {
					Resource res = (Resource) parser.parseResource(is);
					if (res instanceof Observation) {
						Observation obs = (Observation) res;
						result.add(convertObservationToMap(obs));
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	private Map<String, Object> convertObservationToMap(Observation obs) {
		Map<String, Object> map = new HashMap<>();

		map.put("id", obs.getIdElement().getIdPart());

		// Paciente
		String patientRef = obs.hasSubject() && obs.getSubject().hasReference() ? obs.getSubject().getReference() : "—";
		map.put("patient", patientRef);

		// Código (tipo de observación)
		String code = obs.hasCode() && obs.getCode().hasText() ? obs.getCode().getText()
				: obs.getCode().hasCoding() ? obs.getCode().getCodingFirstRep().getDisplay() : "—";
		map.put("code", code);

		// Categoría
		String category = obs.hasCategory() && !obs.getCategoryFirstRep().isEmpty()
				? obs.getCategoryFirstRep().getCodingFirstRep().getDisplay()
				: "—";
		map.put("category", category);

		// 🔥 Fecha en formato ISO correcto
		String date = obs.hasEffectiveDateTimeType() ? obs.getEffectiveDateTimeType().getValueAsString() : "—";
		map.put("date", date);

		// Valor
		String value = obs.hasValueQuantity()
				? obs.getValueQuantity().getValue().toPlainString() + " " + obs.getValueQuantity().getUnit()
				: obs.hasValueStringType() ? obs.getValueStringType().asStringValue() : "—";
		map.put("value", value);

		return map;
	}
}