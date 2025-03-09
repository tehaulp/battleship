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
        }),
      });
      const data = await res.json();

      if (data.code === "200") {
        localStorage.setItem("gameId", data.game_id);
        localStorage.setItem("playerId", data.player_id);
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
      <h1>Créer une Partie</h1>

      <div>
        {/* Player Username */}
        <label htmlFor="playerUsername">Votre pseudo</label>
        <input
          id="playerUsername"
          type="text"
          placeholder="Entrez votre pseudo..."
          value={playerUsername}
          onChange={(e) => setPlayerUsername(e.target.value)}
        />

        {/* Game Name */}
        <label htmlFor="gameName">Nom de la partie</label>
        <input
          id="gameName"
          type="text"
          placeholder="Entrez un nom..."
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />

        {/* Buttons */}
        <div>
          <button onClick={() => createGame(gameName, playerUsername)}>
            Créer
          </button>

          <button onClick={() => changeSection("home")}>
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </section>
  );
}