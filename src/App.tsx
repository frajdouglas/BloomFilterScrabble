import { useState, useEffect, useRef } from 'react'
import { checkWord } from './utils/checkWord';
import { shuffleBag } from './utils/shuffleBag';
import { drawTiles } from './utils/drawTiles';
import { exchangeTiles } from './utils/exchangeTiles';
import { getPotentialWords } from './utils/getPotentialWords';
import { transferEndGamePoints } from './utils/transferEndGamePoints';
import { createSquareBoardWithBonus } from './utils/createSquareBoardWithBonus';
import type { Square, PlayerInformation } from './types/board';
import { TileRack } from './components/TileRack';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Board } from './components/Board';

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
    "*", "*" // blanks
  ])
  const [board, setBoard] = useState<Square[][]>(createSquareBoardWithBonus(15));
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const [newLetterCoordinates, setNewLetterCoordinates] = useState<number[][]>([]);
  const [validPendingWords, setValidPendingWords] = useState<{ word: string, score: number }[]>([]);
  const [gameState, setGameState] = useState({ playerTurn: 1, numOfPlayers: 2 })
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

  const StartGame = () => {
    // Shuffle Tiles
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
      "*", "*" // blanks
    ]
    let currentTileBag = shuffleBag(unshuffledTileBag)
    // Set Number of Players
    let newPlayers = []
    for (let i = 1; i < gameState.numOfPlayers + 1; i++) {
      const { remainingTilesInBag, newTileRack } = drawTiles(currentTileBag, [], 7)
      currentTileBag = remainingTilesInBag
      newPlayers.push({ playerId: i, score: 0, tilesRack: newTileRack })
    }

    setPlayersInformation(newPlayers)
    setTileBag(currentTileBag)
  }

  const handleExchange = () => {

  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // console.log(over, active)
    if (!over || !over.data || !over.data.current) return; // dropped outside
    if (!active || !active.data || !active.data.current) return; // dropped outside

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

    // Add the new letter to the board
    const boardCopy = [...board]
    const rowToUpdate = [...boardCopy[tileDropXCoord]]
    rowToUpdate[tileDropYCoord] = { ...rowToUpdate[tileDropYCoord], letter: newLetter }
    boardCopy[tileDropXCoord] = rowToUpdate


    // GetPotential Words call here
    const wordsPreview = getPotentialWords(boardCopy, addedLetterCoordinates, isFirstTurn)
    // console.log(wordsPreview, 'words preview')

    // If there are words in the returned array, check if they all are valid english words - REFACTOR THIS 
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
    console.log(validWords, 'validWords')
    // Set the valid words into state
    setValidPendingWords(validWords)
    // Add to the new letter coordinates state as the player plays their letters
    setNewLetterCoordinates(addedLetterCoordinates)
    // Remove the tile from the player's tile rack
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
    // Update the board ui with the new letter 
    setBoard(boardCopy)

  };

  const handleDragStart = (event: DragStartEvent) => {
    // console.log('Drag started!');
    const data = event.active.data.current as { letter: string } | undefined;
    if (data) {
      setActiveTile(data.letter);
    }
  };

  const handlePlayTiles = () => {
    if (!validPendingWords.length) return;
    const currentPlayer = playersInformation.find(p => p.playerId === gameState.playerTurn);
    if (!currentPlayer) return;

    // Mark bonus tiles as used
    const newBoard = board.map((row, rowIndex) => {
      // if row index is any of the coords x coords , create a copy of the row array and go deeper
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
    // Draw Tiles
    const tilesToDraw = 7 - currentPlayer.tilesRack.length;
    const { remainingTilesInBag, newTileRack } = drawTiles([...tileBag], [...currentPlayer.tilesRack], tilesToDraw);

    // Add new tiles to player's rack and add score
    const newPlayerInformation = playersInformation.map(player =>
      player.playerId === gameState.playerTurn
        ? { ...player, tilesRack: newTileRack, score: player.score + totalScoreToAdd }
        : player
    );

    // Look for game end condition
    if (remainingTilesInBag.length === 0 && newTileRack.length === 0) {
      const finalPlayersInformation = transferEndGamePoints(newPlayerInformation)
      console.log('GAME OVER', 'FINAL PLAYERS SCORES:', finalPlayersInformation)
    }

    // Increment turn number
    turnNumber.current++;
    setBoard(newBoard)
    setTileBag(remainingTilesInBag);
    setPlayersInformation(newPlayerInformation);
    // Clear new letter coordinates
    setNewLetterCoordinates([]);
    // Change player's turn
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

    // Update board
    const newBoard = board.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((cell, colIndex) =>
          colIndex === column ? { ...cell, letter: null } : cell
        )
        : r
    );
    setBoard(newBoard);

    // Update player's rack
    setPlayersInformation(prev =>
      prev.map(player =>
        player.playerId === gameState.playerTurn
          ? { ...player, tilesRack: [...player.tilesRack, tile] }
          : player
      )
    );

    // Update coordinates
    const newCoords = newLetterCoordinates.filter(([x, y]) => !(x === row && y === column));
    setNewLetterCoordinates(newCoords);

    // Recompute validPendingWords
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
    console.log(validWords, 'validWordsMew')

    setValidPendingWords(validWords)
  };

 const handleRecall = () => {
    // Recall all tiles from board back to rack
    const currentPlayer = playersInformation.find(p => p.playerId === gameState.playerTurn);
    if (!currentPlayer) return;

    // Get all tiles from newLetterCoordinates
    const tilesToRecall = newLetterCoordinates.map(([x, y]) => board[x][y].letter).filter((tile) => tile !== null)

    // Remove tiles from board
    const newBoard = board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (newLetterCoordinates.some(([x, y]) => x === rowIndex && y === colIndex)) {
          return { ...cell, letter: null };
        }
        return cell;
      })
    );

    // Add tiles back to rack
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



  if (loading) {
    return <div>Loading</div>
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <h1 className="text-3xl font-bold underline">
        Player Turn: {gameState.playerTurn} Turn Number: {turnNumber.current}
      </h1>
      <div>SCOREBOARD</div>
      <div className="flex flex-col">
        {playersInformation.length > 0 &&
          playersInformation.map((player) => (
            <div>
              <div>Player Id: {player.playerId}</div>
              <div>Total Score: {player.score}</div>
            </div>
          ))
        }
      </div>
      <select value={gameState.numOfPlayers}
        onChange={e => setGameState({ ...gameState, numOfPlayers: Number(e.target.value) })}>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <button onClick={() => { StartGame() }}>Start Game</button>
      <button onClick={() => { handleExchange() }}>Exchange</button>
      <button onClick={() => { handleRecall() }}>Recall</button>
      <button onClick={() => { handlePlayTiles() }}>Play Tiles</button>

      <div className="flex">
        {tileBag.length > 0 &&
          tileBag.map((item) => {
            return <div>{item}</div>
          })}
      </div>
      <div className="flex flex-col">
        {playersInformation.length > 0 &&
          playersInformation.map((player) => (
            <TileRack player={player} />
          ))
        }
      </div>
      <Board board={board} onTileClick={handleTileClick}
      />
    </DndContext>
  )
}

export default App
