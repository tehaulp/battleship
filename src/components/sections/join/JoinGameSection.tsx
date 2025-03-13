"use client";

import { useEffect, useState, useRef } from "react";
import GameList from "./GameList";

interface JoinGameSectionProps {
  changeSection: CallableFunction;
}

export interface Game {
  game_id: string;
  game_name: string;
  host_username: string;
  game_status: "waiting" | "in_progress";
}

export default function JoinGameSection({
  changeSection,
}: JoinGameSectionProps) {
  const [gameId, setGameId] = useState("");
  const [playerUsername, setPlayerUsername] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const joinGame = async (gameId: string, playerUsername: string) => {
    if (!gameId || !playerUsername) {
      alert("Le pseudo et l'ID de la partie sont obligatoires.");
      return;
    }

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_id: gameId,
          player_username: playerUsername,
        }),
      });
      const data = await res.json();
      if (data.code === "200") {
        localStorage.setItem("gameId", data.game_id);
        localStorage.setItem("playerId", data.player_id);
        changeSection('game');
      } else {
        console.error("Impossible de rejoindre la partie :", data.message);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la tentative de rejoindre la partie :",
        error
      );
    }
  };

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/games");
      const data: Game[] = await res.json();
      setGames(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des parties :", error);
    }
  };

  useEffect(() => {
    if (!intervalRef.current) {
      fetchGames();
      intervalRef.current = setInterval(fetchGames, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <section>
      <h2 className="absolute top-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-y-3 text-3xl font-bold">
        Rejoindre une Partie
      </h2>

      <div className="flex flex-col gap-y-6 items-center">
        {/* Player Username */}
        <div className="flex flex-row gap-x-3 text-xl justify-center items-center">
          <label htmlFor="playerUsername">Votre pseudo</label>
          <input
            id="playerUsername"
            type="text"
            placeholder="Entrez votre pseudo..."
            value={playerUsername}
            onChange={(e) => setPlayerUsername(e.target.value)}
            className="p-2 border"
          />
        </div>

        {/* Game ID */}
        <div className="flex flex-row gap-x-3 text-xl justify-center items-center">
          <label htmlFor="gameId">ID de la partie</label>
          <input
            id="gameId"
            type="text"
            placeholder="Ex: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="p-2 border"
          />
        </div>

        {/* Join Button */}
        <div className="flex flex-row gap-x-3 text-xl justify-center items-center">
          <button
            onClick={() => joinGame(gameId, playerUsername)}
            className="bg-gray-600 p-2 hover:bg-blue-500"
          >
            Rejoindre via ID
          </button>
        </div>
      </div>

      {/* Game List */}
      <div className="mt-6">
        <GameList
          games={games}
          joinGame={joinGame}
          playerUsername={playerUsername}
        />
      </div>

      {/* Back to Home Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => changeSection("home")}
          className="bg-gray-600 p-2 hover:bg-red-500"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    </section>

  );
}
