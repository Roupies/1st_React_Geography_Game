// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import QuizEuropePrototype from "./App"; // Assurez-vous que le chemin est correct si votre composant est dans App.js
import "./index.css"; // <<<--- IMPORTEZ VOTRE FICHIER CSS ICI !

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QuizEuropePrototype />
  </React.StrictMode>
);
