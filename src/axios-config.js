import axios from "axios";

const instance = axios.create({
  // baseURL: "http://13.60.82.207:5000/",
  baseURL: "http://localhost:3001/api/auth/",

});

export default instance;