import * as actionTypes from "./actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";

export const startUsers = () => ({ type: actionTypes.START_USERS });
export const usersFail = (msg) => ({ type: actionTypes.USERS_FAIL, message: msg });
export const createUserSuccess = (user, msg) => ({
  type: actionTypes.CREATE_USER_SUCCESS,
  payload: user,
  message: msg,
});

export const createUser = (data) => {
  return async (dispatch) => {
    try {
      dispatch(startUsers());
      const token = localStorage.getItem("token");

      const res = await axios.post("/users", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      dispatch(createUserSuccess(res.data?.data, res.data?.message || "User created"));
      toast.success(res.data?.message || "User created successfully!");
    } catch (err) {
      dispatch(usersFail(err?.response?.data?.message || "Failed to create user"));
      toast.error(err?.response?.data?.message || "Failed to create user");
    }
  };
};
