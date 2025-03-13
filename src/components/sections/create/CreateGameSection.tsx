"use client";

import { useState } from "react";

interface CreateGameSectionProps {
  changeSection: CallableFunction;
}

export default function CreateGameSection({
  changeSection,
}: CreateGameSectionProps) {
  const [gameName, setGameName] = useState("");
  const [playerUsername, setPlayerUsername] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const createGame = async (gameName: string, playerUsername: string) => {
    if (!gameName || !playerUsername) {
      alert("Le pseudo et le nom de la partie sont obligatoires.");
      return;
    }

    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: gameName,
          player_one_username: playerUsername,
          isPrivate: isPrivate,
        }),
      });
      const data = await res.json();

      if (data.code === "200") {
        localStorage.setItem("gameId", data.game_id);
        localStorage.setItem("playerId", data.player_id);
        localStorage.setItem("playerUsername", playerUsername);
        changeSection('game');
      } else {
        console.error("Impossible de créer la partie :", data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la partie :", error);
    }
  };

  return (
    <section>
      <h1 className="absolute top-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-y-3 text-3xl font-bold">Créer une Partie</h1>

      <div className="flex flex-col gap-y-6 items-center">
        {/* Player Username */}
        <div className="flex flex-row gap-x-3 text-xl justify-center items-center">
          <label htmlFor="playerUsername">Pseudo:</label>
          <input
            id="playerUsername"
            type="text"
            placeholder="Entrez votre pseudo..."
            value={playerUsername}
            onChange={(e) => setPlayerUsername(e.target.value)}
            className="p-2 border"
          />
        </div>

        {/* Game Name */}
        <div className="flex flex-row gap-x-3 text-xl justify-center items-center">
          <label htmlFor="gameName">Nom de la partie:</label>
          <input
            id="gameName"
            type="text"
            placeholder="Entrez un nom..."
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="p-2 border"
          />
        </div>

        <div className="flex flex-row gap-x-3 text-xl justify-center items-center">
        <label htmlFor="privacyToggle">Visibilité :</label>
        <button
          id="privacyToggle"
          onClick={() => setIsPrivate(!isPrivate)}
          className={`p-2 border ${
            isPrivate ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
          }`}
        >
          {isPrivate ? "Privé" : "Public"}
        </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-x-4 text-xl justify-center">
          <button onClick={() => createGame(gameName, playerUsername)} className="bg-gray-600 p-2 hover:bg-blue-500">
            Créer
          </button>

          <button onClick={() => changeSection("home")} className="bg-gray-600 p-2 hover:bg-red-500">
            Retour
          </button>
        </div>
      </div>
    </section>
  );
}