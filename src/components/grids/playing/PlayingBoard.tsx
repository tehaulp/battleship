"use client";

import { useState } from "react";
import Grid from "../Grid";

interface PlayingBoardProps {
  gameId: string;
  playerId: string;
  board: string[];
  enemyBoard: string[];
  setEnemyBoard: CallableFunction;
  turn: boolean;
}

export default function PlayingBoard({
  gameId,
  playerId,
  board,
  enemyBoard,
  setEnemyBoard,
  turn,
}: PlayingBoardProps) {
  const [hits, setHits] = useState<string[]>([]);

  const shoot = async (position: string) => {
    try {
      const res = await fetch("/api/shoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: gameId,
          player_id: playerId,
          position: position,
        }),
      });
      const data = await res.json();
      if (data.code !== "200") throw new Error(data.message);

      setEnemyBoard([...enemyBoard, position]);

      if (data.hit) {
        alert("touché !");
        setHits([...hits, position]);
      } else {
        alert("raté !");
      }
    } catch (error) {
      console.log("Erreur lors de la connexion à la base de données: " + error);
    }
  };

  const handleEnemyCellClick = async (cellId: string) => {
    if (!turn) {
      alert("Ce n'est pas votre tour !");
      return;
    }

    if (enemyBoard.includes(cellId)) {
      alert("Vous avez déjà tiré ici");
      return;
    }

    shoot(cellId);
  };

  return (
    <div>
      <Grid
        board={enemyBoard}
        handleCellClick={handleEnemyCellClick}
        hits={hits}
      ></Grid>
    </div>
  );
}