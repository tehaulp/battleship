"use client";

import React, { useState } from "react";
import Grid from "./Grid";

export default function BoatsPlacementGrid({ gameId, playerId }) {
  const [board, setBoard] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(false);

  const handleCellClick = (cellId) => {
    setBoard((prevBoard) =>
      prevBoard.includes(cellId)
        ? prevBoard.filter((cell) => cell !== cellId)
        : prevBoard.length < 10
        ? [...prevBoard, cellId]
        : prevBoard
    );
  };

  const placeBoats = async () => {
    try {
      const res = await fetch("/api/boats/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: gameId,
          player_id: playerId,
          boats: board,
        }),
      });
      const data = await res.json();
      if (data.code !== "200") throw new Error(data.message);
    } catch (error) {
      setErrorMessage("Impossible de placer les bateaux : " + error.message);
      setIsReady(false);
    }
  };

  const clearBoats = async () => {
    try {
      const res = await fetch("/api/boats/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id: gameId, player_id: playerId }),
      });
      const data = await res.json();
      if (data.code !== "200") throw new Error(data.message);
    } catch (error) {
      setErrorMessage("Impossible de retirer les bateaux : " + error.message);
      setIsReady(true);
    }
  };

  const handleConfirm = async () => {
    if (board.length !== 10 || cooldown) return;

    setLoading(true);
    setErrorMessage("");
    setCooldown(true);

    if (isReady) {
      await clearBoats();
    } else {
      await placeBoats();
    }

    setIsReady(!isReady);
    setLoading(false);

    setTimeout(() => setCooldown(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <Grid board={board} handleCellClick={handleCellClick} />

      <div className="mt-6 text-center">
        <p className="text-lg">
          Vous avez {board.length} bateaux placés. Il vous faut en placer 10.
        </p>

        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

        <button
          className={`mt-4 py-2 px-4 rounded-lg font-semibold transition ${
            loading || board.length !== 10 || cooldown
              ? "bg-gray-500 cursor-not-allowed"
              : isReady
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleConfirm}
          disabled={loading || board.length !== 10 || cooldown}
        >
          {loading ? "Chargement..." : isReady ? "Annuler" : "Confirmer"}
        </button>
      </div>
    </div>
  );
}
