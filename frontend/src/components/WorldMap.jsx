import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "antd";
import { useState } from "react";

// URL actualizada
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ patientsByCountry }) => {
  const maxPatients = Math.max(...Object.values(patientsByCountry), 1); // evitar división por 0

  const colorScale = (count) => {
    if (!count || count === 0) return "#EEEEEE"; // gris claro si no hay pacientes
    const intensity = 255 - Math.floor((count / maxPatients) * 200); // cuanto más pacientes, más oscuro
    return `rgb(${intensity}, ${intensity}, 255)`; // azul (de claro a oscuro)
  };

  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 150 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const patientCount = patientsByCountry[countryName] || 0;

              return (
                <Tooltip
                  key={geo.rsmKey}
                  title={
                    <span style={{ whiteSpace: "nowrap" }}>
                      {patientCount
                        ? `${countryName}: ${patientCount} paciente(s)`
                        : countryName}
                    </span>
                  }
                  placement="top"
                >
                  <Geography
                    geography={geo}
                    style={{
                      default: {
                        fill: colorScale(patientCount),
                        stroke: "#CCCCCC",      // borde gris claro entre países
                        strokeWidth: 0.5,        // grosor finito
                        outline: "none"
                      },
                      hover: {
                        fill: "#004080",
                        stroke: "#CCCCCC",       // borde más oscuro al pasar el ratón
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer"
                      },
                      pressed: {
                        fill: "#00BFFF",
                        stroke: "#CCCCCC",
                        strokeWidth: 0.5,
                        outline: "none"
                      }
                    }}

                  />
                </Tooltip>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;