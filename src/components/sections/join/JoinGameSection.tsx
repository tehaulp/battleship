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
      <h2>Rejoindre une Partie</h2>

      <div>
        <label htmlFor="playerUsername">Votre pseudo</label>
        <input
          id="playerUsername"
          type="text"
          placeholder="Entrez votre pseudo..."
          value={playerUsername}
          onChange={(e) => setPlayerUsername(e.target.value)}
        />

        <label htmlFor="gameId">Entrer l&apos;ID d&apos;une game</label>
        <input
          id="gameId"
          type="text"
          placeholder="Ex: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
        <button onClick={() => joinGame(gameId, playerUsername)}>
          Rejoindre via ID
        </button>
      </div>

      <GameList
        games={games}
        joinGame={joinGame}
        playerUsername={playerUsername}
      />

      <button onClick={() => changeSection("home")}>
        Retour à l&apos;accueil
      </button>
    </section>
  );
}
