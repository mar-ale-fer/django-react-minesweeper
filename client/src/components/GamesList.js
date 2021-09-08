import React, { useState, useEffect } from 'react';
import axios from 'axios';
const GameList = () => {
  const [gamelist, setgamelist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/api/v1/users/games/',
        headers: {
            'content-type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
        .then(response => response.data)
        .then(data => {
            setgamelist(data);
            setLoading(false);
        });
    
  }, []);

  return (
    <div>
      {loading === false && (
        <>
          {gamelist.map((game, i) => (
            <div>
                {`game #${game.id} start on:${game.start_str_ser} rows:${game.rows} columns:${game.columns} mines:${game.mines} time elapsed:${game.state_time_elapsed}`}
            </div>
        ))}
        </>
      )}
    </div>
  );
};

export default GameList;
