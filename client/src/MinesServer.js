import axios from 'axios';

/**
 * loag game from mines server
 * @param {gameId} number
 * @return {game} object
 */
export const getGameFromBackend = ( gameId ) => {
    return axios({
        method: 'get',
        url: `http://127.0.0.1:8000/api/v1/users/games/${gameId}`,
        headers: {
            'content-type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`
        }
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
        url: `http://127.0.0.1:8000/api/v1/users/games/${gameId}/`,
        headers: {
            'content-type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`
        },
        data: JSON.stringify({
            state,
            state_board: state_board_json
        }),
      })
        .then(response => response.data)
}