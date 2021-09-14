import axios from 'axios';


//Axios global request Headers
//https://github.com/axios/axios#global-axios-defaults

//development: axios.defaults.baseURL = 'https://127.0.0.1:8000/api/v1';
//axios.defaults.baseURL = 'djminesbackend.respuestadigital.com.ar/api/v1';

/**
 * load games of the logged user from mines server
 * @return {games} [] object
 */
export const getGames = () => {
    return axios({
        method: 'get',
        url: 'https://djminesbackend.respuestadigital.com.ar/api/v1/users/games/',
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type':'application/json'
        },
      })
        .then(response => response.data)
}

/**
 * load a game
 * @return {game} object
 */
 export const getLoggedUser = () => {
    return axios({
        method: 'get',
        url: 'https://djminesbackend.respuestadigital.com.ar/api/v1/users/auth/user/',
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type':'application/json'
        },        
      })
        .then(response => response.data)
}

/**
 * loag game from mines server
 * @param {gameId} number
 * @return {game} object
 */
export const getGameFromBackend = ( gameId ) => {
    return axios({
        method: 'get',
        url: `https://djminesbackend.respuestadigital.com.ar/api/v1/users/games/${gameId}`,
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type':'application/json'
        },
      })
        .then(response => response.data)
}

/**
 * delete game from mines server
 * @param {gameId} number
 */
 export const deleteGameFromBackend = ( gameId ) => {
    return axios({
        method: 'delete',
        url: `https://djminesbackend.respuestadigital.com.ar/api/v1/users/games/${gameId}`,
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type':'application/json'
        },
      })
}

/**
 * Create game in backend
 * @param {newGameData} object
 * @return {game} object
 */
export const createGameInBackend = ( newGameData ) => {
    return axios({
        method: 'post',
        url: `https://djminesbackend.respuestadigital.com.ar/api/v1/users/games/`,
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type':'application/json'
        },
        data: JSON.stringify({
            useremail: newGameData.useremail,
            rows: newGameData.rows,
            columns: newGameData.columns,
            mines: newGameData.mines,
        }),
      })
        .then(response => response.data)
}
/**
 * Save state of the game in the mines server
 * Return the updated game
 * @param {gameId} number
 * @param {state} string
 * @param {board} array
 * @return {game} object
 */
export const saveGameInBackend = (gameId, state, state_board) => {

    const state_board_json = JSON.stringify(state_board)
    console.log(state_board_json);
    return axios({
        method: 'put',
        url: `https://djminesbackend.respuestadigital.com.ar/api/v1/users/games/${gameId}/`,
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type':'application/json'
        },
        data: JSON.stringify({
            state,
            state_board: state_board_json
        }),
      })
        .then(response => response.data)
}