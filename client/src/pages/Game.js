import React, { useState, useEffect } from 'react';
import GameList from '../components/GamesList';
import NewGameForm from '../components/NewGame';
import { getLoggedUser } from '../MinesServer';
import { catchErrors } from '../utils';
const Game = () => {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      window.location.replace('https://main.drvznpngbg4y4.amplifyapp.com/login');
    } else {

      const fetchData = async () => {
          const LoggedUser = await getLoggedUser( );
          setUserEmail(LoggedUser.email);
          setLoading(false);
      }

      catchErrors(fetchData());      

 
    }
  }, []);

  const handleGameListChange = () => {
    setForceUpdate(forceUpdate+1);
  };

  return (
    <div>
      {loading === false && (
        <>
          <h1>Games</h1>
          <NewGameForm userEmail={userEmail} onGameListChange={() => handleGameListChange()} />
          <h2>Hello {userEmail}! your games:</h2>
          

          <GameList propForceUpdate={forceUpdate} onGameListChange={() => handleGameListChange()}/>
        </>
      )}
    </div>
  );
};

export default Game;
