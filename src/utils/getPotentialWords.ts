// export const getPotentialWords = (board, rowIndex, colIndex, bloomFilter, bitArraySize, seeds) => {
//     const boardSize = board.length
//     // look left
//     let stopCondition = false
//     let stringToValidate = ''
//     while (!stopCondition) {
//         console.log(board[rowIndex][colIndex])
//         stringToValidate += board[rowIndex][colIndex]
//         if (board[rowIndex][colIndex] === null) {
//             const isWordValid = checkWord(stringToValidate, bloomFilter, bitArraySize, seeds)
//             console.log(stringToValidate, isWordValid)

//             if (!isWordValid) {
//                 stopCondition = true
//             }
//         }
//         colIndex++
//     }

//     // End conditions are either, a blank space

//     // for(let i=0; i < b )

//     // look right

//     // look up
//     // look down


//     // any of these return false then we return empty 

//     // Else we calculate the scores using the lookup table
// }

// 

// [[0,0],[0,1],[0,2]]


//Test Cases
// Empty board, returns just 1 string
// Connects to another word, returns two strings
export const getPotentialWords = (board: (string | null)[][], coordinatesOfNewWord: number[][]): { wordsToValidate: string[] } => {
    let wordsToValidate = []

    // Derive Word Direction, right, down or edge case where just one letter

    const wordDirection = coordinatesOfNewWord.length === 1 ? 'none' : coordinatesOfNewWord[0][0] === coordinatesOfNewWord[1][0] ? 'horizontal' : 'vertical'

    if (wordDirection === 'none') {
        let xCoordOfNewWord = coordinatesOfNewWord[0][0]
        let yCoordOfNewWord = coordinatesOfNewWord[0][1]

        let stopConditionLeftDirection = false
        let horizontalStringToValidate = ''
        let pointerLeftDirection = yCoordOfNewWord
        while (stopConditionLeftDirection === false) {
            const letterOfNewWord = board[xCoordOfNewWord][pointerLeftDirection]
            console.log(pointerLeftDirection, letterOfNewWord, 'pointerLeftDirection')

            if (letterOfNewWord === null || letterOfNewWord === undefined) {
                stopConditionLeftDirection = true
            } else {
                horizontalStringToValidate = letterOfNewWord + horizontalStringToValidate
                pointerLeftDirection--
            }

        }
        console.log(horizontalStringToValidate, 'wordsToValidate After left direction')

        let stopConditionRightDirection = false
        let pointerRightDirection = yCoordOfNewWord + 1
        while (stopConditionRightDirection === false) {
            const letterOfNewWord = board[xCoordOfNewWord][pointerRightDirection]
            console.log(pointerRightDirection, letterOfNewWord, 'pointerRightDirection')
            // Stop when you reach the end of the new word entered 
            if (letterOfNewWord === null || letterOfNewWord === undefined) {
                wordsToValidate.push(horizontalStringToValidate)
                stopConditionRightDirection = true
            } else {
                horizontalStringToValidate = horizontalStringToValidate + letterOfNewWord
                pointerRightDirection++

            }
        }
        console.log(wordsToValidate, 'wordsToValidate After right direction')

        // For each horizontal letter in the new word, look up and down and add these to the array
        // Look left and look right, build string
        let stopConditionUpDirection = false
        let verticalStringToValidate = ''
        let pointerUpDirection = xCoordOfNewWord
        console.log(board[pointerUpDirection][yCoordOfNewWord])

        while (stopConditionUpDirection === false) {
            if (pointerUpDirection < 0) break;
            const letterOfNewWord = board[pointerUpDirection][yCoordOfNewWord]
            console.log(pointerUpDirection, letterOfNewWord, 'pointerUpDirection')

            if (letterOfNewWord === null || letterOfNewWord === undefined) {
                stopConditionUpDirection = true
            } else {
                verticalStringToValidate = letterOfNewWord + verticalStringToValidate
                pointerUpDirection--
            }

        }
        console.log(verticalStringToValidate, 'wordsToValidate After Up direction')

        let stopConditionDownDirection = false
        let pointerDownDirection = xCoordOfNewWord + 1
        while (stopConditionDownDirection === false) {
            const letterOfNewWord = board[pointerDownDirection][yCoordOfNewWord]
            console.log(pointerDownDirection, letterOfNewWord, 'pointerDownDirection')

            if (letterOfNewWord === null || letterOfNewWord === undefined) {
                if (verticalStringToValidate.length > 1) {
                    wordsToValidate.push(verticalStringToValidate)
                }
                stopConditionDownDirection = true
            } else {
                verticalStringToValidate = verticalStringToValidate + letterOfNewWord
                pointerDownDirection++
            }

        }
        console.log(wordsToValidate, 'wordsToValidate After Down direction')
    }

    if (wordDirection === 'horizontal') {
        // Iterate through letters - Right direction
        for (let i = 0; i < coordinatesOfNewWord.length; i++) {
            let xCoordOfNewWord = coordinatesOfNewWord[i][0]
            let yCoordOfNewWord = coordinatesOfNewWord[i][1]
            console.log(board[xCoordOfNewWord][yCoordOfNewWord], 'LETTER OF THE NEW WORD')

            // Only look for the horizontal line once starting from the first provided coordinate
            if (coordinatesOfNewWord[0][0] === xCoordOfNewWord && coordinatesOfNewWord[0][1] === yCoordOfNewWord) {
                // Look left and look right, build string
                let stopConditionLeftDirection = false
                let horizontalStringToValidate = ''
                let pointerLeftDirection = yCoordOfNewWord
                while (stopConditionLeftDirection === false) {
                    const letterOfNewWord = board[xCoordOfNewWord][pointerLeftDirection]
                    console.log(pointerLeftDirection, letterOfNewWord, 'pointerLeftDirection')

                    if (letterOfNewWord === null || letterOfNewWord === undefined) {
                        stopConditionLeftDirection = true
                    } else {
                        horizontalStringToValidate = letterOfNewWord + horizontalStringToValidate
                        pointerLeftDirection--
                    }

                }
                console.log(horizontalStringToValidate, 'wordsToValidate After left direction')

                let stopConditionRightDirection = false
                let pointerRightDirection = yCoordOfNewWord + 1
                while (stopConditionRightDirection === false) {
                    const letterOfNewWord = board[xCoordOfNewWord][pointerRightDirection]
                    console.log(pointerRightDirection, letterOfNewWord, 'pointerRightDirection')
                    // Stop when you reach the end of the new word entered 
                    if (letterOfNewWord === null || letterOfNewWord === undefined) {
                        wordsToValidate.push(horizontalStringToValidate)
                        stopConditionRightDirection = true
                    } else {
                        horizontalStringToValidate = horizontalStringToValidate + letterOfNewWord
                        pointerRightDirection++
                    }


                }
                console.log(wordsToValidate, 'wordsToValidate After right direction')
            }
            // For each horizontal letter in the new word, look up and down and add these to the array
            // Look left and look right, build string
            let stopConditionUpDirection = false
            let verticalStringToValidate = ''
            let pointerUpDirection = xCoordOfNewWord
            console.log(board[pointerUpDirection][yCoordOfNewWord])

            while (stopConditionUpDirection === false) {
                if (pointerUpDirection < 0) break;
                const letterOfNewWord = board[pointerUpDirection][yCoordOfNewWord]
                console.log(pointerUpDirection, letterOfNewWord, 'pointerUpDirection')

                if (letterOfNewWord === null || letterOfNewWord === undefined) {
                    stopConditionUpDirection = true
                } else {
                    verticalStringToValidate = letterOfNewWord + verticalStringToValidate
                    pointerUpDirection--
                }

            }
            console.log(verticalStringToValidate, 'wordsToValidate After Up direction')

            let stopConditionDownDirection = false
            let pointerDownDirection = xCoordOfNewWord + 1
            while (stopConditionDownDirection === false) {
                const letterOfNewWord = board[pointerDownDirection][yCoordOfNewWord]
                console.log(pointerDownDirection, letterOfNewWord, 'pointerDownDirection')

                if (letterOfNewWord === null || letterOfNewWord === undefined) {
                    if (verticalStringToValidate.length > 1) {
                        wordsToValidate.push(verticalStringToValidate)
                    }
                    stopConditionDownDirection = true
                } else {
                    verticalStringToValidate = verticalStringToValidate + letterOfNewWord
                    pointerDownDirection++
                }

            }
            console.log(wordsToValidate, 'wordsToValidate After Down direction')

        }

    } else if (wordDirection === 'vertical') {
        // Iterate through letters - Down direction
        for (let i = 0; i < coordinatesOfNewWord.length; i++) {
            let xCoordOfNewWord = coordinatesOfNewWord[i][0]
            let yCoordOfNewWord = coordinatesOfNewWord[i][1]
            console.log(board[xCoordOfNewWord][yCoordOfNewWord], 'LETTER OF THE NEW WORD')

            // Only look for the vertical line once starting from the first provided coordinate
            if (coordinatesOfNewWord[0][0] === xCoordOfNewWord && coordinatesOfNewWord[0][1] === yCoordOfNewWord) {
                // Look Up and look Down, build string
                let stopConditionUpDirection = false
                let verticalStringToValidate = ''
                let pointerUpDirection = xCoordOfNewWord
                while (stopConditionUpDirection === false) {
                    if (pointerUpDirection < 0) break;

                    const letterOfNewWord = board[pointerUpDirection][yCoordOfNewWord]
                    console.log(pointerUpDirection, letterOfNewWord, 'pointerUpDirection')

                    if (letterOfNewWord === null || letterOfNewWord === undefined) {
                        stopConditionUpDirection = true
                    } else {
                        verticalStringToValidate = letterOfNewWord + verticalStringToValidate
                        pointerUpDirection--
                    }

                }
                console.log(verticalStringToValidate, 'wordsToValidate After Up direction')

                let stopConditionDownDirection = false
                let pointerDownDirection = xCoordOfNewWord + 1
                while (stopConditionDownDirection === false) {
                    console.log(pointerDownDirection, yCoordOfNewWord, ' THIS')
                    const letterOfNewWord = board[pointerDownDirection][yCoordOfNewWord]
                    console.log(pointerDownDirection, letterOfNewWord, 'pointerDownDirection')
                    // Stop when you reach the end of the new word entered 
                    if (letterOfNewWord === null || letterOfNewWord === undefined) {
                        wordsToValidate.push(verticalStringToValidate)
                        stopConditionDownDirection = true
                    } else {
                        verticalStringToValidate = verticalStringToValidate + letterOfNewWord
                        pointerDownDirection++
                    }


                }
                console.log(wordsToValidate, 'wordsToValidate After right direction')
            }
            // For each horizontal letter in the new word, look up and down and add these to the array
            // Look left and look right, build string
            let stopConditionLeftDirection = false
            let horizontalStringToValidate = ''
            let pointerLeftDirection = yCoordOfNewWord
            console.log(board[xCoordOfNewWord][pointerLeftDirection])

            while (stopConditionLeftDirection === false) {
                if (pointerLeftDirection < 0) break;
                const letterOfNewWord = board[xCoordOfNewWord][pointerLeftDirection]
                console.log(pointerLeftDirection, letterOfNewWord, 'pointerLeftDirection')

                if (letterOfNewWord === null || letterOfNewWord === undefined) {
                    stopConditionLeftDirection = true
                } else {
                    horizontalStringToValidate = letterOfNewWord + horizontalStringToValidate
                    pointerLeftDirection--
                }

            }
            console.log(horizontalStringToValidate, 'wordsToValidate After Left direction')

            let stopConditionRightDirection = false
            let pointerRightDirection = yCoordOfNewWord + 1
            while (stopConditionRightDirection === false) {
                const letterOfNewWord = board[xCoordOfNewWord][pointerRightDirection]
                console.log(pointerRightDirection, letterOfNewWord, 'pointerRightDirection')

                if (letterOfNewWord === null || letterOfNewWord === undefined) {
                    if (horizontalStringToValidate.length > 1) {
                        wordsToValidate.push(horizontalStringToValidate)
                    }
                    stopConditionRightDirection = true
                } else {
                    horizontalStringToValidate = horizontalStringToValidate + letterOfNewWord
                    pointerRightDirection++
                }

            }
            console.log(wordsToValidate, 'wordsToValidate After Down direction')

        }
    }


    return { wordsToValidate: wordsToValidate }
    // any of these return false then we return empty 

    // Else we calculate the scores using the lookup table
}