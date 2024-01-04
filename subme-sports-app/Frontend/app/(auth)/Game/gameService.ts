import httpClient from "../../../utils/http-common"

/**
 * Faq service, define all the CRUD operations here
 * @returns 
 */
const getAllGame = (userID) => {
  return httpClient.get(`/games/${userID}`);
};

const getGameByID = (id) => {
  return httpClient.post(`/game/${id}`);
};

const createGame = (data) => {
  return httpClient.post(`/game`, data);
};

const updateGame = (id, data) => {
  return httpClient.put(`/game/${id}`, data);
};

const deleteGameByID = (id) => {
  return httpClient.delete(`/game/${id}`);
};

const getPlayersName = (gameId) => {
  return httpClient.get(`/game/playersJoined/${gameId}`)
}

const checkPlayerJoin = (gameId, userID) => {
  return httpClient.get(`/game/isJoined/${gameId}/${userID}`)
}

const getWaitListName = (gameId) => {
  return httpClient.get(`/game/playersInWaitlist/${gameId}`)
}

const getActiveGames = (userID) => {
  return httpClient.get(`/game/active/${userID}`)
}

const getPastGames = (userID) => {
  return httpClient.get(`/game/past/${userID}`)
}

export default { getAllGame, getGameByID, createGame, updateGame, deleteGameByID , getPlayersName, checkPlayerJoin, getWaitListName, getActiveGames, getPastGames};
