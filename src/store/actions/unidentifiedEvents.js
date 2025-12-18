import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";

const token = localStorage.getItem("token");

export const getUnidentifiedEvents =
  ({
    startDate,
    endDate,
    vehicleId = "all",
    assumed = "all",
    sort = "desc",
    page = 1,
    limit = 20,
    append = false,
  } = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionTypes.GET_UNIDENTIFIED_EVENTS_REQUEST });

      const res = await axios.get("/unidentified-events", {
        params: {
          startDate,
          endDate,
          vehicleId,
          assumed,
          sort,
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: actionTypes.GET_UNIDENTIFIED_EVENTS_SUCCESS,
        payload: {
          data: res.data?.data || [],
          meta: res.data?.meta || null,
          append,
        },
      });
    } catch (error) {
      dispatch({
        type: actionTypes.GET_UNIDENTIFIED_EVENTS_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

