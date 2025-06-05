import { useEffect, useState } from "react";
import {
  Drawer,
  Descriptions,
  Table,
  Upload,
  Button,
  message,
  Tag,
  Typography
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { normalizeLanguage } from "../utils/languageTranslations";
import { countryTranslationsES } from "../utils/countryTranslationsES";
import API_BASE_URL from "../config";

const { Title } = Typography;

const PatientObservationDrawer = ({ open, onClose, patient }) => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchObservations = async () => {
    if (!patient?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/observations`);
      const data = await response.json();
      const filtered = data.filter((obs) =>
        obs.patient === `Patient/${patient.id}`
      );

      const processed = filtered.map((obs) => ({
        id: obs.id,
        code: obs.code,
        category: obs.category, // 👈 ahora recogemos la categoría también
        value: obs.value,
        date: obs.date !== "—" ? obs.date : null
      }));

      setObservations(processed);
    } catch (error) {
      console.error("Error al cargar observaciones:", error);
      message.error("No se pudieron cargar las observaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && patient?.id) {
      fetchObservations();
    }
  }, [open, patient]);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/observations/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("Observación subida correctamente");
        fetchObservations();
        onSuccess("ok");
      } else {
        const errText = await response.text();
        message.error(`Error: ${errText}`);
        onError(new Error(errText));
      }
    } catch (error) {
      console.error("Error de subida:", error);
      message.error("Error al subir las observaciones");
      onError(error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Observación",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Categoría",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => (a.category || "").localeCompare(b.category || ""),
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => {
        const numA = parseFloat(a.value) || 0;
        const numB = parseFloat(b.value) || 0;
        return numA - numB;
      },
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : -Infinity;
        const dateB = b.date ? new Date(b.date).getTime() : -Infinity;
        return dateA - dateB;
      },
      render: (text) => {
        if (!text) return "-";
        const dateObj = new Date(text);
        if (isNaN(dateObj)) return "-";

        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}`;
      }
    }
  ];

  return (
    <Drawer
      title="Observaciones del paciente"
      width={640}
      placement="right"
      onClose={onClose}
      open={open}
    >
      {patient && (
        <>
          <Descriptions
            title="Información del paciente"
            bordered
            column={1}
            size="small"
            style={{ marginBottom: "1rem" }}
          >
            <Descriptions.Item label="ID">{patient.id}</Descriptions.Item>
            <Descriptions.Item label="Nombre">{patient.name}</Descriptions.Item>
            <Descriptions.Item label="Género">
              <Tag color={patient.gender === "female" ? "pink" : "blue"}>
                {patient.gender === "female" ? "Mujer" : "Varón"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Nacimiento">{patient.birthDate}</Descriptions.Item>
            <Descriptions.Item label="Edad">{patient.age}</Descriptions.Item>
            <Descriptions.Item label="Idioma">{normalizeLanguage(patient.language)}</Descriptions.Item>
            <Descriptions.Item label="Estado civil">{patient.maritalStatus}</Descriptions.Item>
            <Descriptions.Item label="Dirección">{patient.address}</Descriptions.Item>
            <Descriptions.Item label="País">{countryTranslationsES[patient.country] || patient.country}</Descriptions.Item>
          </Descriptions>

          <div style={{ marginBottom: "1rem" }}>
            <Title level={5}>Subir nueva(s) observación(es)</Title>
            <Upload
              customRequest={handleUpload}
              accept=".json"
              showUploadList={false}
              multiple
            >
              <Button icon={<UploadOutlined />}>Subir observación(es) (.json)</Button>
            </Upload>
          </div>

          <Title level={5}>Historial de observaciones</Title>
          <Table
            columns={columns}
            dataSource={observations}
            rowKey="id"
            size="small"
            loading={loading}
            pagination={{
              defaultPageSize: 3,
              pageSizeOptions: ["1", "3", "5", "10"],
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}–${range[1]} de ${total} observaciones`,
              locale: {
                items_per_page: "por página"
              }
            }}
            locale={{ emptyText: "El paciente no tiene observaciones" }}
          />
        </>
      )}
    </Drawer>
  );
};

export default PatientObservationDrawer;
