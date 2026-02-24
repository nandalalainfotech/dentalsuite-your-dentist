import axios from "axios";

export const sendGraphicalQuery = (query: any) => {
  return axios.post("/api/search", { query });
};