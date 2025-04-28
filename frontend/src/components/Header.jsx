import React from "react";
import logo from "../assets/FHIR-JSON-logo.png"; // asegúrate de tener esta imagen en /src/assets/
import "./Header.css";

const Header = ({ isHome, title }) => {
    const height = isHome ? "300px" : "100px";
    const lineHeight = isHome ? "280px" : "100px";

    return (
        <div
            className="custom-header"
            style={{
                height,
                lineHeight,
                backgroundColor: "#f0f2f5",
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "bold"
            }}
        >
            {isHome ? (
                <img
                    src={logo}
                    alt="FHIR Dashboard"
                    style={{ width: "60%", maxWidth: "350px", height: "350px" }}
                />
            ) : (
                title
            )}
        </div>
    );
};

export default Header;
