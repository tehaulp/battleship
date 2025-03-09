import { Game } from "./JoinGameSection";

interface GameListProps {
  games: Game[];
  joinGame: (gameId: string, playerUsername: string) => void;
  playerUsername: string;
}

export default function GameList({
  games,
  joinGame,
  playerUsername,
}: GameListProps) {
  return (
    <div>
      <h2>Parties disponibles</h2>
      <ul>
        {games.map((game) => (
          <li key={game.game_id}>
            <div>
              <p>{game.game_name}</p>
              <p>Hôte: {game.host_username}</p>
              <p>{game.game_status}</p>
            </div>
            <button onClick={() => joinGame(game.game_id, playerUsername)}>
              Rejoindre
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
