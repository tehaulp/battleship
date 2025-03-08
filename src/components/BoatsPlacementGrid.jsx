"use client";

import React, { useState } from "react";
import Grid from "./Grid"; // Importation du composant Grid

export default function BoatsPlacementGrid({ gameId, playerId }) {
  const [board, setBoard] = useState([]); // Liste des positions des bateaux
  const [isConfirmed, setIsConfirmed] = useState(false); // Si le placement est confirmé

  const handleCellClick = (cellId) => {
    if (board.includes(cellId)) {
      // Si le bateau est déjà placé, retirer la cellule de la liste
      setBoard(board.filter((cell) => cell !== cellId));
    } else {
      // Si moins de 10 bateaux, ajouter la cellule
      if (board.length < 10) {
        setBoard([...board, cellId]);
      }
    }
  };

  const handleConfirm = async () => {
    // Confirmer si 10 bateaux sont placés
    if (board.length === 10) {
      setIsConfirmed(true);
      alert("Bateaux placés, vous pouvez enregistrer les positions.");

      try {
        const res = await fetch("/api/boats/place", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            game_id: gameId,
            player_id: playerId,
            boats: board,
          }),
        });
        const data = await res.json();
        console.log(data);

        if (data.code !== "200") {
          console.error("Impossible de placer les bateaux :", data.message);
        }
      } catch (error) {
        console.error("Erreur lors des placements des bateaux :", error);
      }
    } else {
      alert("Il vous faut placer exactement 10 bateaux.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      {/* Grille de placement */}
      <Grid board={board} handleCellClick={handleCellClick} />

      {/* Info sur le placement */}
      <div className="mt-6">
        <p className="text-lg">
          Vous avez {board.length} bateaux placés. Il vous faut en placer 10.
        </p>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={handleConfirm}
          disabled={board.length !== 10}
        >
          Confirmer le placement
        </button>
      </div>

      {/* Confirmation */}
      {isConfirmed && (
        <div className="mt-6 bg-green-500 p-4 rounded-lg text-center">
          <p className="text-xl text-white">Placement confirmé !</p>
        </div>
      )}
    </div>
  );
}
