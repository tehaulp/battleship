"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string; // Récupérer l'ID de la game depuis l'URL
  const [status, setStatus] = useState<string>("waiting");

  useEffect(() => {
    if (!gameId) return;

    // Créer un canal pour écouter les changements sur la table status
    const channel = supabase
      .channel(`status-${gameId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "status", filter: `id=eq.${gameId}` },
        (payload) => {
          console.log("Changement de statut détecté : ", payload);
          // Mettre à jour le statut en fonction du changement
          setStatus(payload.new.status);
        }
      )
      .subscribe();

    // Nettoyage lors du démontage du composant
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  if (!gameId) return <p>Erreur : Aucun ID de partie trouvé.</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {status === "waiting" && (
        <>
          <h1 className="text-2xl font-bold">Salle d&aposattente</h1>
          <p className="mt-4 text-lg">En attente d&aposun adversaire...</p>
        </>
      )}
      {status === "placing" && (
        <>
          <h1 className="text-2xl font-bold">Placement des bateaux</h1>
          <p className="mt-4 text-lg">Placez vos bateaux sur la grille</p>
          {/* Ajoute ton composant de placement ici */}
        </>
      )}
      {status === "playing" && (
        <>
          <h1 className="text-2xl font-bold">La partie est en cours !</h1>
          <p className="mt-4 text-lg">C est le moment de jouer !</p>
          {/* Ajoute ton composant de jeu ici */}
        </>
      )}
      {status === "finished" && (
        <>
          <h1 className="text-2xl font-bold">La partie est terminée</h1>
          <p className="mt-4 text-lg">Le gagnant est déterminé !</p>
          {/* Affiche le gagnant ici */}
        </>
      )}
    </div>
  );
}
