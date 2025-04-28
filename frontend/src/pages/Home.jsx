import { Card, Row, Col } from "antd";
import { UserOutlined, SearchOutlined, BarChartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Pacientes",
      description: "Explora los recursos de tipo Patient en tu servidor FHIR.",
      icon: <UserOutlined style={{ fontSize: 40, color: "#1890ff" }} />,
      route: "/patients",
    },
    {
      title: "Búsqueda",
      description: "Busca recursos específicos por ID, nombre u otros parámetros.",
      icon: <SearchOutlined style={{ fontSize: 40, color: "#1890ff" }} />,
      route: "/search",
    },
    {
      title: "Estadísticas",
      description: "Visualiza métricas agregadas y datos del sistema FHIR.",
      icon: <BarChartOutlined style={{ fontSize: 40, color: "#1890ff" }} />,
      route: "/statistics",
    },
  ];

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Bienvenido al FHIR Dashboard
      </h1>
      <Row gutter={[24, 24]} justify="center">
        {cards.map((card, index) => (
          <Col key={index}>
            <Card
              hoverable
              title={card.title}
              style={{
                width: 300,
                textAlign: "center",
                transition: "transform 0.3s",
              }}
              onClick={() => navigate(card.route)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
            >

              {card.icon}
              <p style={{ marginTop: "1rem" }}>{card.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;
