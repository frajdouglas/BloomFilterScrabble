import { Tile } from './Tile';
import type { Square } from '../types/board';

interface BoardProps {
  board: Square[][];
  onTileClick: (row: number, column: number, tile: string) => void
}

export const Board = ({ board, onTileClick }: BoardProps) => {
  const size = board.length; // 15

  return (

    <div
      className="grid bg-[#008f3b] font-bold"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 40px))` }}

    >
      {board.flat().map((square, idx) => {
        const row = Math.floor(idx / size);
        const column = idx % size;

        return (
          <Tile
            key={idx}
            tileContent={square.letter}
            bonusTileContent={square.bonus}
            row={row}
            column={column}
            onClick={() => {
              if (square.letter) {
                onTileClick(row, column, square.letter);
              }
            }}
          />
        );
      })}
    </div>
  );
};
