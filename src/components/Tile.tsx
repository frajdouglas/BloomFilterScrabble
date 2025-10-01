import { bonusColour } from "../constants/bonusColours";
import { useDroppable } from '@dnd-kit/core';

interface TileProps {
  tileContent: string | null;
  bonusTileContent: string | null;
  row: number;
  column: number;
  onClick: () => void
}

export const Tile = ({ tileContent, bonusTileContent, row, column, onClick }: TileProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${row}-${column}`,
    data: {
      row,
      column,
      type: 'board-cell'
    }
  });


  const isBonus = (b: string | null): b is "DL" | "TL" | "DW" | "TW" => {
    return b === "DL" || b === "TL" || b === "DW" || b === "TW";
  };

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`${isOver ? 'ring-2 ring-green-500 bg-green-200' : ''} aspect-square border border-gray-400 flex items-center justify-center text-lg font-bold select-none ${isBonus(bonusTileContent) ? bonusColour[bonusTileContent] : ""
        }`}
    >
      {tileContent}
    </div>
  );
};