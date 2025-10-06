import { useState, useEffect, useRef } from 'react'
import { checkWord } from './utils/checkWord';
import { shuffleBag } from './utils/shuffleBag';
import { drawTiles } from './utils/drawTiles';
import { exchangeTiles } from './utils/exchangeTiles';
import { getPotentialWords } from './utils/getPotentialWords';
import { transferEndGamePoints } from './utils/transferEndGamePoints';
import { createSquareBoardWithBonus } from './utils/createSquareBoardWithBonus';
import type { Square, PlayerInformation, GameState } from './types/board';
import { TileRack } from './components/TileRack';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Board } from './components/Board';
import { Sidebar } from './components/Sidebar';


interface BloomFilterMetadata {
  bitArraySize: number,
  numberOfHashFunctions: number,
  seeds: number[]
}

const App = () => {
  const bloomFilterRef = useRef<Uint8Array | null>(null);
  const metadataRef = useRef<BloomFilterMetadata | null>(null);
  const turnNumber = useRef(1);
  const [loading, setLoading] = useState(true);
  const [tileBag, setTileBag] = useState<string[]>([
    "A", "A", "A", "A", "A", "A", "A", "A", "A",
    "B", "B",
    "C", "C",
    "D", "D", "D", "D",
    "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
    "F", "F",
    "G", "G", "G",
    "H", "H",
    "I", "I", "I", "I", "I", "I", "I", "I", "I",
    "J",
    "K",
    "L", "L", "L", "L",
    "M", "M",
    "N", "N", "N", "N", "N", "N",
    "O", "O", "O", "O", "O", "O", "O", "O",
    "P", "P",
    "Q",
    "R", "R", "R", "R", "R", "R",
    "S", "S", "S", "S",
    "T", "T", "T", "T", "T", "T",
    "U", "U", "U", "U",
    "V", "V",
    "W", "W",
    "X",
    "Y", "Y",
    "Z",
    "*", "*"
  ])
  const [board, setBoard] = useState<Square[][]>(createSquareBoardWithBonus(15));
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const [newLetterCoordinates, setNewLetterCoordinates] = useState<number[][]>([]);
  const [consecutivePasses, setConsecutivePasses] = useState(0);
  const [validPendingWords, setValidPendingWords] = useState<{ word: string, score: number }[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    isStarted: false,
    outcome: null,
    playerTurn: 1,
    numOfPlayers: 2,
  })
  const [playersInformation, setPlayersInformation] = useState<PlayerInformation[]>([{
    playerId: 1,
    score: 0,
    tilesRack: []
  }, {
    playerId: 2,
    score: 0,
    tilesRack: []
  }]);

  useEffect(() => {
    const fetchBloomFilter = async () => {
      try {
        const [metaResponse, binResponse] = await Promise.all([
          fetch("/bloom-metadata.json"),
          fetch("/bloom.bin")
        ]);
        if (!metaResponse.ok || !binResponse.ok) throw new Error("Failed to fetch filter");

        const [metadataJson, arrayBuffer] = await Promise.all([
          metaResponse.json(),
          binResponse.arrayBuffer()
        ]);

        bloomFilterRef.current = new Uint8Array(arrayBuffer);
        metadataRef.current = metadataJson;
        setLoading(false);
      } catch (err) {
        console.error("Error loading Bloom filter:", err);
      }
    }
    fetchBloomFilter()
  }, []);

  const handleStartGame = () => {
    const unshuffledTileBag = [
      "A", "A", "A", "A", "A", "A", "A", "A", "A",
      "B", "B",
      "C", "C",
      "D", "D", "D", "D",
      "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
      "F", "F",
      "G", "G", "G",
      "H", "H",
      "I", "I", "I", "I", "I", "I", "I", "I", "I",
      "J",
      "K",
      "L", "L", "L", "L",
      "M", "M",
      "N", "N", "N", "N", "N", "N",
      "O", "O", "O", "O", "O", "O", "O", "O",
      "P", "P",
      "Q",
      "R", "R", "R", "R", "R", "R",
      "S", "S", "S", "S",
      "T", "T", "T", "T", "T", "T",
      "U", "U", "U", "U",
      "V", "V",
      "W", "W",
      "X",
      "Y", "Y",
      "Z",
      // "*", "*"
    ]
    let currentTileBag = shuffleBag(unshuffledTileBag)
    let newPlayers = []
    for (let i = 1; i < gameState.numOfPlayers + 1; i++) {
      const { remainingTilesInBag, newTileRack } = drawTiles(currentTileBag, [], 7)
      currentTileBag = remainingTilesInBag
      newPlayers.push({ playerId: i, score: 0, tilesRack: newTileRack })
    }

    setPlayersInformation(newPlayers)
    setTileBag(currentTileBag)
    setGameState(prev => ({
      ...prev,
      isStarted: true
    }));
  }

  const handleExchange = () => {
    if (tileBag.length < 8) {
      return;
    }
    setConsecutivePasses(0)
  }
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !over.data || !over.data.current) return;
    if (!active || !active.data || !active.data.current) return;

    const tileDropXCoord = over.data.current.row
    const tileDropYCoord = over.data.current.column

    if (board[tileDropXCoord][tileDropYCoord].letter) {
      return;
    }

    const isFirstTurn = turnNumber.current === 1
    const newLetter = active.data.current.letter
    const tilesRackLetterIndexToRemove = active.data.current.originalIndex
    const playerTurnId = gameState.playerTurn
    const addedLetterCoordinates = [...newLetterCoordinates]
    addedLetterCoordinates.push([tileDropXCoord, tileDropYCoord])

    const boardCopy = [...board]
    const rowToUpdate = [...boardCopy[tileDropXCoord]]
    rowToUpdate[tileDropYCoord] = { ...rowToUpdate[tileDropYCoord], letter: newLetter }
    boardCopy[tileDropXCoord] = rowToUpdate

    const wordsPreview = getPotentialWords(boardCopy, addedLetterCoordinates, isFirstTurn)
