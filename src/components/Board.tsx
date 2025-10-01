import { Tile } from './Tile';
import type { Square } from '../types/board';

interface BoardProps {
  board: Square[][];
  onTileClick: (row: number, column: number, tile: string) => void
}

export const Board = ({ board, onTileClick }: BoardProps) => {
  return (
    <div
      className="grid gap-0.5"
      style={{ gridTemplateColumns: `repeat(${board[0].length}, minmax(0, 1fr))` }}
    >
      {board.flat().map((square, idx) => {
        const row = Math.floor(idx / board[0].length);
        const column = idx % board[0].length;

        return (
          <Tile
            key={idx}
            tileContent={square.letter}
            bonusTileContent={square.bonus}
            row={row}
            column={column}
            onClick={() => {
              if (square.letter) {
                onTileClick(row, column, square.letter)
              }
            }}
          />
        );
      })}
    </div>
  );
};