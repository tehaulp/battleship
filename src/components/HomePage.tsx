interface HomePageProps {
  changePage: CallableFunction;
}

export default function HomePage({ changePage }: HomePageProps) {
  return (
    <section className="space-y-4">
      <button
        onClick={() => changePage("create")}
        className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
      >
        Créer une game
      </button>
      <button
        onClick={() => changePage("join")}
        className="block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition"
      >
        Rejoindre une game
      </button>
    </section>
  );
}
