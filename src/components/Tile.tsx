import { bonusColour } from "../constants/bonusColours";

interface TileProps {
  tileContent: string | null;
  bonusTileContent: string | null;
}

export const Tile = ({ tileContent, bonusTileContent }: TileProps) => {
  const isBonus = (b: string | null): b is "DL" | "TL" | "DW" | "TW" => {
    return b === "DL" || b === "TL" || b === "DW" || b === "TW";
  };

  return (
    <div
      className={`aspect-square border border-gray-400 flex items-center justify-center text-lg font-bold select-none ${
        isBonus(bonusTileContent) ? bonusColour[bonusTileContent] : ""
      }`}
    >
      {tileContent}
    </div>
  );
};