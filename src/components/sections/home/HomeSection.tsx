interface HomeSectionProps {
  changeSection: CallableFunction;
}

export default function HomeSection({ changeSection }: HomeSectionProps) {
  return (
    <section className="flex flex-col space-y-4 text-2xl text-white items-center">
      <button
        onClick={() => changeSection("create")}
        className="w-34 drop-shadow-lg hover:drop-shadow-md cursor-pointer hover:text-gray-300"
      >
        Créer
      </button>
      <button
        onClick={() => changeSection("join")}
        className="w-34 drop-shadow-lg hover:drop-shadow-md cursor-pointer hover:text-gray-300"
      >
        Rejoindre
      </button>
    </section>
  );
}
