interface TileProps {
  tileContent: string | null;
  bonusTileContent: string | null;
}

export const Tile = ({ tileContent, bonusTileContent }: TileProps) => {
  const isBonus = (b: string | null): b is "DL" | "TL" | "DW" | "TW" => {
    return b === "DL" || b === "TL" || b === "DW" || b === "TW";
  };

  const bonusColour: Record<"DL" | "TL" | "DW" | "TW", string> = {
    DL: "bg-blue-200",
    TL: "bg-blue-400",
    DW: "bg-red-200",
    TW: "bg-red-400",
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