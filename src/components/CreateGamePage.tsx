"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface JoinGamePageProps {
  changePage: CallableFunction;
}

export default function CreateGamePage({ changePage }: JoinGamePageProps) {
  const [gameName, setGameName] = useState("");
  const [playerUsername, setPlayerUsername] = useState("");
  const router = useRouter();

  const createGame = async (gameName: string, playerUsername: string) => {
    if (!gameName || !playerUsername) {
      alert("Le pseudo et le nom de la partie sont obligatoires.");
      return;
    }

    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: gameName,
          player_one_username: playerUsername,
        }),
      });
      const data = await res.json();

      if (data.code === "200") {
        localStorage.setItem("playerId", data.player_id);
        router.push(`/game/${data.game_id}`);
      } else {
        console.error("Impossible de créer la partie :", data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la partie :", error);
    }
  };

  return (
    <>
      <Head>
        <title>Créer une partie - Bataille Navale</title>
        <meta
          name="description"
          content="Créez une partie de Bataille Navale et affrontez vos amis en ligne."
        />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-6">Créer une Partie</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          {/* Player Username */}
          <label htmlFor="playerUsername" className="block text-lg mb-2">
            Votre pseudo
          </label>
          <input
            id="playerUsername"
            type="text"
            placeholder="Entrez votre pseudo..."
            value={playerUsername}
            onChange={(e) => setPlayerUsername(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          {/* Game Name */}
          <label htmlFor="gameName" className="block text-lg mb-2">
            Nom de la partie
          </label>
          <input
            id="gameName"
            type="text"
            placeholder="Entrez un nom..."
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-4">
            <button
              onClick={() => createGame(gameName, playerUsername)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition shadow-md"
            >
              Créer
            </button>

            <button
              onClick={() => changePage("home")}
              className="mt-6 w-full max-w-md text-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition shadow-md"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
