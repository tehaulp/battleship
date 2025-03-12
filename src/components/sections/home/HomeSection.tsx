import Image from "next/image";

interface HomeSectionProps {
  changeSection: CallableFunction;
}

export default function HomeSection({ changeSection }: HomeSectionProps) {
  return (
    <section className="flex flex-col space-y-4 text-2xl text-white items-center">
      <Image
        src="/img/icon-title.png"
        alt="tet"
        width={800}
        height={800}
        className="drop-shadow-xl px-4 pointer-events-none"
      ></Image>
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