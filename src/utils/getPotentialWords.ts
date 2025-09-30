import type { Square } from "../types/board"
import { letterPoints } from "../constants/letterPoints"
export const getPotentialWords = (board: Square[][], coordinatesOfNewWord: number[][], isFirstMove: boolean): { word: string, score: number }[] => {

    // Check the word is only in a vertical or horizontal continuous placement
    const rows = coordinatesOfNewWord.map(([rowIndex]) => rowIndex).sort((a, b) => a - b);
    const cols = coordinatesOfNewWord.map(([, columnIndex]) => columnIndex).sort((a, b) => a - b);

    const allSameRow = new Set(rows).size === 1;
    const allSameCol = new Set(cols).size === 1;

    if (!allSameRow && !allSameCol) return [];

    for (let i = 0; i < rows.length - 1; i++) {
        if (rows[i] - rows[i + 1] !== -1 && !allSameRow) return []
        if (cols[i] - cols[i + 1] !== -1 && !allSameCol) return []
    }


    const hasConnection = coordinatesOfNewWord.some(([row, col]) => {
        const neighbors = [
            [row - 1, col], // above
            [row + 1, col], // below
            [row, col - 1], // left
            [row, col + 1], // right
        ];
        return neighbors.some(([r, c]) =>
            r >= 0 &&
            r < board.length &&
            c >= 0 &&
            c < board[0].length &&
            board[r][c].letter !== null &&
            !coordinatesOfNewWord.some(([nr, nc]) => nr === r && nc === c) // ignore newly placed tiles
        );
    });

    if (!hasConnection && !isFirstMove) {
        return [];
    }

    // If it is first move then check the player has placed the word in the centre of the board.

    if (isFirstMove) {
        const middleRow = Math.floor(board.length / 2);
        const middleCol = Math.floor(board[0].length / 2);

        const coversMiddle = coordinatesOfNewWord.some(
            ([row, col]) => row === middleRow && col === middleCol
        );

        if (!coversMiddle) {
            return [];
        }
    }


    const crawlAndConstructStringAndCalculateWordScore = (board: Square[][], startRow: number, startCol: number, rowStep: number, colStep: number) => {
        let wordScoreTotal = 0
        let wordMultiplier = 1
        let rowIndex = startRow
        let colIndex = startCol
        let result = ''
        while (rowIndex >= 0 && rowIndex <= board.length && colIndex >= 0 && colIndex <= board.length) {
            if (!board[rowIndex][colIndex].letter) break;
            const letter = board[rowIndex][colIndex].letter
            if (!letter) break;
            if (rowStep === -1 || colStep === -1) {
                result = letter + result
            } else {
                result = result + letter
            }
            let letterScore = letterPoints[letter]

            if (board[rowIndex][colIndex].bonus && !board[rowIndex][colIndex].used) {
                if (board[rowIndex][colIndex].bonus === 'DL') letterScore *= 2
                if (board[rowIndex][colIndex].bonus === 'TL') letterScore *= 3
                if (board[rowIndex][colIndex].bonus === 'DW') wordMultiplier *= 2
                if (board[rowIndex][colIndex].bonus === 'TW') wordMultiplier *= 3

            }
            wordScoreTotal += letterScore
            rowIndex += rowStep
            colIndex += colStep
        }
        return { word: result, score: wordScoreTotal, wordMultiplier: wordMultiplier };
    }

    let wordsToValidate = []
    // Derive Word Direction, right, down or edge case where just one letter
    const wordDirection = coordinatesOfNewWord.length === 1 ? 'none' : coordinatesOfNewWord[0][0] === coordinatesOfNewWord[1][0] ? 'horizontal' : 'vertical'

    if (wordDirection === 'none') {
        const leftString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1], 0, -1)
        const rightString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1] + 1, 0, 1)
        const horizontalStringToValidate = leftString.word + rightString.word
        const horizontalWordScore = leftString.score + rightString.score
        const horizonalTotalWordMultiplier = leftString.wordMultiplier * rightString.wordMultiplier
        const upString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1], -1, 0)
        const downString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[0][0] + 1, coordinatesOfNewWord[0][1], 1, 0)
        const verticalStringToValidate = upString.word + downString.word
        const verticalWordScore = upString.score + downString.score
        const verticalTotalWordMultiplier = upString.wordMultiplier * downString.wordMultiplier

        if (horizontalStringToValidate.length > 1) {
            wordsToValidate.push({ word: horizontalStringToValidate, score: horizontalWordScore * horizonalTotalWordMultiplier })
        }

        if (verticalStringToValidate.length > 1) {
            wordsToValidate.push({ word: verticalStringToValidate, score: verticalWordScore * verticalTotalWordMultiplier })
        }

    } else if (wordDirection === 'horizontal') {
        const leftString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1], 0, -1)
        const rightString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1] + 1, 0, 1)
        const horizontalStringToValidate = leftString.word + rightString.word
        const horizontalWordScore = leftString.score + rightString.score
        const horizontalTotalWordMultiplier = leftString.wordMultiplier * rightString.wordMultiplier
        if (horizontalStringToValidate.length > 1) {
            wordsToValidate.push({ word: horizontalStringToValidate, score: horizontalWordScore * horizontalTotalWordMultiplier })
        }

        for (let i = 0; i < coordinatesOfNewWord.length; i++) {
            const upString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[i][0], coordinatesOfNewWord[i][1], -1, 0)
            const downString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[i][0] + 1, coordinatesOfNewWord[i][1], 1, 0)
            const verticalStringToValidate = upString.word + downString.word
            const verticalWordScore = upString.score + downString.score
            const verticalTotalWordMultiplier = upString.wordMultiplier * downString.wordMultiplier
            if (verticalStringToValidate.length > 1) {
                wordsToValidate.push({
                    word: verticalStringToValidate, score: verticalWordScore * verticalTotalWordMultiplier
                })
            }
        }
    }
    else if (wordDirection === 'vertical') {
        const upString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1], -1, 0)
        const downString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[0][0] + 1, coordinatesOfNewWord[0][1], 1, 0)
        console.log(upString, downString, 'strings')

        const verticalStringToValidate = upString.word + downString.word
        const verticalWordScore = upString.score + downString.score
        const verticalTotalWordMultiplier = upString.wordMultiplier * downString.wordMultiplier

        if (verticalStringToValidate.length > 1) {
            wordsToValidate.push({
                word: verticalStringToValidate, score: verticalWordScore * verticalTotalWordMultiplier
            })
        }

        for (let i = 0; i < coordinatesOfNewWord.length; i++) {
            const leftString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[i][0], coordinatesOfNewWord[i][1], 0, -1)
            const rightString = crawlAndConstructStringAndCalculateWordScore(board, coordinatesOfNewWord[i][0], coordinatesOfNewWord[i][1] + 1, 0, 1)
            const horizontalStringToValidate = leftString.word + rightString.word
            const horizontalWordScore = leftString.score + rightString.score
            const horizontalTotalWordMultiplier = leftString.wordMultiplier * rightString.wordMultiplier
            if (horizontalStringToValidate.length > 1) {
                wordsToValidate.push({ word: horizontalStringToValidate, score: horizontalWordScore * horizontalTotalWordMultiplier })
            }


        }
    }
    return wordsToValidate
}