import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// Importe le fichier local JSON (adapte le chemin si besoin)
import worldData from "../data/countries-50m.json";

const MapChart = () => (
  <ComposableMap>
    <Geographies geography={worldData}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            style={{
              default: { fill: "#D6D6DA", outline: "none" },
              hover: { fill: "#F53", outline: "none" },
              pressed: { fill: "#E42", outline: "none" },
            }}
          />
        ))
      }
    </Geographies>
  </ComposableMap>
);

export default MapChart;
