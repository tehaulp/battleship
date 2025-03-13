"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BoatsPlacementGrid from "@/components/grids/placing/BoatsPlacementGrid";
import PlayingBoard from "@/components/grids/playing/PlayingBoard";
import { SceneManager } from "@/lib/SceneManager";

interface GameProps {
  changeSection: CallableFunction;
}

export default function Game({ changeSection }: GameProps) {
  const [status, setStatus] = useState<string>("waiting");
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [board, setBoard] = useState<string[]>([]);
  const [enemyBoard, setEnemyBoard] = useState<string[]>([]);
  const [turn, setTurn] = useState(false);

  useEffect(() => {
    if (status == "placing") {
      SceneManager.createGrid(false);
    }

    if (status == "playing") {
      SceneManager.createGrid(true);
    }
  }, [status]);

  useEffect(() => {
    const storedGameId = localStorage.getItem("gameId");
    const storedPlayerId = localStorage.getItem("playerId");

    if (storedGameId && storedPlayerId) {
      setGameId(storedGameId);
      setPlayerId(storedPlayerId);
    }
  }, []);

  useEffect(() => {
    if (!gameId || !playerId) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("status")
        .select("*")
        .eq("id", gameId)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du statut :", error);
        setStatus("undefined");
      } else {
        console.log("Statut récupéré :", data);
        setStatus(data.status);
      }
    };

    fetchData();

    const channel = supabase
      .channel(`status-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "status",
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          setStatus(payload.new.status);
          checkTurn();
        }
      )
      .subscribe();

    const checkTurn = async () => {
      try {
        const res = await fetch("/api/check-turn", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            game_id: gameId,
            player_id: playerId,
          }),
        });
        const data = await res.json();
        setTurn(data);
        return data;
      } catch (error) {
        console.error(
          "Erreur lors de la connexion à la base de données: ",
          error
        );
      }
    };

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, playerId]);

  if (!gameId) return <p>Erreur: Aucune partie trouvée</p>;
  if (!playerId)
    return <p>Erreur : Vous ne faites pas partie de cette partie.</p>;

  return (
    <div>
      <p className="absolute top-2 left-2 text-sm">{gameId}</p>

      {/* Status Undefined */}
      {status === "undefined" && (
        <div>
          <h2>Aucune partie trouvée</h2>
          <Link href="/">Retour à l&apos;accueil</Link>
        </div>
      )}

      {/* Status Waiting */}
      {status === "waiting" && (
        <div>
          <h2 className="absolute top-5 left-1/2 transform -translate-x-1/2 text-3xl font-bold">Salle d&apos;attente</h2>
          <p className="text-2xl">En attente d&apos;un adversaire...</p>
        </div>
      )}

      {/* Status Placing */}
      {status === "placing" && (
        <>
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-y-3">
            <h2 className="text-2xl font-bold">Placement des bateaux</h2>
            <p>Placez vos bateaux sur la grille</p>
          </div>
          <BoatsPlacementGrid
            gameId={gameId}
            playerId={playerId}
            board={board}
            setBoard={setBoard}
          />
        </>
      )}

      {/* Status Playing */}
      {status === "playing" && (
        <>
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-y-3">
            <h2 className="text-4xl font-bold">Bataillez !</h2>
            <p>C&apos;est le moment de jouer !</p>
          </div>
          <PlayingBoard
            gameId={gameId}
            playerId={playerId}
            board={board}
            enemyBoard={enemyBoard}
            setEnemyBoard={setEnemyBoard}
            turn={turn}
          />
        </>
      )}

      {/* Status Finished */}
      {status === "finished" && (
        <>
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-y-3">
            <h2 className="text-3xl font-bold">La partie est terminée</h2>
            <p className="text-xl">Le gagnant est:</p>
          </div>
          <button onClick={() => changeSection("home")} className="text-lg bg-gray-600 p-2 hover:bg-red-500">Retour au menu</button>
        </>
      )}
    </div>
  );
}