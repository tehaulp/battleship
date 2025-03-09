"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BoatsPlacementGrid from "@/components/grids/placing/BoatsPlacementGrid";

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const [status, setStatus] = useState<string>("waiting");
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const storedPlayerId = localStorage.getItem("playerId");
    if (storedPlayerId) {
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
        setStatus('undefined');
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, playerId]);

  if (!gameId) return <p>Erreur : Aucun ID de partie trouvé.</p>;
  if (!playerId)
    return <p>Erreur : Vous ne faites pas partie de cette partie.</p>;

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <p className="text-center mb-4">ID du joueur : {playerId}</p>

        {/* Status Undefined */}
        {status === "undefined" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Aucune partie trouvée</h1>
            <Link
              href="/"
              className="w-full text-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition shadow-md"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        )}

        {/* Status Waiting */}
        {status === "waiting" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Salle d&apos;attente</h1>
            <p className="text-lg">En attente d&apos;un adversaire...</p>
          </div>
        )}

        {/* Status Placing */}
        {status === "placing" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Placement des bateaux</h1>
            <p className="text-lg">Placez vos bateaux sur la grille</p>
            <BoatsPlacementGrid
              gameId={gameId}
              playerId={playerId}
            ></BoatsPlacementGrid>
          </div>
        )}

        {/* Status Playing */}
        {status === "playing" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">
              La partie est en cours !
            </h1>
            <p className="text-lg">C&apos;est le moment de jouer !</p>
          </div>
        )}

        {/* Status Finished */}
        {status === "finished" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">La partie est terminée</h1>
            <p className="text-lg">Le gagnant est déterminé !</p>
          </div>
        )}
      </div>
    </>
  );
}
