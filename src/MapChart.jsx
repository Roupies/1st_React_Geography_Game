import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const MapChart = () => {
  const [geographyData, setGeographyData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        console.log("Tentative de chargement de la carte...");
        const response = await fetch('/world-50m.json');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Données de la carte chargées avec succès:", data);
        setGeographyData(data);
      } catch (err) {
        console.error("Erreur lors du chargement de la carte:", err);
        setError(`Erreur de chargement: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        color: '#666'
      }}>
        <div>Chargement de la carte...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: 'red', 
        backgroundColor: '#fff5f5',
        border: '1px solid #ffebee',
        borderRadius: '4px',
        margin: '20px',
        textAlign: 'center'
      }}>
        <h3>Erreur de chargement de la carte</h3>
        <p>{error}</p>
        <p>Vérifiez que le fichier world-50m.json est bien présent dans le dossier public.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <ComposableMap 
        projection="geoMercator"
        projectionConfig={{
          scale: 400,
          center: [15, 52], // Centre sur l'Europe
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Geographies geography={geographyData}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { 
                    fill: "#D6D6DA", 
                    outline: "none",
                    stroke: "#FFF",
                    strokeWidth: 0.5
                  },
                  hover: { 
                    fill: "#F53", 
                    outline: "none" 
                  },
                  pressed: { 
                    fill: "#E42", 
                    outline: "none" 
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapChart;
