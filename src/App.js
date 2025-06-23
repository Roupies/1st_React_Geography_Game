import React, { useState, useEffect, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import MapChart from "./MapChart";

// Données pays européens - CODES ISO3 (important pour correspondre à la carte)
const europeCountries = [
  { id: "FRA", name: "France", capital: "Paris" },
  { id: "DEU", name: "Allemagne", capital: "Berlin" },
  { id: "ITA", name: "Italie", capital: "Rome" },
  { id: "ESP", name: "Espagne", capital: "Madrid" },
  { id: "GBR", name: "Royaume-Uni", capital: "Londres" },
  { id: "POL", name: "Pologne", capital: "Varsovie" },
  { id: "NLD", name: "Pays-Bas", capital: "Amsterdam" },
  { id: "BEL", name: "Belgique", capital: "Bruxelles" },
  { id: "CHE", name: "Suisse", capital: "Berne" },
  { id: "AUT", name: "Autriche", capital: "Vienne" },
  { id: "PRT", name: "Portugal", capital: "Lisbonne" },
  { id: "SWE", name: "Suède", capital: "Stockholm" },
  { id: "NOR", name: "Norvège", capital: "Oslo" },
  { id: "DNK", name: "Danemark", capital: "Copenhague" },
  { id: "FIN", name: "Finlande", capital: "Helsinki" },
  { id: "GRC", name: "Grèce", capital: "Athènes" },
  { id: "IRL", name: "Irlande", capital: "Dublin" },
  { id: "CZE", name: "République tchèque", capital: "Prague" },
  { id: "HUN", name: "Hongrie", capital: "Budapest" },
  { id: "ROU", name: "Roumanie", capital: "Bucarest" },
  { id: "UKR", name: "Ukraine", capital: "Kiev" },
  { id: "BLR", name: "Biélorussie", capital: "Minsk" },
  { id: "RUS", name: "Russie", capital: "Moscou" },
  { id: "TUR", name: "Turquie", capital: "Ankara" },
  { id: "BGR", name: "Bulgarie", capital: "Sofia" },
  { id: "HRV", name: "Croatie", capital: "Zagreb" },
  { id: "SRB", name: "Serbie", capital: "Belgrade" },
  { id: "BIH", name: "Bosnie-Herzégovine", capital: "Sarajevo" },
  { id: "MKD", name: "Macédoine du Nord", capital: "Skopje" },
  { id: "ALB", name: "Albanie", capital: "Tirana" },
  { id: "MNE", name: "Monténégro", capital: "Podgorica" },
  { id: "KOS", name: "Kosovo", capital: "Pristina" },
  { id: "MDA", name: "Moldavie", capital: "Chișinău" },
  { id: "LTU", name: "Lituanie", capital: "Vilnius" },
  { id: "LVA", name: "Lettonie", capital: "Riga" },
  { id: "EST", name: "Estonie", capital: "Tallinn" },
  { id: "SVK", name: "Slovaquie", capital: "Bratislava" },
  { id: "SVN", name: "Slovénie", capital: "Ljubljana" },
  { id: "MLT", name: "Malte", capital: "La Valette" },
  { id: "CYP", name: "Chypre", capital: "Nicosie" },
  { id: "LUX", name: "Luxembourg", capital: "Luxembourg" },
  { id: "LIE", name: "Liechtenstein", capital: "Vaduz" },
  { id: "AND", name: "Andorre", capital: "Andorre-la-Vieille" },
  { id: "SMR", name: "Saint-Marin", capital: "Saint-Marin" },
  { id: "VAT", name: "Vatican", capital: "Cité du Vatican" },
  { id: "ISL", name: "Islande", capital: "Reykjavik" },
];

// NOUVELLE URL POINTANT VERS LE FICHIER LOCAL DANS LE DOSSIER 'public'
const geoUrl = "/world-50m.json";

export default function QuizEuropePrototype() {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [guessedCountries, setGuessedCountries] = useState(new Set());
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState("");
  const [timer, setTimer] = useState(240); // 4 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false); // État pour suivre le chargement de la carte

  // Test de connectivité générique (peut être retiré une fois le problème résolu)
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => console.log("Test Fetch OK (pour info):", data))
      .catch((error) => console.error("Test Fetch Erreur (pour info):", error));
  }, []);

  // Timer
  useEffect(() => {
    if (gameStarted && timer > 0 && !gameOver) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && gameStarted) {
      setGameOver(true);
    }
  }, [gameStarted, timer, gameOver]);

  // Sélectionner un nouveau pays
  const selectRandomCountry = useCallback(() => {
    const unguessedCountries = europeCountries.filter(
      (country) => !guessedCountries.has(country.id)
    );

    if (unguessedCountries.length > 0) {
      const randomIndex = Math.floor(Math.random() * unguessedCountries.length);
      setCurrentCountry(unguessedCountries[randomIndex]);
      setUserInput("");
      setShowHint("");
      setHintsUsed(0); // Réinitialiser les indices pour chaque nouveau pays
      setFeedback("");
    } else {
      setGameOver(true); // Tous les pays devinés
    }
  }, [guessedCountries]);

  // Démarrer le jeu
  const startGame = () => {
    setGameStarted(true);
    setGuessedCountries(new Set());
    setScore(0);
    setTimer(240);
    setGameOver(false);
    selectRandomCountry(); // Sélectionne le premier pays au démarrage
  };

  // Normaliser les réponses (enlever accents, casse, espaces, tirets)
  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-\s]/g, "");
  };

  // Valider la réponse
  const handleGuess = () => {
    if (!currentCountry || !userInput.trim()) return;

    const normalizedInput = normalizeString(userInput);
    const normalizedCountry = normalizeString(currentCountry.name);

    if (normalizedInput === normalizedCountry) {
      setGuessedCountries((prev) => new Set([...prev, currentCountry.id]));
      setScore((prev) => prev + 1);
      setFeedback("✅ Correct !");
      setTimeout(() => {
        selectRandomCountry();
      }, 1000);
    } else {
      setFeedback("❌ Essayez encore...");
      setUserInput("");
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  // Obtenir un indice
  const getHint = () => {
    if (!currentCountry || hintsUsed >= 2) return;

    if (hintsUsed === 0) {
      setShowHint(`Capitale: ${currentCountry.capital}`);
    } else if (hintsUsed === 1) {
      setShowHint(
        `Première lettre: ${currentCountry.name ? currentCountry.name[0] : ""}`
      );
    }

    setHintsUsed((prev) => prev + 1);
  };

  // Passer au pays suivant
  const skipCountry = () => {
    if (currentCountry) {
      selectRandomCountry();
    }
  };

  // Formater le temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Gérer la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleGuess();
    }
  };

  // Style des pays sur la carte
  const getCountryStyle = (geo) => {
    const countryId = geo.properties.ISO_A3;

    if (currentCountry && countryId === currentCountry.id) {
      return {
        default: { fill: "#ef4444", stroke: "#ffffff", strokeWidth: 2 },
        hover: { fill: "#dc2626", stroke: "#ffffff", strokeWidth: 2 },
        pressed: { fill: "#b91c1c", stroke: "#ffffff", strokeWidth: 2 },
      };
    } else if (guessedCountries.has(countryId)) {
      return {
        default: { fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 1 },
        hover: { fill: "#2563eb", stroke: "#ffffff", strokeWidth: 1 },
        pressed: { fill: "#1d4ed8", stroke: "#ffffff", strokeWidth: 1 },
      };
    } else {
      return {
        default: { fill: "#e5e7eb", stroke: "#ffffff", strokeWidth: 1 },
        hover: { fill: "#d1d5db", stroke: "#ffffff", strokeWidth: 1 },
        pressed: { fill: "#9ca3af", stroke: "#ffffff", strokeWidth: 1 },
      };
    }
  };

  // Écran d'accueil
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-sm w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Quiz Géographie Europe
          </h1>
          <p className="text-gray-600 mb-6 text-sm">
            Un pays est mis en rouge sur la carte. Devinez son nom !
          </p>
          <div className="space-y-2 mb-6 text-sm text-gray-500">
            <p>• {europeCountries.length} pays à deviner</p>
            <p>• 2 indices par pays max</p>
            <p>• 4 minutes au total</p>
          </div>
          <button
            onClick={startGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Commencer le Quiz
          </button>
        </div>
      </div>
    );
  }

  // Écran de fin
  if (gameOver) {
    const percentage = Math.round((score / europeCountries.length) * 100);
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Quiz Terminé !
          </h2>
          <div className="mb-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {score}/{europeCountries.length}
            </div>
            <p className="text-gray-600 mb-2">Vous avez trouvé {score} pays</p>
            <div className="text-lg font-semibold">
              {percentage >= 80
                ? "🏆 Excellent !"
                : percentage >= 60
                ? "👍 Bien joué !"
                : percentage >= 40
                ? "🤔 Pas mal !"
                : "📚 À revoir !"}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {percentage}% de réussite
            </p>
          </div>
          <button
            onClick={startGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  // Interface de jeu
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header mobile-first */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex justify-between items-center text-sm">
          <div className="font-bold text-red-600">⏰ {formatTime(timer)}</div>
          <div className="font-bold text-blue-600">
            📊 {score}/{europeCountries.length}
          </div>
          <div className="text-gray-600">💡 {2 - hintsUsed}</div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-4 max-w-4xl mx-auto">
        {/* Instructions et contrôles */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-lg font-bold text-center text-gray-800 mb-4">
            Quel est ce pays en rouge ?
          </h3>

          {/* Zone d'indice */}
          {showHint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 font-medium text-center">
                💡 {showHint}
              </p>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`text-center font-bold mb-4 ${
                feedback.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedback}
            </div>
          )}

          {/* Input et boutons */}
          <div className="space-y-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez le nom du pays..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              autoFocus
            />

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleGuess}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Deviner
              </button>
              <button
                onClick={getHint}
                disabled={hintsUsed >= 2}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Indice ({2 - hintsUsed})
              </button>
              <button
                onClick={skipCountry}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Passer
              </button>
            </div>
          </div>
        </div>

        {/* Carte */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <MapChart />
        </div>

        {/* Légende mobile-friendly */}
        <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>À deviner</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Trouvés</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Autres</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
