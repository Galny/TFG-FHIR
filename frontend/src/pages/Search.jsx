import { useEffect, useState } from "react";
import { Table, Typography, Tag, message } from "antd";
import SearchForm from "../components/SearchForm";
import PatientObservationDrawer from "../components/PatientObservationDrawer";
import PatientTable from "../components/PatientTable";
import API_BASE_URL from "../config";

const { Title } = Typography;

// Función para convertir "dd/MM/yyyy" a Date
const parseDate = (str) => {
  const [day, month, year] = str.split("/");
  return new Date(`${year}-${month}-${day}`);
};

function Search() {
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchPatients = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/patients`)
      .then((res) => res.json())
      .then((data) => {
        setAllPatients(data);
        setFilteredPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando pacientes:", err);
        message.error("Error al cargar los pacientes");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (filters) => {
    const result = allPatients.filter((p) => {
      const matchId =
        !filters.id || p.id?.toLowerCase().includes(filters.id.toLowerCase());

      const matchName =
        !filters.name || p.name?.toLowerCase().includes(filters.name.toLowerCase());

      const matchGender =
        !filters.gender || p.gender === filters.gender;

      const matchBirthDate =
        !filters.birthDateRange ||
        (
          p.birthDate &&
          parseDate(p.birthDate) >= new Date(filters.birthDateRange[0]) &&
          parseDate(p.birthDate) <= new Date(filters.birthDateRange[1])
        );

      const matchPhone =
        !filters.phone || p.phone?.toLowerCase().includes(filters.phone.toLowerCase());

      const matchMaritalStatus =
        !filters.maritalStatus || p.maritalStatus?.toLowerCase().includes(filters.maritalStatus.toLowerCase());

      const matchAddress =
        !filters.address ||
        p.address?.toLowerCase().includes(filters.address.toLowerCase()) ||
        p.country?.toLowerCase().includes(filters.address.toLowerCase());

      return (
        matchId &&
        matchName &&
        matchGender &&
        matchBirthDate &&
        matchPhone &&
        matchMaritalStatus &&
        matchAddress
      );
    });

    setFilteredPatients(result);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>🔍 Búsqueda avanzada de pacientes</Title>

      <SearchForm onSearch={handleSearch} />

      <PatientTable
        dataSource={filteredPatients}
        loading={loading}
        onPatientClick={(patient) => {
          setSelectedPatient(patient);
          setDrawerOpen(true);
        }}
      />

      <PatientObservationDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />
    </div>
  );
}

export default Search;