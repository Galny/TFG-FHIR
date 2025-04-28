import { Layout } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { useState } from "react";

import HomePage from "./pages/Home";
import PatientPage from "./pages/Patients";
import SearchPage from "./pages/Search";
import StatisticsPage from "./pages/Statistics";
import NotFoundPage from "./pages/NotFoundPage";

import SideMenu from "./components/SideMenu";
import Header from "./components/Header";

import logo from "./assets/FHIR-JSON-logo-pequeno.png";
import miniLogo from "./assets/FHIR-JSON-logo-pequeno2.png";

import "antd/dist/reset.css";

const { Sider, Content, Footer } = Layout;

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={220}
        collapsedWidth={100}
      >
        <Link to="/">
          <div
            className="logo"
            style={{
              height: 64,
              backgroundColor: "#001529",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 10px"
            }}
            key={collapsed ? "mini" : "full"}
          >
            <img
              src={collapsed ? miniLogo : logo}
              alt="FHIR Dashboard"
              style={{
                height: "100%",
                maxHeight: "60px",
                objectFit: "contain",
                transition: "all 0.3s ease"
              }}
            />
          </div>
        </Link>
        <SideMenu />
      </Sider>

      {/* ESTE Layout es el que debe ser FLEX column */}
      <Layout style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header isHome={isHome} title={getTitleFromPath(location.pathname)} />

        {/* ESTE Content necesita flex: 1 */}
        <Content style={{ margin: "24px 16px 0", overflow: "initial", flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/patients" element={<PatientPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          FHIR JSON Dashboard ©2025 creado por Eduardo Gallego Nicolás
        </Footer>
      </Layout>
    </Layout>
  );
}

function getTitleFromPath(path) {
  switch (path) {
    case "/patients":
      return "Pacientes";
    case "/search":
      return "Búsqueda";
    case "/statistics":
      return "Estadísticas";
    default:
      return "FHIR Dashboard";
  }
}

export default AppWrapper;