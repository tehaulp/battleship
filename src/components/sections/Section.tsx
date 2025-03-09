import CreateGameSection from "./create/CreateGameSection";
import GameSection from "./game/GameSection";
import HomeSection from "./home/HomeSection";
import JoinGameSection from './join/JoinGameSection';

interface SectionProps {
  section: string,
  changeSection: CallableFunction
};

export default function Section({section, changeSection}: SectionProps) {
  switch (section) {
    case 'home':
      return <HomeSection changeSection={changeSection}></HomeSection>;
    case 'join':
      return <JoinGameSection changeSection={changeSection}></JoinGameSection>;
    case 'create':
      return <CreateGameSection changeSection={changeSection}></CreateGameSection>;
    case 'game':
      return <GameSection changeSection={changeSection}></GameSection>;
    default:
      return <HomeSection changeSection={changeSection}></HomeSection>;
  }
}