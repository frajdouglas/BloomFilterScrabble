import React from 'react';
import type { PlayerInformation } from '../types/board';
import { Code2, Briefcase } from 'lucide-react';

interface SidebarProps {
    gameState: { playerTurn: number; numOfPlayers: number };
    onNumOfPlayersChange: (num: number) => void;
    onStartGame: () => void;
    onExchange: () => void;
    onPlayTiles: () => void;
    onRecall: () => void;
    onPass: () => void;
    playersInformation: PlayerInformation[];
    tileBag: string[];
    gameStarted: boolean;
    validPendingWords: { word: string; score: number }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
    gameState,
    onNumOfPlayersChange,
    onStartGame,
    onExchange,
    onPlayTiles,
    onRecall,
    onPass,
    playersInformation,
    tileBag,
    gameStarted,
    validPendingWords
}) => {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-4">
            {/* Social Links */}
            <div className="flex gap-1">
                <a
                    href="https://github.com/frajdouglas/BloomFilterScrabble"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                    <Code2 className="w-4 h-4 mr-2" />
                    GitHub
                </a>

                <a
                    href="https://www.linkedin.com/in/fraser-douglas-ab8882158"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                    <Briefcase className="w-4 h-4 mr-2" />
                    LinkedIn
                </a></div>

            {/* Game Setup */}
            {!gameStarted && (
                <div className="border border-gray-300 rounded-lg p-4">
                    <h3 className="text-sm font-semibold mb-3 text-gray-700">Game Setup</h3>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">Number of Players</label>
                        <select
                            value={gameState.numOfPlayers}
                            onChange={e => onNumOfPlayersChange(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        <button
                            onClick={onStartGame}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Start Game
                        </button>
                    </div>
                </div>
            )}

            {/* Actions */}
            {gameStarted && (
                <div className="border border-gray-300 rounded-lg p-4">
                    <h3 className="text-sm font-semibold mb-3 text-gray-700">Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={onPlayTiles}
                            disabled={!validPendingWords.length}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Submit
                        </button>
                        <button
                            onClick={onRecall}
                            className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium"
                        >
                            Recall
                        </button>
                        <button
                            onClick={onExchange}
                            disabled={tileBag.length < 8}
                            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Exchange
                        </button>
                        <button
                            onClick={onPass}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                        >
                            Pass
                        </button>
                    </div>
                </div>
            )}

            {/* Tiles Remaining */}
            {gameStarted && (
                <div className="border border-gray-300 rounded-lg p-4">
                    <h3 className="text-sm font-semibold mb-2 text-gray-700">Tiles Remaining</h3>
                    <div className="text-2xl font-bold text-center text-gray-800">{tileBag.length}</div>
                </div>
            )}

            {/* Leaderboard */}
            {gameStarted && (
                <div className="border border-gray-300 rounded-lg p-4 flex-1 overflow-auto">
                    <h3 className="text-sm font-semibold mb-3 text-gray-700">Leaderboard</h3>
                    <div className="flex flex-col gap-2">
                        {playersInformation
                            .sort((a, b) => b.score - a.score)
                            .map(player => (
                                <div
                                    key={player.playerId}
                                    className={`p-3 rounded-lg border flex items-center justify-between ${player.playerId === gameState.playerTurn ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${player.playerId === gameState.playerTurn ? 'bg-blue-500' : 'bg-gray-300'
                                            }`} />
                                        <span className="font-medium text-sm">Player {player.playerId}</span>
                                    </div>
                                    <span className="font-bold text-sm">{player.score}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </aside>
    );
};
