import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : "http://localhost:3001/api/";

    // console.log("Base Url:", baseURL);
const instance = axios.create({
  baseURL
});

export default instance;
