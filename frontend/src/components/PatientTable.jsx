import { Table, Tag, Button } from "antd";
import { normalizeLanguage } from "../utils/languageTranslations";
import { countryTranslationsES } from "../utils/countryTranslationsES"; 

function PatientTable({ dataSource, loading, onPatientClick }) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Observaciones",
      dataIndex: "observations",
      key: "observations",
      render: (text, record) => (
        <Button type="link" onClick={() => onPatientClick(record)}>
          {text || "Ver"}
        </Button>
      )
    },
    {
      title: "Género",
      dataIndex: "gender",
      key: "gender",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      render: (gender) => {
        const traduccion = {
          female: "Mujer",
          male: "Varón",
          other: "Otro",
          unknown: "Desconocido"
        };
        const color = {
          female: "pink",
          male: "blue",
          other: "purple",
          unknown: "default"
        };
        return (
          <Tag color={color[gender] || "default"}>
            {traduccion[gender] || "Desconocido"}
          </Tag>
        );
      }
    },
    {
      title: "Fecha Nacimiento",
      dataIndex: "birthDate",
      key: "birthDate",
      sorter: (a, b) => {
        const parseDate = (dateStr) => {
          const [day, month, year] = dateStr.split("/");
          return new Date(`${year}-${month}-${day}`);
        };
    
        const dateA = parseDate(a.birthDate);
        const dateB = parseDate(b.birthDate);
    
        return dateA - dateB;
      }
    },
    {
      title: "Edad",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => {
        const numA = parseInt(a.age) || 0;
        const numB = parseInt(b.age) || 0;
        return numA - numB;
      }
    },
    {
      title: "Idioma",
      dataIndex: "language",
      key: "language",
      sorter: (a, b) => normalizeLanguage(a.language).localeCompare(normalizeLanguage(b.language)),
      render: (lang) => normalizeLanguage(lang),
    },
    {
      title: "Estado civil",
      dataIndex: "maritalStatus",
      key: "maritalStatus",
      sorter: (a, b) => a.maritalStatus.localeCompare(b.maritalStatus),
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "País",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => a.country.localeCompare(b.country),
      render: (countryCode) => countryTranslationsES[countryCode] || countryCode
    }
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      loading={loading}
      bordered
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: ["5", "10", "20", "50"],
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}–${range[1]} de ${total} pacientes`,
        locale: { items_per_page: "por página" }
      }}
      locale={{ emptyText: "No hay pacientes registrados" }}
    />
  );
}

export default PatientTable;