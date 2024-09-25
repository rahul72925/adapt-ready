import axios from "axios";

// Create an instance of Axios
const apiClient = axios.create({
  baseURL: "http://localhost:4002/server/api/v1", // hardcoded for now | we can use env variable here
  timeout: 10000,
});

export default apiClient;
