import type { Square } from "../types/board"

export const getPotentialWords = (board: Square[][], coordinatesOfNewWord: number[][]): { wordsToValidate: string[] } => {

    const crawlAndConstructString = (board: Square[][], startRow: number, startCol: number, rowStep: number, colStep: number) => {
        let rowIndex = startRow
        let colIndex = startCol
        let result = ''
        while (rowIndex >= 0 && rowIndex <= board.length && colIndex >= 0 && colIndex <= board.length) {
            if (!board[rowIndex][colIndex].letter) break;
            const letter = board[rowIndex][colIndex].letter
            if (rowStep === -1 || colStep === -1) {
                result = letter + result
            } else {
                result = result + letter
            }
            rowIndex += rowStep
            colIndex += colStep
        }
        return result;
    }

    let wordsToValidate = []
    // Derive Word Direction, right, down or edge case where just one letter
    const wordDirection = coordinatesOfNewWord.length === 1 ? 'none' : coordinatesOfNewWord[0][0] === coordinatesOfNewWord[1][0] ? 'horizontal' : 'vertical'

    if (wordDirection === 'none') {
        const leftString = crawlAndConstructString(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1], 0, -1)
        const rightString = crawlAndConstructString(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1] + 1, 0, 1)
        const horizontalStringToValidate = leftString + rightString
        const upString = crawlAndConstructString(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1], -1, 0)
        const downString = crawlAndConstructString(board, coordinatesOfNewWord[0][0] + 1, coordinatesOfNewWord[0][1], 1, 0)
        const verticalStringToValidate = upString + downString

        if (horizontalStringToValidate.length > 1) {
            wordsToValidate.push(horizontalStringToValidate)
        }

        if (verticalStringToValidate.length > 1) {
            wordsToValidate.push(verticalStringToValidate)
        }

    } else if (wordDirection === 'horizontal') {
        const leftString = crawlAndConstructString(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1], 0, -1)
        const rightString = crawlAndConstructString(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1] + 1, 0, 1)
        const horizontalStringToValidate = leftString + rightString

        if (horizontalStringToValidate.length > 1) {
            wordsToValidate.push(horizontalStringToValidate)
        }

        for (let i = 0; i < coordinatesOfNewWord.length; i++) {
            const upString = crawlAndConstructString(board, coordinatesOfNewWord[i][0], coordinatesOfNewWord[i][1], -1, 0)
            const downString = crawlAndConstructString(board, coordinatesOfNewWord[i][0] + 1, coordinatesOfNewWord[i][1], 1, 0)
            const verticalStringToValidate = upString + downString

            if (verticalStringToValidate.length > 1) {
                wordsToValidate.push(verticalStringToValidate)
            }
        }
    }
    else if (wordDirection === 'vertical') {
        const upString = crawlAndConstructString(board, coordinatesOfNewWord[0][0], coordinatesOfNewWord[0][1], -1, 0)
        const downString = crawlAndConstructString(board, coordinatesOfNewWord[0][0] + 1, coordinatesOfNewWord[0][1], 1, 0)
        const verticalStringToValidate = upString + downString

        if (verticalStringToValidate.length > 1) {
            wordsToValidate.push(verticalStringToValidate)
        }

        for (let i = 0; i < coordinatesOfNewWord.length; i++) {
            const leftString = crawlAndConstructString(board, coordinatesOfNewWord[i][0], coordinatesOfNewWord[i][1], 0, -1)
            const rightString = crawlAndConstructString(board, coordinatesOfNewWord[i][0], coordinatesOfNewWord[i][1] + 1, 0, 1)
            const horizontalStringToValidate = leftString + rightString

            if (horizontalStringToValidate.length > 1) {
                wordsToValidate.push(horizontalStringToValidate)
            }


            }
        }

        return { wordsToValidate: wordsToValidate }
    }