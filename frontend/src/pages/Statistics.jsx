import { useEffect, useState } from "react";
import { Row, Col, Typography, Card, Select, message } from "antd";
import {
  Bar,
  Pie,
  Doughnut
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  RadialLinearScale,
  LineElement,
  PointElement,
  PolarAreaController,
  LineController
} from "chart.js";

import WorldMap from "../components/WorldMap";
import countryTranslationsES from "../utils/countryTranslationsES";
import countryTranslationsEN from "../utils/countryTranslationsEN";
import { normalizeLanguage } from "../utils/languageTranslations";
import API_BASE_URL from "../config";

ChartJS.register(ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  RadialLinearScale,
  LineElement,
  PointElement,
  PolarAreaController,
  LineController);

const { Title } = Typography;
const { Option } = Select;

const COLORS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#75daad", "#00a8cc",
  "#ad62aa", "#05dfd7", "#ffbd69", "#f6ab6c", "#a3de83"
];

const Statistics = () => {
  const [patients, setPatients] = useState([]);
  const [topN, setTopN] = useState(5);
  const [topCountryN, setTopCountryN] = useState(5);

  useEffect(() => {
    fetch(`${API_BASE_URL}/patients`)
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(err => {
        console.error("Error al cargar pacientes:", err);
        message.error("No se pudieron cargar los datos de pacientes.");
      });
  }, []);

  const safeGroupBy = (key, map = x => x, allowed = null) => {
    const counts = patients.reduce((acc, p) => {
      let k = map(p[key]);
      if (!k || typeof k !== "string" || k.trim() === "" || k === "null" || k === "—") return acc;
      if (allowed && !allowed.includes(k)) return acc;
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    if (allowed) {
      allowed.forEach(val => {
        if (!(val in counts)) counts[val] = 0;
      });
    }

    return counts;
  };

  const groupByAgeRange = () => {
    const counts = {
      "0–9": 0, "10–19": 0, "20–29": 0, "30–39": 0, "40–49": 0,
      "50–59": 0, "60–69": 0, "70–79": 0, "80–89": 0, "90–99": 0, "100+": 0
    };

    patients.forEach(p => {
      if (!p.age || isNaN(p.age)) return;
      const age = parseInt(p.age);
      if (age < 10) counts["0–9"]++;
      else if (age < 20) counts["10–19"]++;
      else if (age < 30) counts["20–29"]++;
      else if (age < 40) counts["30–39"]++;
      else if (age < 50) counts["40–49"]++;
      else if (age < 60) counts["50–59"]++;
      else if (age < 70) counts["60–69"]++;
      else if (age < 80) counts["70–79"]++;
      else if (age < 90) counts["80–89"]++;
      else if (age < 100) counts["90–99"]++;
      else counts["100+"]++;
    });

    return counts;
  };

  const groupByBirthMonth = () => {
    const counts = {
      "Enero": 0, "Febrero": 0, "Marzo": 0, "Abril": 0, "Mayo": 0, "Junio": 0,
      "Julio": 0, "Agosto": 0, "Septiembre": 0, "Octubre": 0, "Noviembre": 0, "Diciembre": 0
    };

    patients.forEach(p => {
      if (!p.birthDate) return;
      const dateParts = p.birthDate.split("/");
      if (dateParts.length !== 3) return;
      const monthNum = parseInt(dateParts[1], 10);
      const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const monthName = months[monthNum - 1];
      if (monthName) counts[monthName]++;
    });

    return counts;
  };

  const makeChartData = (groupedData, label = "Pacientes") => ({
    labels: Object.keys(groupedData),
    datasets: [
      {
        label,
        data: Object.values(groupedData),
        backgroundColor: COLORS,
        hoverOffset: 4
      }
    ]
  });

  const translateGender = (g) => {
    const map = {
      male: "Varón",
      female: "Mujer",
      other: "Otro",
      unknown: "Desconocido"
    };
    return map[g] ?? "Desconocido";
  };

  const normalizeMaritalStatus = (status) => {
    const s = status?.toLowerCase() ?? "";
    if (s.includes("solter")) return "Soltero";
    if (s.includes("casad")) return "Casado";
    if (s.includes("divorciad")) return "Divorciado";
    if (s.includes("viud")) return "Viudo";
    return "Desconocido";
  };

  const topNItems = (groupedData, n) => {
    return Object.entries(groupedData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {});
  };

  const genderData = makeChartData(
    safeGroupBy("gender", translateGender, ["Varón", "Mujer", "Otro", "Desconocido"]),
    "Género"
  );

  const ageData = makeChartData(groupByAgeRange(), "Edades");

  const languageData = makeChartData(
    topNItems(safeGroupBy("language", normalizeLanguage), topN),
    "Idiomas"
  );

  const maritalData = makeChartData(
    safeGroupBy("maritalStatus", normalizeMaritalStatus, ["Soltero", "Casado", "Divorciado", "Viudo", "Desconocido"]),
    "Estado civil"
  );

  const birthMonthData = makeChartData(groupByBirthMonth(), "Meses de nacimiento");


  const countryEN = safeGroupBy("country", c => countryTranslationsEN[c] || c);
  const countryES = safeGroupBy("country", c => countryTranslationsES[c] || c);
  
  const countryData = makeChartData(topNItems(countryES, topCountryN), "País de residencia");

  const patientsByCountry = Object.entries(countryEN).reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            return ` ${value} paciente(s)`;
          }
        }
      }
    }
  };

  // Opciones para el gráfico de edades
  const ageChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            return ` ${value} paciente${value === 1 ? "" : "s"}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Años', // Eje X
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Pacientes', // Eje Y
          font: { size: 14, weight: 'bold' }
        }
      }
    }
  };

  // Opciones para el gráfico de estado civil
  const maritalChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            return ` ${value} paciente${value === 1 ? "" : "s"}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Estados',
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Pacientes',
          font: { size: 14, weight: 'bold' }
        }
      }
    }
  };

  // Opciones para el gráfico de meses de nacimiento
  const birthMonthChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            return ` ${value} paciente${value === 1 ? "" : "s"}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Meses',
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Pacientes',
          font: { size: 14, weight: 'bold' }
        }
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>📊 Estadísticas de pacientes</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Género" style={{ minHeight: 360 }}>
            <div style={{ height: 300 }}>
              <Doughnut data={genderData} options={chartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Edades" style={{ minHeight: 360 }}>
            <div style={{ height: 300 }}>
              <Bar data={ageData} options={ageChartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Idiomas ({topN === 999 ? "Todos" : `Top ${topN}`})</span>
                <Select value={topN} style={{ minWidth: 100 }} onChange={setTopN}>
                  <Option value={1}>Top 1</Option>
                  <Option value={3}>Top 3</Option>
                  <Option value={5}>Top 5</Option>
                  <Option value={10}>Top 10</Option>
                  <Option value={999}>Todos</Option>
                </Select>
              </div>
            }
            style={{ minHeight: 360 }}
          >
            <div style={{ height: 300 }}>
              <Pie data={languageData} options={chartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Estado civil" style={{ minHeight: 360 }}>
            <div style={{ height: 300 }}>
              <Bar data={maritalData} options={maritalChartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>País de residencia ({topCountryN === 999 ? "Todos" : `Top ${topCountryN}`})</span>
                <Select value={topCountryN} style={{ minWidth: 100 }} onChange={setTopCountryN}>
                  <Option value={1}>Top 1</Option>
                  <Option value={3}>Top 3</Option>
                  <Option value={5}>Top 5</Option>
                  <Option value={10}>Top 10</Option>
                  <Option value={999}>Todos</Option>
                </Select>
              </div>
            }
            style={{ minHeight: 360 }}
          >
            <div style={{ height: 300 }}>
              <Pie data={countryData} options={chartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Meses de nacimiento" style={{ minHeight: 360 }}>
            <div style={{ height: 300 }}>
              <Bar data={birthMonthData} options={birthMonthChartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Mapa mundial de pacientes" style={{ minHeight: 500 }}>
            <WorldMap patientsByCountry={patientsByCountry} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;