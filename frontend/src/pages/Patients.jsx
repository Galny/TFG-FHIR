import { useEffect, useState } from "react";
import {
    Table,
    Typography,
    Tag,
    Upload,
    Button,
    Alert
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PatientObservationDrawer from "../components/PatientObservationDrawer";
import PatientTable from "../components/PatientTable";
import API_BASE_URL from "../config";

const { Title } = Typography;

function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const fetchPatients = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/patients`)
            .then((res) => res.json())
            .then((data) => {
                setPatients(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando pacientes:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${API_BASE_URL}/patients/upload`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const resText = await response.text();
                setAlertMessage({ type: "success", text: resText });
                fetchPatients();
                onSuccess("ok");
            } else {
                const errText = await response.text();
                setAlertMessage({ type: "error", text: `Error: ${errText}` });
                onError(new Error(errText));
            }
            setTimeout(() => setAlertMessage(null), 1500);
        } catch (error) {
            console.error("Upload error:", error);
            setAlertMessage({ type: "error", text: "Error al subir los pacientes" });
            onError(error);
            setTimeout(() => setAlertMessage(null), 1500);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <Title level={2}>👤 Pacientes registrados</Title>

            {alertMessage && (
                <Alert
                    message={alertMessage.text}
                    type={alertMessage.type}
                    showIcon
                    closable
                    style={{ marginBottom: "1rem" }}
                    onClose={() => setAlertMessage(null)}
                />
            )}

            <Upload
                customRequest={handleUpload}
                accept=".json"
                showUploadList={false}
                multiple
            >
                <Button icon={<UploadOutlined />} style={{ marginBottom: "1rem" }}>
                    Subir nuevos pacientes (.json)
                </Button>
            </Upload>

            <PatientTable
                dataSource={patients}
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

export default Patients;