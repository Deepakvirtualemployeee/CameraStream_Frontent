import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";

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

export const assignDriverToUnidentifiedEvent = ({ eventId, driverId }) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ASSIGN_UNIDENTIFIED_EVENT_REQUEST });

    const res = await axios.post(
      "/unidentified-events/assign-driver",
      { eventId, driverId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    dispatch({
      type: actionTypes.ASSIGN_UNIDENTIFIED_EVENT_SUCCESS,
      payload: res.data?.data,
    });

    toast.success(res.data?.message || "Driver assigned to event");
    return { success: true, data: res.data?.data, message: res.data?.message };
  } catch (error) {
    const message = error?.response?.data?.message || "Failed to assign driver";
    dispatch({
      type: actionTypes.ASSIGN_UNIDENTIFIED_EVENT_FAIL,
      payload: message,
    });
    toast.error(message);
    return { success: false, message };
  }
};
