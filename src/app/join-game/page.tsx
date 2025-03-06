"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function JoinGame() {
  const [gameId, setGameId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";

  const handleJoinGame = async () => {
    if (!gameId) {
      alert("Veuillez entrer un ID de partie.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/join-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ game_id: gameId, player_username: username }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.error) {
      alert("Erreur lors de la tentative de rejoindre la partie.");
    } else {
      router.push(`/game/${data.game_id}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Rejoindre une partie</h1>
      <input
        type="text"
        placeholder="ID de la partie"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        className="mt-4 p-2 border rounded"
      />
      <button
        onClick={handleJoinGame}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
        disabled={loading}
      >
        {loading ? "Rejoindre..." : "Rejoindre"}
      </button>
    </div>
  );
}
