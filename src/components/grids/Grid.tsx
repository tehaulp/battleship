"use client";

interface GridProps {
  board: string[];
  hits: string[];
  handleCellClick: CallableFunction;
}

export default function Grid({ board, hits, handleCellClick}: GridProps) {
  const gridSize = 10;
  const columns = "ABCDEFGHIJ".split("");

  const renderGrid = () => {
    const grid = [];

    for (let row = 1; row <= gridSize; row++) {
      for (const col of columns) {
        const cellId = `${col}${row}`;
        const isPlaced = board.includes(cellId);
        const isHit = hits.includes(cellId);

        grid.push(
          <div
            key={cellId}
            className={isPlaced ? (isHit ? "bg-blue-500" : "bg-red-700") : "bg-gray-700"}
            data-cell-id={cellId}
            onClick={() => handleCellClick(cellId)}
          >
            {cellId}
          </div>
        );
      }
    }

    return grid;
  };

  return (
    <div
      className="grid grid-cols-10 gap-0"
      style={{ gridTemplateRows: `repeat(${gridSize}, 2.5rem)` }}
    >
      {renderGrid()}
    </div>
  );
}