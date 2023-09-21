import React, {useEffect, useState} from "react";
import {useSwipeable} from 'react-swipeable';

const Game = ({setScore}) => {
    const [board, setBoard] = useState(null);

    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSwipe = (eventData) => {
        const {dir} = eventData;

        switch (dir) {
            case 'Up':
                console.log('Смахнули вверх');
                move('up');
                break;
            case 'Down':
                console.log('Смахнули вниз');
                move('down');
                break;
            case 'Left':
                console.log('Смахнули влево');
                move('left');
                break;
            case 'Right':
                console.log('Смахнули вправо');
                move('right');
                break;
            default:
                console.log('Неизвестное направление');
        }
    };

    const handlers = useSwipeable({
        onSwiped: (eventData) => handleSwipe(eventData),
        preventDefaultTouchmoveEvent: true,
    });

    useEffect(() => {
        initBoard();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const up = 38;
            const right = 39;
            const down = 40;
            const left = 37;
            const n = 78;

            if (e.keyCode === up) {
                move('up');
            } else if (e.keyCode === right) {
                move('right');
            } else if (e.keyCode === down) {
                move('down');
            } else if (e.keyCode === left) {
                move('left');
            } else if (e.keyCode === n) {
                initBoard();
            }
        };

        document.body.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.removeEventListener('keydown', handleKeyDown);
        };
    }, [board, gameOver]);

    // Create board with two random coordinate numbers
    const initBoard = () => {
        let newBoard = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        newBoard = placeRandom(placeRandom(newBoard));
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
        setMessage(null);
    };

    // Get all blank coordinates from board
    const getBlankCoordinates = (board) => {
        const blankCoordinates = [];

        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                if (board[r][c] === 0) {
                    blankCoordinates.push([r, c]);
                }
            }
        }

        return blankCoordinates;
    };

    // Grab random start number
    const randomStartingNumber = () => {
        const startingNumbers = [2, 4];
        return startingNumbers[Math.floor(Math.random() * startingNumbers.length)];
    };

    // Place random starting number on an empty coordinate
    const placeRandom = (board) => {
        const blankCoordinates = getBlankCoordinates(board);
        const randomCoordinate = blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)];
        board[randomCoordinate[0]][randomCoordinate[1]] = randomStartingNumber();
        return board;
    };

    // Compares two boards to check for movement
    const boardMoved = (original, updated) => {
        return JSON.stringify(updated) !== JSON.stringify(original);
    };

    // Moves board depending on direction and checks for game over
    const move = (direction) => {
        if (!gameOver) {
            let movedBoard;
            if (direction === 'up') {
                movedBoard = moveUp(board);
            } else if (direction === 'right') {
                movedBoard = moveRight(board);
            } else if (direction === 'down') {
                movedBoard = moveDown(board);
            } else if (direction === 'left') {
                movedBoard = moveLeft(board);
            }

            if (boardMoved(board, movedBoard.board)) {
                const upWithRandom = placeRandom(movedBoard.board);

                if (checkForGameOver(upWithRandom)) {
                    setBoard(upWithRandom);
                    setGameOver(true);
                    setMessage('Game over!');
                } else {
                    setBoard(upWithRandom);
                    setScore(prevScore => prevScore + movedBoard.score);
                }
            }
        } else {
            setMessage('Game over. Please start a new game.');
        }
    };

    const moveUp = (inputBoard) => {
        let rotatedRight = rotateRight(inputBoard);
        let newBoard = [];
        let newScore = 0;

        // Shift all numbers to the right
        for (let r = 0; r < rotatedRight.length; r++) {
            let row = [];
            for (let c = 0; c < rotatedRight[r].length; c++) {
                let current = rotatedRight[r][c];
                current === 0 ? row.unshift(current) : row.push(current);
            }
            newBoard.push(row);
        }

        // Combine numbers and shift to right
        for (let r = 0; r < newBoard.length; r++) {
            for (let c = newBoard[r].length - 1; c >= 0; c--) {
                if (newBoard[r][c] > 0 && newBoard[r][c] === newBoard[r][c - 1]) {
                    newBoard[r][c] = newBoard[r][c] * 2;
                    newBoard[r][c - 1] = 0;
                    newScore += newBoard[r][c];
                } else if (newBoard[r][c] === 0 && newBoard[r][c - 1] > 0) {
                    newBoard[r][c] = newBoard[r][c - 1];
                    newBoard[r][c - 1] = 0;
                }
            }
        }

        // Rotate board back upright
        newBoard = rotateLeft(newBoard);

        return {board: newBoard, score: newScore};
    };

    const moveRight = (inputBoard) => {
        let newBoard = [];
        let newScore = 0;

        // Shift all numbers to the right
        for (let r = 0; r < inputBoard.length; r++) {
            let row = [];
            for (let c = 0; c < inputBoard[r].length; c++) {
                let current = inputBoard[r][c];
                current === 0 ? row.unshift(current) : row.push(current);
            }
            newBoard.push(row);
        }

        // Combine numbers and shift to right
        for (let r = 0; r < newBoard.length; r++) {
            for (let c = newBoard[r].length - 1; c >= 0; c--) {
                if (newBoard[r][c] > 0 && newBoard[r][c] === newBoard[r][c - 1]) {
                    newBoard[r][c] = newBoard[r][c] * 2;
                    newBoard[r][c - 1] = 0;
                    newScore += newBoard[r][c];
                } else if (newBoard[r][c] === 0 && newBoard[r][c - 1] > 0) {
                    newBoard[r][c] = newBoard[r][c - 1];
                    newBoard[r][c - 1] = 0;
                }
            }
        }

        return {board: newBoard, score: newScore};
    };

    const moveDown = (inputBoard) => {
        let rotatedRight = rotateRight(inputBoard);
        let newBoard = [];
        let newScore = 0;

        // Shift all numbers to the left
        for (let r = 0; r < rotatedRight.length; r++) {
            let row = [];
            for (let c = rotatedRight[r].length - 1; c >= 0; c--) {
                let current = rotatedRight[r][c];
                current === 0 ? row.push(current) : row.unshift(current);
            }
            newBoard.push(row);
        }

        // Combine numbers and shift to left
        for (let r = 0; r < newBoard.length; r++) {
            for (let c = 0; c < newBoard.length; c++) {
                if (newBoard[r][c] > 0 && newBoard[r][c] === newBoard[r][c + 1]) {
                    newBoard[r][c] = newBoard[r][c] * 2;
                    newBoard[r][c + 1] = 0;
                    newScore += newBoard[r][c];
                } else if (newBoard[r][c] === 0 && newBoard[r][c + 1] > 0) {
                    newBoard[r][c] = newBoard[r][c + 1];
                    newBoard[r][c + 1] = 0;
                }
            }
        }

        // Rotate board back upright
        newBoard = rotateLeft(newBoard);

        return {board: newBoard, score: newScore};
    };

    const moveLeft = (inputBoard) => {
        let newBoard = [];
        let newScore = 0;

        // Shift all numbers to the left
        for (let r = 0; r < inputBoard.length; r++) {
            let row = [];
            for (let c = inputBoard[r].length - 1; c >= 0; c--) {
                let current = inputBoard[r][c];
                current === 0 ? row.push(current) : row.unshift(current);
            }
            newBoard.push(row);
        }

        // Combine numbers and shift to left
        for (let r = 0; r < newBoard.length; r++) {
            for (let c = 0; c < newBoard.length; c++) {
                if (newBoard[r][c] > 0 && newBoard[r][c] === newBoard[r][c + 1]) {
                    newBoard[r][c] = newBoard[r][c] * 2;
                    newBoard[r][c + 1] = 0;
                    newScore += newBoard[r][c];
                } else if (newBoard[r][c] === 0 && newBoard[r][c + 1] > 0) {
                    newBoard[r][c] = newBoard[r][c + 1];
                    newBoard[r][c + 1] = 0;
                }
            }
        }

        return {board: newBoard, score: newScore};
    };

    const rotateRight = (matrix) => {
        let result = [];

        for (let c = 0; c < matrix.length; c++) {
            let row = [];
            for (let r = matrix.length - 1; r >= 0; r--) {
                row.push(matrix[r][c]);
            }
            result.push(row);
        }

        return result;
    };

    const rotateLeft = (matrix) => {
        let result = [];

        for (let c = matrix.length - 1; c >= 0; c--) {
            let row = [];
            for (let r = matrix.length - 1; r >= 0; r--) {
                row.unshift(matrix[r][c]);
            }
            result.push(row);
        }

        return result;
    };

    // Check to see if there are any moves left
    const checkForGameOver = (currentBoard) => {
        const moves = [
            boardMoved(currentBoard, moveUp(currentBoard).board),
            boardMoved(currentBoard, moveRight(currentBoard).board),
            boardMoved(currentBoard, moveDown(currentBoard).board),
            boardMoved(currentBoard, moveLeft(currentBoard).board)
        ];

        return !moves.includes(true);
    };


    const renderBoard = () => {
        if (!board) return null;

        return (
            <div className={`game-board`} {...handlers}>
                {board.map((cell, i) => (
                    <Row key={i} row={cell}/>
                ))}
            </div>
        );
    };

    return (
        <>
            {renderBoard()}
            <p>{message}</p>
        </>
    );
};

const Row = ({row}) => {
    return (
        <>
            {row.map((cell, i) => (
                <Cell key={i} cellValue={cell}/>
            ))}
        </>
    );
};

const Cell = ({cellValue}) => {
    let color = 'cell';
    let value = (cellValue === 0) ? '' : cellValue;
    if (value) {
        color += ` color-${value}`;
    }
    return (
        <>
            <div className={`item ${color}`}>{value}</div>
        </>
    );
};

export default Game;