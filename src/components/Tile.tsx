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
    data: { row, column, type: 'board-cell' }
  });

  const isBonus = (b: string | null): b is "DL" | "TL" | "DW" | "TW" =>
    b === "DL" || b === "TL" || b === "DW" || b === "TW";

const bonusDisplayText: Record<string, string> = { 
  DL: "DOUBLE LETTER",
  TL: "TRIPLE LETTER",
  DW: "DOUBLE WORD",
  TW: "TRIPLE WORD"
};

const content = tileContent ?? (bonusTileContent ? bonusDisplayText[bonusTileContent] : null);

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={` aspect-square border border-gray-400 flex items-center justify-center text-center
        ${isOver ? 'ring-2 ring-green-500 bg-green-200' : ''} 
        ${isBonus(bonusTileContent) && !tileContent ? 'text-[0.5rem] font-semibold' : 'font-bold'}
        ${isBonus(bonusTileContent) ? bonusColour[bonusTileContent] : ''}
                ${tileContent ? 'bg-[#ffe6a8]' : ''} 
        `}

    >
      {content}
    </div>
  );
};