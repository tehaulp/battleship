"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Game = {
  game_id: string;
  game_name: string;
  host_username: string;
  game_status: string;
};

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchGames() {
      const res = await fetch("/api/games");
      const data = await res.json();
      setGames(data);
      setLoading(false);
    }

    fetchGames();
  }, []);

  const handleCreateGame = () => {
    if (!username) {
      alert("Veuillez entrer un nom d'utilisateur avant de créer une partie.");
      return;
    }
    router.push(`/create-game?username=${username}`);
  };

  const handleJoinGame = () => {
    if (!username) {
      alert("Veuillez entrer un nom d'utilisateur avant de rejoindre une partie.");
      return;
    }
    router.push(`/join-game?username=${username}`);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Bataille Navale</h1>
      <h2 className="mt-4 text-xl">Choisissez une action :</h2>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <div className="mt-6">
        <button
          onClick={handleCreateGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mr-4"
        >
          Créer une partie
        </button>
        <button
          onClick={handleJoinGame}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Rejoindre une partie
        </button>
      </div>

      <h2 className="mt-8 text-xl">Jeux en cours :</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : games.length > 0 ? (
        <ul className="mt-2">
          {games.map((game) => (
            <li key={game.game_id} className="mt-2">
              <span className="font-bold">{game.game_name}</span> (Hôte : {game.host_username} - Status: {game.game_status} )
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun jeu en cours.</p>
      )}
    </main>
  );
}
