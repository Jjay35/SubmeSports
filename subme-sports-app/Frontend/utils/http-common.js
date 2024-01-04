import axios from "axios";

export default axios.create({
  baseURL:
  //"http://localhost:8080/", // for local development

    "http://coms-402-006.class.las.iastate.edu:8080", // for remote server
  headers: {
    "Content-Type": "application/json",
  },
});
