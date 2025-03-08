"use client";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Game {
  game_id: string;
  game_name: string;
  host_username: string;
  game_status: "waiting" | "in_progress";
}

export default function JoinGame() {
  const [gameId, setGameId] = useState("");
  const [playerUsername, setPlayerUsername] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const router = useRouter();

  const joinGame = async (gameId: string, playerUsername: string) => {
    // Validation des champs obligatoires
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
        body: JSON.stringify({ game_id: gameId, player_username: playerUsername }),
      });
      const data = await res.json();
      if (data.code === "200") {
        localStorage.setItem("playerId", data.player_id);
        router.push(`/game/${gameId}`);
      } else {
        console.error("Impossible de rejoindre la partie :", data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la tentative de rejoindre la partie :", error);
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
    fetchGames();
    setInterval(fetchGames, 5000);
  }, []);

  return (
    <>
      <Head>
        <title>Rejoindre une partie - Bataille Navale</title>
        <meta
          name="description"
          content="Rejoignez une partie de Bataille Navale en entrant un ID ou en choisissant une game en cours."
        />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-6">Rejoindre une Partie</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
          <label htmlFor="playerUsername" className="block text-lg mb-2">
            Votre pseudo
          </label>
          <input
            id="playerUsername"
            type="text"
            placeholder="Entrez votre pseudo..."
            value={playerUsername}
            onChange={(e) => setPlayerUsername(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          
          <label htmlFor="gameId" className="block text-lg mb-2">
            Entrer l&apos;ID d&apos;une game
          </label>
          <input
            id="gameId"
            type="text"
            placeholder="Ex: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => joinGame(gameId, playerUsername)}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition shadow-md"
          >
            Rejoindre via ID
          </button>
        </div>

        <GameList games={games} joinGame={joinGame} playerUsername={playerUsername} />

        <Link
          href="/"
          className="mt-6 w-full max-w-md text-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition shadow-md"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
    </>
  );
}

function GameList({
  games,
  joinGame,
  playerUsername,
}: {
  games: Game[];
  joinGame: (gameId: string, playerUsername: string) => void;
  playerUsername: string;
}) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Parties en cours</h2>
      <ul className="space-y-4">
        {games.map((game) => (
          <li key={game.game_id} className="bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="text-lg font-bold">{game.game_name}</p>
              <p className="text-sm text-gray-400">Hôte: {game.host_username}</p>
              <p className={`text-sm font-semibold ${game.game_status === "waiting" ? "text-green-400" : "text-yellow-400"}`}>
                {game.game_status}
              </p>
            </div>
            <button
              onClick={() => joinGame(game.game_id, playerUsername)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition shadow-md"
            >
              Rejoindre
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}