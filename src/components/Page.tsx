import CreateGamePage from "./CreateGamePage";
import HomePage from "./HomePage";
import JoinGamePage from './JoinGamePage';

interface PageProps {
  page: string,
  changePage: CallableFunction
};

export default function Page({page, changePage}: PageProps) {
  switch (page) {
    case 'home':
      return <HomePage changePage={changePage}></HomePage>;
    case 'join':
      return <JoinGamePage changePage={changePage}></JoinGamePage>;
    case 'create':
      return <CreateGamePage changePage={changePage}></CreateGamePage>
    default:
      return <HomePage changePage={changePage}></HomePage>;
  }
}