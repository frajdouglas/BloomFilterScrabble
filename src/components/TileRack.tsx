import type { PlayerInformation } from "../types/board";

interface TileRackProps {
    player: PlayerInformation
}


export const TileRack = ({ player }: TileRackProps) => {

    return (
        <div key={player.playerId} className="flex space-x-1">
            Player ID: {player.playerId}
            {player.tilesRack.map((tile, idx) => (
                <div key={idx} className="border p-2 w-8 h-8 flex items-center justify-center">
                    {tile}
                </div>
            ))}
        </div>
    );
};