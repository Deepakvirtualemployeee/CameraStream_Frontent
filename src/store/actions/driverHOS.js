import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";
const token = localStorage.getItem("token");

export const getDriversHOS = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_HOS_REQUEST });

    const token = localStorage.getItem("token");
    const { data } = await axios.get(`/drivehos/list?companyId=${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Company:", companyId);
    console.log("HOS list:", data);
    dispatch({ type: actionTypes.GET_DRIVERS_HOS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_HOS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
