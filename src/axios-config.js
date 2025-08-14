import axios from "axios";

const instance = axios.create({
  baseURL: "http://a56af6c3afc3c40dbac0bcdefcb0981c-2a093a3ce85fd9ff.elb.us-east-1.amazonaws.com/api/",
});

export default instance;