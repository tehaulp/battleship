"use client";

import { useState } from "react";
import Grid from "../Grid";
import { SceneManager } from "@/lib/SceneManager";

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
        setHits([...hits, position]);
        SceneManager.addBoat(position, true);
        setTimeout(() => { SceneManager.setBoatHit(position, true); }, 200)
      }
    } catch (error) {
      console.log("Erreur lors de la connexion à la base de données: " + error);
    }
  };

  const handleEnemyCellClick = async (cellId: string) => {
    if (!turn) {
      return;
    }

    if (enemyBoard.includes(cellId)) {
      return;
    }

    shoot(cellId);
  };

  return (
    <>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        {turn ? <p className="text-yellow-600 font-semibold">Tirez !</p> : <p>Patientez...</p>}

        <Grid
          board={enemyBoard}
          handleCellClick={handleEnemyCellClick}
          hits={hits}
          turn={turn}
        ></Grid>
      </div>
    </>
  );
}