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
  const [playerUsername, setPlayerUsername] = useState<string | null>(null);
  const [enemyUsername, setEnemyUsername] = useState<string | null>(null);
  const [winnerUsername, setWinnerUsername] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status == "placing") {
      SceneManager.createGrid(false);
      fetchEnemyUsername();
    }

    if (status == "playing") {
      SceneManager.createGrid(true);
    }

    async function fetchEnemyUsername() {
      console.log("lol");
      const { data, error } = await supabase
        .from("status")
        .select("player_one_username, player_two_username")
        .eq("id", gameId)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du statut :", error);
        setStatus("undefined");
      } else {
        setEnemyUsername(
          playerUsername === data.player_one_username
            ? data.player_two_username
            : data.player_one_username
        );
      }
    }
  }, [status, gameId, playerUsername]);

  useEffect(() => {
    const storedGameId = localStorage.getItem("gameId");
    const storedPlayerId = localStorage.getItem("playerId");

    if (storedGameId && storedPlayerId) {
      setGameId(storedGameId);
      setPlayerId(storedPlayerId);
      setPlayerUsername(localStorage.getItem("playerUsername"));
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
          getLastInfo();
        }
      )
      .subscribe();

    async function getLastInfo() {
      try {
        const res = await fetch("/api/last-info", {
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
        if (data.code === "200") {
          if (data.last_hit) {
            setLastEnemyShot(data.last_shot);
          }

          if (data.winner_username) {
            setWinnerUsername(data.winner_username);
          }
          setTurn(data.turn);
          return;
        } else {
          console.error("Impossible de rejoindre la partie :", data.message);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la connexion à la base de données: ",
          error
        );
      }
    }

    function setLastEnemyShot(position: string) {
      SceneManager.setBoatHit(position, false);
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, playerId]);

  async function handleCopy() {
    console.log(
      "handleCopy exécuté ! Côté client :",
      typeof window !== "undefined"
    );

    if (typeof window === "undefined" || !navigator.clipboard) {
      console.error("L'API Clipboard n'est pas disponible.");
      return;
    }

    if (!gameId) {
      console.error("Aucun ID de partie disponible");
      return;
    }

    try {
      await navigator.clipboard.writeText(gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie :", err);
    }
  };

  if (!gameId) return <p>Erreur: Aucune partie trouvée</p>;
  if (!playerId)
    return <p>Erreur : Vous ne faites pas partie de cette partie.</p>;

  return (
    <div>
      <p
        className="absolute top-2 left-2 text-sm cursor-pointer"
        onClick={handleCopy}
      >
        {gameId}
        {copied && <span className="text-sm text-gray-800 ml-2">copié</span>}
      </p>
      <p className="absolute top-12 left-2 text-xl">{playerUsername}</p>
      <p className="absolute top-12 right-2 text-xl">{enemyUsername}</p>

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
          <h2 className="absolute top-5 left-1/2 transform -translate-x-1/2 text-3xl font-bold">
            Salle d&apos;attente
          </h2>
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
            <p className="text-2xl font-bold">{winnerUsername}</p>
          </div>
          <button
            onClick={() => changeSection("home")}
            className="text-lg bg-gray-600 p-2 hover:bg-red-500"
          >
            Retour au menu
          </button>
        </>
      )}
    </div>
  );
}
