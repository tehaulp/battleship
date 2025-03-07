"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateGame() {
  const [gameName, setGameName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";

  const handleCreateGame = async () => {
    if (!gameName) {
      alert("Veuillez entrer un nom de partie.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/create-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: gameName, player_one_username: username }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.error) {
      alert("Erreur lors de la création de la partie.");
    } else if (data.game_id) {
      router.push(`/game/${data.game_id}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Créer une partie</h1>
      <input
        type="text"
        placeholder="Nom de la partie"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        className="mt-4 p-2 border rounded"
      />
      <button
        onClick={handleCreateGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        disabled={loading}
      >
        {loading ? "Création..." : "Créer"}
      </button>
    </div>
  );
}
