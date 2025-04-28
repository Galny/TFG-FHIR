import { Menu } from "antd";
import {
    HomeOutlined,
    UserOutlined,
    SearchOutlined,
    BarChartOutlined
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

function SideMenu() {
    const location = useLocation();

    return (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
        >
            <Menu.Item key="/" icon={<HomeOutlined style={{ fontSize: '18px' }}/>}>
                <Link to="/">Inicio</Link>
            </Menu.Item>
            <Menu.Item key="/patients" icon={<UserOutlined style={{ fontSize: '18px' }}/>}>
                <Link to="/patients">Pacientes</Link>
            </Menu.Item>
            <Menu.Item key="/search" icon={<SearchOutlined style={{ fontSize: '18px' }}/>}>
                <Link to="/search">Búsqueda</Link>
            </Menu.Item>
            <Menu.Item key="/statistics" icon={<BarChartOutlined style={{ fontSize: '18px' }}/>}>
                <Link to="/statistics">Estadísticas</Link>
            </Menu.Item>
        </Menu>
    );
}

export default SideMenu;
