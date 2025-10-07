import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});
 

export const getOwner = async () => (await api.get("/owner")).data;
export const createOwner = async (data) => (await api.post("/owner", data)).data;
export const updateOwner = async (data) => (await api.put("/owner", data)).data;

