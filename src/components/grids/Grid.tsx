"use client";

interface GridProps {
  board: string[];
  hits: string[];
  handleCellClick: CallableFunction;
  turn: boolean
}

export default function Grid({ board, hits, handleCellClick, turn }: GridProps) {
  const gridSize = 10;
  const columns = "ABCDEFGHIJ".split("");  // Les lettres pour les colonnes

  const renderGrid = () => {
    const grid = [];

    // Générer les lettres de A à J pour le dessus
    grid.push(
      <div key="header" className="grid grid-cols-11 gap-1">
        {[''].concat(columns).map((letter, index) => (
          <div key={index} className="w-5 h-5 flex justify-center items-center">
            {letter}
          </div>
        ))}
      </div>
    );

    // Générer les numéros de 1 à 10 pour le côté gauche et les cellules
    for (let row = 1; row <= gridSize; row++) {
      grid.push(
        <div key={`row-${row}`} className="grid grid-cols-11 gap-1">
          {/* Numéro de ligne à gauche */}
          <div className="w-5 h-5 flex justify-center items-center mb-1">
            {row}
          </div>

          {/* Cellules de la grille */}
          {columns.map((col) => {
            const cellId = `${col}${row}`;
            const isPlaced = board.includes(cellId);
            const isHit = hits.includes(cellId);

            return (
              <div
                key={cellId}
                className={`${isPlaced ? (isHit ? "bg-blue-500" : "bg-[#ffffff80]") : ""} w-5 h-5 border`}
                data-cell-id={cellId}
                onClick={() => handleCellClick(cellId)}
              ></div>
            );
          })}
        </div>
      );
    }

    return grid;
  };

  return (
    <div className={`w-fit h-fit ${turn ? '': 'cursor-not-allowed'}`}>
      {renderGrid()}
    </div>
  );
}
