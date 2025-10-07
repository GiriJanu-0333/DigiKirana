import axios from "axios";

const API = "http://localhost:8080/api/owner";

export const getOwner = async () => {
  return await axios.get(API);
};

export const createOwner = async (data) => {
  return await axios.post(API, data);
};

export const updateOwner = async (data) => {
  return await axios.put(API, data);
};
