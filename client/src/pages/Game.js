import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameList from '../components/GamesList';
const Game = () => {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      window.location.replace('http://localhost:3000/login');
    } else {

      axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/api/v1/users/auth/user/',
        headers: {
            'content-type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
        .then(response => response.data)
        .then(data => {
          setUserEmail(data.email);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div>
      {loading === false && (
        <>
          <h1>Games</h1>
          <h2>Hello {userEmail}! your games:</h2>
          <GameList />
        </>
      )}
    </div>
  );
};

export default Game;
