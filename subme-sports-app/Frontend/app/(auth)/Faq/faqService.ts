import httpClient from "../../../utils/http-common"

/**
 * Faq service, define all the CRUD operations here
 * @returns 
 */
const getAllFaqs = () => {
  return httpClient.get("/faqs");
};

const createFaq = (data) => {
  return httpClient.post("/faqs", data);
};

const getFaqById = (id) => {
  return httpClient.get(`/faqs/${id}`);
};

const updateFaq = (data) => {
  return httpClient.put("/faqs", data);
};

const deleteFaqById = (id) => {
  return httpClient.delete(`/faqs/${id}`);
};

export default { getAllFaqs, createFaq, getFaqById, updateFaq, deleteFaqById };
