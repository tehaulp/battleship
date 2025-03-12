"use client";

import React, { useState } from "react";
import Grid from "../Grid";
import { SceneManager } from "@/lib/SceneManager";

interface BoatsPlacementGridProps {
  gameId: string;
  playerId: string;
  board: string[];
  setBoard: CallableFunction;
}

export default function BoatsPlacementGrid({
  gameId,
  playerId,
  board,
  setBoard,
}: BoatsPlacementGridProps) {
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(false);

  const handleCellClick = (cellId: string) => {
    const isCellPlaced = board.includes(cellId);

    if (isCellPlaced) {
      // Retirer le bateau si la cellule est déjà dans le tableau
      SceneManager.removeBoat(cellId, false);
      setBoard((prevBoard: string[]) =>
        prevBoard.filter((cell) => cell !== cellId)
      );
    } else if (board.length < 10) {
      // Ajouter le bateau si la cellule n'est pas déjà dans le tableau et qu'il y a de la place
      SceneManager.addBoat(cellId, false);
      setBoard((prevBoard: string[]) => [...prevBoard, cellId]);
    }
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
      setErrorMessage(
        "Impossible de placer les bateaux : " +
          (error instanceof Error ? error.message : "Erreur inconnue")
      );
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
      setErrorMessage(
        "Impossible de retirer les bateaux : " +
          (error instanceof Error ? error.message : "Erreur inconnue")
      );
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
    <div>
      <Grid board={board} handleCellClick={handleCellClick} hits={[]} />

      <div>
        <p>
          Vous avez {board.length} bateaux placés. Il vous faut en placer 10.
        </p>

        {errorMessage && <p>{errorMessage}</p>}

        <button
          className={
            loading || board.length !== 10 || cooldown
              ? "bg-gray-500 cursor-not-allowed"
              : isReady
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }
          onClick={handleConfirm}
          disabled={loading || board.length !== 10 || cooldown}
        >
          {loading ? "Chargement..." : isReady ? "Annuler" : "Confirmer"}
        </button>
      </div>
    </div>
  );
}
