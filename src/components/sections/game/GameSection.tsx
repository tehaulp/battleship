import Game from "./Game";

interface GameSectionProps{
  changeSection: CallableFunction
}

export default function GameSection({changeSection}: GameSectionProps) {
  return (
    <section>
      <Game changeSection={changeSection}></Game>
    </section>
  );
}