import { useState } from "react";
import {
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    Select,
    Button
} from "antd";
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";

import { countryTranslationsES } from "../utils/countryTranslationsES";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchForm = ({ onSearch }) => {
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);

    const handleFinish = (values) => {
        const filters = {
            ...values,
            birthDateRange: values.birthDateRange
                ? values.birthDateRange.map((d) => d.format("DD/MM/YYYY"))
                : undefined
        };
        onSearch(filters);
    };

    const handleClear = () => {
        form.resetFields();
        onSearch({});
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            style={{ marginBottom: "2rem" }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Form.Item name="name" label="Nombre del paciente">
                        <Input placeholder="Nombre o apellidos" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Form.Item name="gender" label="Género">
                        <Select placeholder="Selecciona un género" allowClear>
                            <Option value="male">Varón</Option>
                            <Option value="female">Mujer</Option>
                            <Option value="other">Otro</Option>
                            <Option value="unknown">Desconocido</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Form.Item name="birthDateRange" label="Rango de nacimiento">
                        <RangePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Col>

                {expand && (
                    <>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name="id" label="ID del paciente">
                                <Input placeholder="ID exacto" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name="maritalStatus" label="Estado civil">
                                <Select placeholder="Selecciona un estado civil" allowClear>
                                    <Option value="Casad">Casado/a/e</Option>
                                    <Option value="Solter">Soltero/a/e</Option>
                                    <Option value="Divorciad">Divorciado/a/e</Option>
                                    <Option value="Viud">Viudo/a/e</Option>
                                    <Option value="Desconocido">Desconocido</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name="address" label="Dirección o país">
                                <Input placeholder="Ciudad, calle o país" />
                            </Form.Item>
                        </Col>
                    </>
                )}

                <Col span={24} style={{ textAlign: "right" }}>
                    <a
                        style={{ marginRight: 12, fontSize: 14 }}
                        onClick={() => setExpand(!expand)}
                    >
                        {expand ? <UpOutlined /> : <DownOutlined />} {expand ? "Menos opciones" : "Más opciones"}
                    </a>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ marginRight: 8 }}>
                        Buscar
                    </Button>
                    <Button onClick={handleClear} icon={<ReloadOutlined />}>
                        Limpiar
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default SearchForm;
