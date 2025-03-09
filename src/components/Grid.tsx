"use client";

export default function Grid({ board, handleCellClick }) {
  const gridSize = 10;
  const columns = "ABCDEFGHIJ".split(""); // Colonnes A à J

  const renderGrid = () => {
    const grid = [];

    for (let row = 1; row <= gridSize; row++) {
      for (const col of columns) {
        const cellId = `${col}${row}`;
        const isPlaced = board.includes(cellId);

        grid.push(
          <div
            key={cellId}
            className={`w-10 h-10 border text-center flex items-center justify-center ${
              isPlaced ? "bg-blue-500" : "bg-gray-700"
            }`}
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
