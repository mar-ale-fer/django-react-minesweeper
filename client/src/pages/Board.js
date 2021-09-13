import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Cell from '../components/Cell';
import styled from 'styled-components/macro';
import { getGameFromBackend, saveGameInBackend } from '../MinesServer';
import { catchErrors } from '../utils';
const StyledGame = styled.div`

    max-width: ${props => (props.columns * 40)}px;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
`

const Board = () => {
    const { id } = useParams();
    const [game, setGame] = useState({});
    const [gameData, setGameData] = useState({});
    const [loading, setLoading] = useState(true);
    const [forceUpdate, setForceUpdate] = useState(0);

    useEffect(() => {

        const fetchData = async () => {
            const gameFromBackend = await getGameFromBackend( id );
            setGame(gameFromBackend);
        }

        catchErrors(fetchData());
          
    }, [id]);


    useEffect(() => {
        const calculateNearbyMines = (board, rows, columns) => {
            let updatedBoard = board;
    
            for (let row= 0; row < rows; row++) {
                for (let column= 0; column < columns; column++) {
                    if (board[row][column].isMine !== true){
                        const nearbyCells = getNearbyCells(row,column, rows, columns, board);
                        
                        let nerbyMines = nearbyCells.reduce( (previousValue , current  ) => {  
                            if (current.isMine) {
                                return previousValue + 1;
                            } else {
                                return previousValue;
                            }
                        }, 0)
                        //not nearby mines found
                        if (nerbyMines ===0) {
                            updatedBoard[row][column].isEmpty = true;
                        }
                        updatedBoard[row][column].nearbyMines = nerbyMines;
                    }
                }
            }
            return (updatedBoard);
        }

        const initboard = (rows, columns, mines) => {

            let board= new Array(rows)
    
            for (let row= 0; row < rows; row++) {
                board[row] = new Array(columns)
                for (let column= 0; column < columns; column++) {
                    board[row][column] = {
                        childen_key : `(${row}:${column})`,
                        row,
                        column,
                        isMine: false,
                        nearbyMines: 0,
                        isRevealed: false,
                        isEmpty: false,
                        isFlagged: false,
                    }
                }
            }
            //create mines in the board
            board = createMines(board, rows, columns, mines)
            //calculate nearbyMines for each cell
            board =  calculateNearbyMines(board, rows, columns)
    
            return board;
        };

        if (game.state === 'NOT_STARTED') {
            const rows = game.rows;
            const columns = game.columns;
            const mines = game.mines
            const newGameData = {
                won: false,
                lost: false,
                board: initboard(rows, columns, mines),
            };
            setGameData(newGameData);
        } else if (game.state === 'STARTED') {
            const newGameData = {
                won: false,
                lost: false,
                board: JSON.parse(game.state_board),
            };
            setGameData(newGameData);    
        } else if (game.state === 'WON') {
            const newGameData = {
                won: true,
                lost: false,
                board: JSON.parse(game.state_board),
            };
            setGameData(newGameData);    
        } else if (game.state === 'LOST') { //LOST
            const newGameData = {
                won: false,
                lost: true,
                board: JSON.parse(game.state_board),
            };
            setGameData(newGameData);   
        } 
        setLoading(false);
    },[game]);

    const createMines = (board, rows, columns, mines) =>{
        let mineRow, mineColumn, minesCreated = 0;
        while (minesCreated < mines) {
            mineRow = Math.floor(Math.random() * rows);
            mineColumn = Math.floor(Math.random() * columns);
            if (!(board[mineRow][mineColumn].isMine)) {
                board[mineRow][mineColumn].isMine = true;
                minesCreated++;
            }
        }

        return (board);
    }

    const revealBoard = () => {
        console.log('revealBoard');
        let newGameData = gameData;
        newGameData.board.map((row) => {
            row.map((cell) =>{
                cell.isRevealed = true;
            });
        });

        setForceUpdate(forceUpdate+1);
        setGameData(newGameData);
    }

    const revealEmptyCell = (row, column, rows, columns, board) => {
        const nearbyCells = getNearbyCells(row,column, rows, columns, board);
        nearbyCells.map( cell => {
            if (!cell.isRevealed && (cell.isEmpty || !cell.isMine)) {
                board[cell.row][cell.column].isRevealed = true;
                board[cell.row][cell.column].isFlagged = false;
                if (cell.isEmpty) {
                    revealEmptyCell(cell.row, cell.column, rows, columns, board);
                }
            }
        })
        return board;
    }

    const getNearbyCells = (row,column, rows, columns, board) => {
        const nearbyCells = [];
        //up
        if ( row > 0) nearbyCells.push(board[row-1][column]);
        //down
        if (row < rows - 1) {nearbyCells.push(board[row+1][column]);};
        //left
        if (column > 0 ) {nearbyCells.push(board[row][column - 1]);};
        //right
        if (column < columns - 1) {nearbyCells.push(board[row][column + 1]);};
        // top left
        if ( row > 0 && column > 0) {nearbyCells.push(board[row - 1][column - 1]);};
        // top right
        if ( row > 0 && column < columns - 1) {nearbyCells.push(board[row - 1][column + 1]);};
        // bottom left
        if ( row < rows - 1 && column > 0) {nearbyCells.push(board[row + 1][column - 1]);};
        // bottom right
        
        if ( row < rows - 1  && column < columns - 1) {
            nearbyCells.push(board[row + 1][column + 1]);
        };
        return (nearbyCells);
    }


    const boardToArrayOfCells = (board) => {
            let cellsArray = [];

            board.map(row => {
                row.map((cell) => {
                    if (!cell.isRevealed) {
                        cellsArray.push(cell);
                    }
                });
            });

            return cellsArray
    }

    const numberOfHiddenCells = (board) => {
        //convert the board toa one-dimensional array
        let cellsArray = boardToArrayOfCells(board);
        let number = cellsArray.reduce( (previousValue , current  ) => {  
            if (!current.isRevealed) {
                return previousValue + 1;
            } else {
                return previousValue;
            }
        }, 0)
        return number;
    }

    const numberOfFlaggedCells = (board) => {
        //convert the board toa one-dimensional array
        let cellsArray = boardToArrayOfCells(board);
        let number = cellsArray.reduce( (previousValue , current  ) => {  
            if (current.isFlagged) {
                return previousValue + 1;
            } else {
                return previousValue;
            }
        }, 0)
        return number;
    }


    const handleCellClick = (row, column) => {
        const rows = game.rows;
        const columns = game.columns;
        const mines = game.mines;
        let won = false; 
        let lost = false;
        //if revealed, do nothing
        if (gameData.board[row][column].isRevealed) return null;

        //if is mine. lost the game
        if (gameData.board[row][column].isMine) {
            revealBoard();
            alert("Game over");
            lost = true;
        }

        
        let newGameData = gameData; 
        newGameData.board[row][column].isFlagged = false;
        newGameData.board[row][column].isRevealed = true;

        if (newGameData.board[row][column].isEmpty) {
            newGameData.board = revealEmptyCell(row, column,rows, columns, newGameData.board);
        }

        if (numberOfHiddenCells(newGameData.board) === mines) {
            won = true;
            revealBoard();
            alert("You Win");
        }

        newGameData.won = won;
        newGameData.lost = lost;
        setGameData(newGameData);
        saveOnBackend();
        setForceUpdate(forceUpdate+1);

    }

    const handleContextMenu = (evt,row, column) => {
        evt.preventDefault();
        console.log('handleContextMenu');
        const mines = game.mines;
        let newGameData = gameData;
        let won = false


        if (newGameData.board[row][column].isRevealed) return null;

        if (newGameData.board[row][column].isFlagged) {
            newGameData.board[row][column].isFlagged = false 
        } else {
            newGameData.board[row][column].isFlagged = true 
        }
        //if number of flags is equalt to the number of mines
        if (numberOfFlaggedCells(newGameData.board) === mines) {
            const mineArray = boardToArrayOfCells(newGameData.board).map( cell => {
                if (cell.isMine) return cell;
                })
            const FlagArray = boardToArrayOfCells(newGameData.board).map( cell => {
                if (cell.isFlagged) return cell;
                })     
            
            won = ( JSON.stringify(mineArray) === JSON.stringify(FlagArray));
            if (won) {
                revealBoard();
                alert("You win");
            }
        }
        newGameData.won = won;   
        setGameData(newGameData);
        saveOnBackend();
        setForceUpdate(forceUpdate+1);
    }

    
    const DrawBoard = (board, rows, propForceUpdate) => {

        console.log(`drawboard (${propForceUpdate})`);
        console.log(board)
        return board.map((datarow) => {
            return datarow.map((cellData) => {
                return (
                    <div key={`${cellData.childen_key}`}>
                        <Cell
                            cellData={cellData} 
                            revealed={cellData.isRevealed} 
                            onClick={()=> handleCellClick(cellData.row, cellData.column)}
                            contextMenu={(evt)=> handleContextMenu(evt, cellData.row, cellData.column)}
                        />
                    </div>);
            })
        });

    };

    const saveOnBackend = () => {
        let newGameState = ''
        if (gameData.won)  {
            newGameState = 'WON'
        } else if (gameData.lost) {
            newGameState = 'LOST'
        } else {
            newGameState = 'STARTED'
        }

        const saveData = async () => {
            const savedData = await saveGameInBackend(game.id, newGameState, gameData.board);
            console.log(savedData);
        }

        catchErrors(saveData())
    }

    return (
        <div>
          {loading === false && (
            <>
                {
                    gameData && (
                        <StyledGame columns={game.columns}>
                            <div className="board">
                            <div className="game-info">
                                <span className="info">Game #{game.id} mines: {game.mines}</span><br />
                                <span className="info">{gameData.won ? "You Win!" : ""}</span>
                                <span className="info">{gameData.lost ? "You Lose!" : ""}</span>
                            </div>
                            {
                                gameData && gameData.board && (
                                    DrawBoard(gameData.board, game.rows, forceUpdate)
                                )
                            }
                            </div>  

                        </StyledGame>                     
                    )


                        
                }
            </>
          )}
        </div>
      );
};

export default Board;