console.log(wordsPreview)
    let validWords: { word: string, score: number }[] = []
    if (wordsPreview.success && wordsPreview.words.length > 0 && bloomFilterRef.current && metadataRef.current) {
      for (let i = 0; i < wordsPreview.words.length; i++) {
        const wordToCheck = wordsPreview.words[i].word
        const isValidWord = checkWord(wordToCheck, bloomFilterRef.current, metadataRef.current.bitArraySize, metadataRef.current.seeds)
        if (isValidWord) {
          validWords.push(wordsPreview.words[i])
        }
      }
    }

    setValidPendingWords(validWords)
    setNewLetterCoordinates(addedLetterCoordinates)
    setPlayersInformation((prev) => {
      const updatedPlayer = prev.map((player) => {
        if (player.playerId === playerTurnId) {
          const newTilesRack = [...player.tilesRack]
          newTilesRack.splice(tilesRackLetterIndexToRemove, 1)
          return { ...player, tilesRack: newTilesRack }
        }
        return player
      })
      return updatedPlayer
    })
    setBoard(boardCopy)
  };

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as { letter: string } | undefined;
    if (data) {
      setActiveTile(data.letter);
    }
  };

  const handlePlayTiles = () => {
    if (!validPendingWords.length) return;

    setConsecutivePasses(0);

    const currentPlayer = playersInformation.find(p => p.playerId === gameState.playerTurn);
    if (!currentPlayer) return;

    // Mark used bonus board tiles as used
    const newBoard = board.map((row, rowIndex) => {
      if (newLetterCoordinates.some((coords) => coords[0] === rowIndex)) {
        return row.map((cell, colIndex) => {
          if (newLetterCoordinates.some((coords) => coords[1] === colIndex && coords[0] === rowIndex)) {
            return { ...cell, used: true }
          }
          return cell
        })
      }
      return row
    })

    const totalScoreToAdd = validPendingWords.reduce((sum, w) => sum + w.score, 0);
    const tilesToDraw = 7 - currentPlayer.tilesRack.length;
    const { remainingTilesInBag, newTileRack } = drawTiles([...tileBag], [...currentPlayer.tilesRack], tilesToDraw);

    const newPlayerInformation = playersInformation.map(player =>
      player.playerId === gameState.playerTurn
        ? { ...player, tilesRack: newTileRack, score: player.score + totalScoreToAdd }
        : player
    );

    if (remainingTilesInBag.length === 0 && newTileRack.length === 0) {
      const finalPlayersInformation = transferEndGamePoints(newPlayerInformation)
      const maxScore = Math.max(...finalPlayersInformation.map(p => p.score));
      const winners = finalPlayersInformation.filter(p => p.score === maxScore);

      setGameState(prev => ({
        ...prev,
        status: 'finished',
        outcome: winners.length > 1
          ? 'draw'
          : { winnerId: winners[0].playerId }
      }));
    }

    turnNumber.current++;
    setBoard(newBoard)
    setTileBag(remainingTilesInBag);
    setPlayersInformation(newPlayerInformation);
    setNewLetterCoordinates([]);
    setGameState(prev => ({
      ...prev,
      playerTurn: prev.playerTurn === prev.numOfPlayers ? 1 : prev.playerTurn + 1
    }));
  };

  const handleTileClick = (row: number, column: number, tile: string) => {
    const isCurrentTurnTile = newLetterCoordinates.some(
      ([x, y]) => x === row && y === column
    );
    if (!isCurrentTurnTile) return;

    const isFirstTurn = turnNumber.current === 1

    const newBoard = board.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((cell, colIndex) =>
          colIndex === column ? { ...cell, letter: null } : cell
        )
        : r
    );
    setBoard(newBoard);

    setPlayersInformation(prev =>
      prev.map(player =>
        player.playerId === gameState.playerTurn
          ? { ...player, tilesRack: [...player.tilesRack, tile] }
          : player
      )
    );

    const newCoords = newLetterCoordinates.filter(([x, y]) => !(x === row && y === column));
    setNewLetterCoordinates(newCoords);

    const wordsPreview = getPotentialWords(newBoard, newCoords, isFirstTurn)

    let validWords: { word: string, score: number }[] = []
    if (wordsPreview.success && wordsPreview.words.length > 0 && bloomFilterRef.current && metadataRef.current) {
      for (let i = 0; i < wordsPreview.words.length; i++) {
        const wordToCheck = wordsPreview.words[i].word
        const isValidWord = checkWord(wordToCheck, bloomFilterRef.current, metadataRef.current.bitArraySize, metadataRef.current.seeds)
        if (isValidWord) {
          validWords.push(wordsPreview.words[i])
        }
      }
    }

    setValidPendingWords(validWords)
  };

  const handleRecall = () => {
    const currentPlayer = playersInformation.find(p => p.playerId === gameState.playerTurn);
    if (!currentPlayer) return;

    const tilesToRecall = newLetterCoordinates.map(([x, y]) => board[x][y].letter).filter((tile) => tile !== null)

    const newBoard = board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (newLetterCoordinates.some(([x, y]) => x === rowIndex && y === colIndex)) {
          return { ...cell, letter: null };
        }
        return cell;
      })
    );

    setPlayersInformation(prev =>
      prev.map(player =>
        player.playerId === gameState.playerTurn
          ? { ...player, tilesRack: [...player.tilesRack, ...tilesToRecall] }
          : player
      )
    );

    setBoard(newBoard);
    setNewLetterCoordinates([]);
    setValidPendingWords([]);
  }

  const handlePass = () => {
    const newCount = consecutivePasses + 1;

    if (newCount >= gameState.numOfPlayers * 2) {
      const maxScore = Math.max(...playersInformation.map(p => p.score));
      const winners = playersInformation.filter(p => p.score === maxScore);
      setGameState(prev => ({
        ...prev,
        status: 'finished',
        outcome: winners.length > 1
          ? 'draw'
          : { winnerId: winners[0].playerId }
      })); return;
    }

    setConsecutivePasses(newCount);

    const currentPlayer = playersInformation.find(p => p.playerId === gameState.playerTurn);
    if (!currentPlayer) return;

    const tilesToRecall = newLetterCoordinates.map(([x, y]) => board[x][y].letter).filter((tile) => tile !== null)

    const newBoard = board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (newLetterCoordinates.some(([x, y]) => x === rowIndex && y === colIndex)) {
          return { ...cell, letter: null };
        }
        return cell;
      })
    );

    setPlayersInformation(prev =>
      prev.map(player =>
        player.playerId === gameState.playerTurn
          ? { ...player, tilesRack: [...player.tilesRack, ...tilesToRecall] }
          : player
      )
    );

    setBoard(newBoard);
    setNewLetterCoordinates([]);
    setValidPendingWords([]);

    setGameState(prev => ({
      ...prev,
      playerTurn: prev.playerTurn === prev.numOfPlayers ? 1 : prev.playerTurn + 1
    }));

    turnNumber.current++;
  };

  const handleNumOfPlayersChange = (numPlayers: number) => {
    setGameState(prev => ({ ...prev, numOfPlayers: numPlayers }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        <Sidebar
          gameState={gameState}
          onNumOfPlayersChange={handleNumOfPlayersChange}
          onStartGame={handleStartGame}
          onExchange={handleExchange}
          onPlayTiles={handlePlayTiles}
          onRecall={handleRecall}
          onPass={handlePass}
          playersInformation={playersInformation}
          tileBag={tileBag}
          validPendingWords={validPendingWords}
        />
        {/* Main Screen */}
        <main className="flex flex-col items-center mt-4 w-full">
          {/* Tile Rack */}
          {gameState.isStarted && (
            <div className="flex items-center justify-center w-full p-2">
              {playersInformation
                .filter(player => player.playerId === gameState.playerTurn)
                .map((player) => (
                  <TileRack key={player.playerId} player={player} />
                ))}
            </div>
          )}

          {/* Winner/Draw UI */}
          {gameState.outcome && (
            <div className="mt-2 text-lg font-semibold text-gray-800">
              {gameState.outcome === 'draw' ? (
                <span>It’s a draw!</span>
              ) : (
                <span>🎉 Player {gameState.outcome.winnerId} wins!</span>
              )}
            </div>
          )}
          <div className="aspect-square">
            <Board board={board} onTileClick={handleTileClick} />
          </div>
        </main>
      </div>
    </DndContext>
  )
}

export default App