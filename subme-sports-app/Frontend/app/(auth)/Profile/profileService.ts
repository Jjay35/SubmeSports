import httpClient from "../../../utils/http-common"

/**
 * Faq service, define all the CRUD operations here
 * @returns 
 */
const getAllProfile = () => {
  return httpClient.get("/profile");
};

const createProfile = (data) => {
  return httpClient.post("/profile", data);
};

const getProfileById = (id) => {
  return httpClient.get(`/profile/${id}`);
};

const updateProfile = (id, data) => {
  return httpClient.put(`/profile/${id}`, data);
};

const deleteProfileById = (id) => {
  return httpClient.delete(`/profile/${id}`);
};

export default { getAllProfile, createProfile, getProfileById, updateProfile, deleteProfileById };
