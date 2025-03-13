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
    <div className="w-full max-w-xl">
      <h2 className="text-3xl font-bold text-center mb-4">Parties disponibles</h2>
      <ul className="space-y-4 flex flex-col gap-y-2 max-h-60 overflow-y-scroll custom-scrollbar">
        {games.map((game) => (
          <li
            key={game.game_id}
            className="flex justify-between items-center p-1"
          >
            <div className="flex flex-row space-x-2 items-center">
              <p className="text-xl font-semibold">{game.game_name}</p>
              <p>[{game.host_username}]</p>
            </div>

            <button
              onClick={() => joinGame(game.game_id, playerUsername)}
              className="border hover:bg-blue-500 p-2"
            >
              Rejoindre
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
