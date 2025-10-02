import type { PlayerInformation } from "../types/board";
import { DraggableTile } from "./DraggableTile";

interface TileRackProps {
    player: PlayerInformation
}

export const TileRack = ({ player }: TileRackProps) => {
    return (
        <div key={player.playerId} className="flex gap-1">
            {player.tilesRack.map((tile, idx) => (
                <DraggableTile
                    key={idx}
                    tile={tile}
                    index={idx}
                    playerId={player.playerId}
                />
            ))}
        </div>
    );
};