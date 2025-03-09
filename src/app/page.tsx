"use client";
import Page from "@/components/Page";
import { useState } from "react";

export default function Home() {
  const [page, setPage] = useState("home");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Battleship</h1>

      <Page page={page} changePage={setPage}></Page>
      
    </main>
  );
}