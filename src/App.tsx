import { useState, useEffect, useRef } from 'react'
import { checkWord } from './utils/checkWord';
import { shuffleBag } from './utils/shuffleBag';
import { drawTiles } from './utils/drawTiles';
import { exchangeTiles } from './utils/exchangeTiles';
import { getPotentialWords } from './utils/getPotentialWords';
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
  const [text, setText] = useState('')
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

  const [gameState, setGameState] = useState({ playerTurn: 1, numOfPlayers: 2 })
  const [PlayerInformation, setPlayerInformation] = useState<PlayerInformation[]>([{
    playerId: 1,
    score: 0,
    tilesRack: []
  }, {
    playerId: 2,
    score: 0,
    tilesRack: []
  }]);
  const [backupBoard, setBackupBoard] = useState<Square[][]>(createSquareBoardWithBonus(15));
  const [backupPlayerInformation, setBackupPlayerInformation] = useState<PlayerInformation[]>([{
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
  console.log(tileBag, PlayerInformation)

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

    setPlayerInformation(newPlayers)
    setTileBag(currentTileBag)
  }

  const handleTest = () => {
    const newWordCoordsArray = [[0, 2], [0, 3], [0, 4], [0, 5]]
    const board = Array.from({ length: 15 }, () => Array(15).fill(null))

    board[0][0] = "R"
    board[0][1] = "E"
    board[0][2] = "T"
    board[0][3] = "U"
    board[0][4] = "R"
    board[0][5] = "N"
    console.log(board, 'board for func')
    getPotentialWords(board, newWordCoordsArray)
  }

  const handleExchange = () => {

  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(over, active)
    if (!over || !over.data || !over.data.current) return; // dropped outside
    if (!active || !active.data || !active.data.current) return; // dropped outside

    let tileDropXCoord = over.data.current.row
    let tileDropYCoord = over.data.current.column

    if (board[tileDropXCoord][tileDropYCoord].letter) {
      return;
    }

    let newLetter = active.data.current.letter
    let tilesRackLetterIndexToRemove = active.data.current.originalIndex
    let playerTurnId = gameState.playerTurn
    let addedLetterCoordinates = [...newLetterCoordinates]
    addedLetterCoordinates.push([tileDropXCoord, tileDropYCoord])

    let boardCopy = [...board]
    let rowToUpdate = [...boardCopy[tileDropXCoord]]
    rowToUpdate[tileDropYCoord] = { ...rowToUpdate[tileDropYCoord], letter: newLetter }
    boardCopy[tileDropXCoord] = rowToUpdate


    // GetPotential Words call here
    let wordsPreview = getPotentialWords(boardCopy, addedLetterCoordinates)
    console.log(wordsPreview, 'words preview')
    // Add to the new letter coordinates state as the player plays their letters
    setNewLetterCoordinates(addedLetterCoordinates)
    // Remove the tile from the player's tile rack
    setPlayerInformation((prev) => {
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
    console.log('Drag started!');
    const data = event.active.data.current as { letter: string } | undefined;
    if (data) {
      setActiveTile(data.letter);
    }
  };


  const handleTurnPlay = () => {

// Validate placements


    // player has dragged a tile into a correct position. and selects submit

    // valid words are calculated and total score is added to the playerinformation state

    // Tiles are redrawn

    // Game end is checked

    // Backup Player Information and Board state is saved for invalid moves 
  }

  const handleDraw = () => {
    if (!tileBag) return

    // const updatedPlayers = PlayerInformation.map((player) => {
    //       const { remainingTilesInBag, newTileRack } = drawTiles(currentTileBag, player.tilesRack)
    //       currentTileBag = remainingTilesInBag
    //       return { ...player, tilesRack: newTileRack }
    //     })



    // let currentPlayersTiles = [...playersTiles.playerOne]
    // let currentTileBag = [...tileBag]

    // while (currentPlayersTiles.length < 7 && currentTileBag.length > 0) {
    //   const newTileFromBag = currentTileBag.pop()
    //   if (newTileFromBag !== undefined) {
    //     currentPlayersTiles.push(newTileFromBag)
    //   }
    // }
    // setPlayersTiles({ ...playersTiles, playerOne: currentPlayersTiles })
    // setTileBag(currentTileBag)
  }

  const handleCheckWord = (query: string) => {
    if (!bloomFilterRef.current || !metadataRef.current) {
      return
    }

    setText(query)

    const isValidWord = checkWord(query, bloomFilterRef.current, metadataRef.current?.bitArraySize, metadataRef.current.seeds)
    console.log(isValidWord, query)
  }

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <input
        className="border border-gray-400 p-2 rounded w-full max-w-xs"
        onChange={(e) => handleCheckWord(e.target.value)}
        value={text}
      />
      <select value={gameState.numOfPlayers}
        onChange={e => setGameState({ ...gameState, numOfPlayers: Number(e.target.value) })}>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <button onClick={() => { StartGame() }}>Start Game</button>
      <button onClick={() => { handleExchange() }}>Exchange</button>
      <button onClick={() => { handleTest() }}>Test Potential Words Function</button>

      <button onClick={() => { handleDraw() }}>Draw</button>
      <div className="flex">
        {tileBag.length > 0 &&
          tileBag.map((item) => {
            return <div>{item}</div>
          })}
      </div>
      <div className="flex flex-col">
        {PlayerInformation.length > 0 &&
          PlayerInformation.map((player) => (
            <TileRack player={player} />
          ))
        }
      </div>
      <Board board={board} />

    </DndContext>
  )
}

export default App
