"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BoatsPlacementGrid from "@/components/grids/placing/BoatsPlacementGrid";
import PlayingBoard from "@/components/grids/playing/PlayingBoard";

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
      <p>{gameId}</p>

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
          <h2>Salle d&apos;attente</h2>
          <p>En attente d&apos;un adversaire...</p>
        </div>
      )}

      {/* Status Placing */}
      {status === "placing" && (
        <div>
          <h2>Placement des bateaux</h2>
          <p>Placez vos bateaux sur la grille</p>
          <BoatsPlacementGrid
            gameId={gameId}
            playerId={playerId}
            board={board}
            setBoard={setBoard}
          ></BoatsPlacementGrid>
        </div>
      )}

      {/* Status Playing */}
      {status === "playing" && (
        <div>
          <h2>La partie est en cours !</h2>
          <p>C&apos;est le moment de jouer !</p>
          <PlayingBoard
            gameId={gameId}
            playerId={playerId}
            board={board}
            enemyBoard={enemyBoard}
            setEnemyBoard={setEnemyBoard}
            turn={turn}
          ></PlayingBoard>
        </div>
      )}

      {/* Status Finished */}
      {status === "finished" && (
        <div>
          <h2>La partie est terminée</h2>
          <p>Le gagnant est déterminé !</p>
          <button onClick={() => {changeSection('home')}}>Retour au menu</button>
        </div>
      )}
    </div>
  );
}