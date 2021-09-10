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
    const [loading, setLoading] = useState(true);

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
            const gameData = {
                minesToFind: game.mines,
                won: false,
                lost: false,
                board: initboard(game.rows, game.columns, game.mines),
            }
            setGameData(gameData);
        }
        setLoading(false);
    }, [game]);

    const initboard = (rows, columns, mines) => {
        let board= new Array(rows)

        for (let row= 0; row < rows; row++) {
            board[row] = new Array(columns)
            for (let column= 0; column < columns; column++) {
                board[row][column] = {
                    x:column,
                    y:row,
                    isMine: false,
                    minesNear: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                }
            }

        }
        return board;
    };

    const DrawBoard =(board) => {
        return board.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            value={dataitem}
                        />
                    </div>);
            })
        });

    };
    console.log(gameData.board)
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
                            </div>
                            {
                                gameData && gameData.board && (
                                    DrawBoard(gameData.board)
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