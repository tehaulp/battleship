import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Bataille Navale - Jeu Multijoueur</title>
        <meta
          name="description"
          content="Jouez à la Bataille Navale en ligne avec vos amis. Créez une partie ou rejoignez-en une existante."
        />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-6">Bataille Navale</h1>

        <div className="space-y-4">
          <Link
            href="/create"
            className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Créer une game
          </Link>
          <Link
            href="/join"
            className="block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Rejoindre une game
          </Link>
        </div>
      </main>
    </>
  );
}
