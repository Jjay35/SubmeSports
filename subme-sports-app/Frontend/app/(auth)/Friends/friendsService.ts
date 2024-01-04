import httpClient from "../../../utils/http-common"

/**
 * Friends service, define all the CRUD operations here
 * @returns 
 */
const getAllFriends = (userId) => {
  return httpClient.get(`/friends/${userId}`);
};

/**
 * Gets all friend requests for a user
 * @param userId Gets
 * @returns 
 */
const getAllFriendRequests = (userId) => {
  return httpClient.get(`/friends/requests/${userId}`);
};


/**
 * Returns a friend Details object based on the two user IDs
 * retuns properties of the friend relationship if it exists, else returns
 * a template of a friendDetails object with status = 'N'
 * @param currUserId 
 * @param friendUserId 
 * @returns 
 */
const checkFriendsStatus =  (currUserId, friendUserId) => {
  return httpClient.get(`/friends/checkFriendsStatus/${currUserId}/${friendUserId}`);
}

/**
 * User who initiates friend request will have their status set to 'P'
 * whereas the requested user will have their status set to 'R'
 * @param currUserId 
 * @param friendUserId 
 * @returns 
 */
const createFriendRequest = (currUserId, friendUserId) =>{
  return httpClient.post(`/friends/${currUserId}/${friendUserId}`);
}

/**
 * Confirms friend requests,
 * both users will have their status set to 'F'
 * @param currUserId 
 * @param friendUserId 
 * @returns 
 */
const confirmFriendRequest = (currUserId, friendUserId) =>{
  return httpClient.put(`/friends/${currUserId}/${friendUserId}`);
}

/**
 * Deletes friend requests, remove friend relation from both users
 * @param currUserId 
 * @param friendUserId 
 * @returns 
 */
const rejectFriendRequest = (currUserId, friendUserId) =>{
  return httpClient.delete(`/friends/${currUserId}/${friendUserId}`);
}

const updateFriendDetails = (currUserId, friendDetailsObject) =>{
  return httpClient.put(`/friends/${currUserId}`, friendDetailsObject);
}



export default { getAllFriends, getAllFriendRequests, checkFriendsStatus, createFriendRequest, confirmFriendRequest, rejectFriendRequest, updateFriendDetails};
