import type { PlayerInformation } from '../types/board';
import { letterPoints } from '../constants/letterPoints';

export const transferEndGamePoints = (playersInformation: PlayerInformation[]): PlayerInformation[] => {
    const finisherId = playersInformation.find(p => p.tilesRack.length === 0)?.playerId;

    let totalRemainingPoints = 0;

    // Subtract remaining tiles from each player
    const updatedPlayers = playersInformation.map(player => {
        const remainingPoints = player.tilesRack.reduce((sum, tile) => sum + letterPoints[tile], 0);
        totalRemainingPoints += remainingPoints;
        return { ...player, score: player.score - remainingPoints };
    });

    // Add bonus to finisher if one exists
    if (finisherId) {
        return updatedPlayers.map(player =>
            player.playerId === finisherId
                ? { ...player, score: player.score + totalRemainingPoints }
                : player
        );
    }

    return updatedPlayers;
}