interface HomeSectionProps {
  changeSection: CallableFunction;
}

export default function HomeSection({ changeSection }: HomeSectionProps) {
  return (
    <section>
      <button onClick={() => changeSection("create")}>Créer une game</button>
      <button onClick={() => changeSection("join")}>Rejoindre une game</button>
    </section>
  );
}