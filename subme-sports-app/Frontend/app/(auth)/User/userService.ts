import httpClient from "../../../utils/http-common"

/**
 * Faq service, define all the CRUD operations here
 * @returns 
 */
const getAllUsers = () => {
  return httpClient.get("/user");
};

const checkUserExists = (id) =>{
  return httpClient.get(`/userExist/${id}`);
}

const createUser = (data) => {
  return httpClient.post("/user", data);
};

const getUserById = (id) => {
  return httpClient.get(`/user/${id}`);
};

const updateUser = (id, data) => {
  return httpClient.put(`/user/${id}`, data);
};

const deleteUserById = (id) => {
  return httpClient.delete(`/user/${id}`);
};

export default { getAllUsers, checkUserExists, createUser, getUserById, updateUser, deleteUserById };
