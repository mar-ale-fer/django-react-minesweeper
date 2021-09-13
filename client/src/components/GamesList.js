import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGames } from '../MinesServer';
import { deleteGameFromBackend } from '../MinesServer';
import { catchErrors } from '../utils';
import {
	FaTrash,
} from 'react-icons/fa';
const GameList = ( props ) => {
  const [gamelist, setgamelist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      const gamesFromBackend = await getGames();
      setgamelist(gamesFromBackend);
      setLoading(false);
    }
    catchErrors(fetchData());    
    
  }, [props.propForceUpdate]);
  console.log(gamelist)
  console.log(props.propForceUpdate)

  const handleDeleteGame = ( gameId) => {
    const deleteGame = async () => {
      const NullDeletedGame = await deleteGameFromBackend( gameId );
      alert('Game deleted')
      props.onGameListChange(); 
    }

    catchErrors(deleteGame());   
  }

  const PlayViewMessage = (gameState) => {
    if (gameState === 'NOT_STARTED') {
      return 'Play game '
    } else if (gameState === 'STARTED') {
      return 'Resume game '
    } else if (gameState === 'LOST') {
      return 'View lost game '
    } else if (gameState === 'WON') {
      return 'View won game '
    }
   
    return 'Game in invalid state'
  }
  return (
    <div>
      {loading === false && gamelist && (
        <>
          {gamelist.map((game, i) => (
            <div key={game.id}>
              <Link to={`/board/${game.id}`}>
                {`${PlayViewMessage(game.state)} #${game.id} `}
              </Link>
              {`Created on:${game.start_str_ser}. With ${game.rows} rows, ${game.columns} columns, and ${game.mines} mines`}
              <button onClick={()=> handleDeleteGame(game.id)}>
                <FaTrash  className="has-text-primary" />
              </button>
            </div>
        ))}
        </>
      )}
    </div>
  );
};

export default GameList;
