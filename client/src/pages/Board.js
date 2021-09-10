import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cell from '../components/Cell';
import styled from 'styled-components/macro';


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
    const [gameLoaded, setGameLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [forceUpdate, setForceUpdate] = useState(0);

    useEffect(() => {
        axios({
          method: 'get',
          url: `http://127.0.0.1:8000/api/v1/users/games/${id}`,
          headers: {
              'content-type': 'application/json',
              Authorization: `Token ${localStorage.getItem('token')}`
          }
        })
          .then(response => response.data)
          .then(data => {
              setGame(data);
          });
          
    }, [id]);


    useEffect(() => {

        if (game.state === 'NOT_STARTED') {
            const rows = game.rows;
            const columns = game.columns;
            const mines = game.mines
            const newGameData = {
                minesToFind: game.mines,
                won: false,
                lost: false,
                board: initboard(rows, columns, mines),
            }
            setGameData(newGameData);
        }
        setLoading(false);
    },[game]);


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
                        updatedBoard[row][column].nearbyMines = 0;
                    }
                    updatedBoard[row][column].isEmpty = false;
                    updatedBoard[row][column].nearbyMines = nerbyMines;
                }
            }
        }
        return (updatedBoard);
    }


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
                if (cell.isEmpty) {
                    revealEmptyCell(cell.row, cell.column, board);
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

    const DrawBoard = (board, rows, propForceUpdate) => {

        console.log(`drawboard (${propForceUpdate})`);
        console.log(board)
        return board.map((datarow) => {
            return datarow.map((cellData) => {
                return (
                    <div key={`${cellData.childen_key}`}>
                        <Cell
                            cellData={cellData} revealed={cellData.isRevealed} 
                        />
                    </div>);
            })
        });

    };

    return (
        <div>
          {loading === false && (
            <>
                {
                    gameData && (
                        <StyledGame columns={game.columns}>
                            <div className="board">
                            <div className="game-info">
                                <span className="info">mines: {gameData.minesToFind}</span><br />
                                <span className="info">{gameData.won ? "You Win" : ""}</span>
                                <button onClick={()=> revealBoard()}>
                                    reveal board test
                                </button>
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