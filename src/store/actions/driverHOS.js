
import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";
const token = localStorage.getItem("token");

export const getDriversHOS = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_HOS_REQUEST });

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

export const getDriverLogs = (driverId, logDate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_LOGS_REQUEST });

    const { data } = await axios.get(`/driverLogs?driverId=${driverId}&logDate=${logDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Company:", companyId);
    console.log("Driver logs:", data);
    dispatch({ type: actionTypes.GET_DRIVERS_LOGS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_LOGS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Fetch driver circle data; ensures logDate is always sent as YYYY-MM-DD when provided
export const getDriverData = (driverId, logDate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_DATA_REQUEST });

    if (!driverId) {
      throw new Error("driverId is required");
    }

    if (!logDate) {
      console.error("❌ logDate is missing!");
    }

    const params = {
      driverId: driverId,
      logDate: logDate, // always send it
    };

    console.log("🚀 FINAL PARAMS:", params);

    const { data } = await axios.get("/fetchCircle", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: actionTypes.GET_DRIVERS_DATA_SUCCESS,
      payload: data.data,
    });

  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_DATA_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};



export const getMobileSettings = (driverId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_SETTINGS_REQUEST });

    const { data } = await axios.get(`/mobileSetting?driverId=${driverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Company:", companyId);
    console.log("Mobile settings:", data);
    dispatch({ type: actionTypes.GET_DRIVERS_SETTINGS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_SETTINGS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getProcessedDriverData = (driverId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_PROCESSED_DATA_REQUEST });

    const { data } = await axios.get(`/processDriverData?driverId=${driverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Company:", companyId);
    console.log("ProcessedDriverData:", data);
    dispatch({ type: actionTypes.GET_DRIVERS_PROCESSED_DATA_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_PROCESSED_DATA_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Add/Edit Event Action
export const addEditEvent = (companyId, driverId, eventId = null, eventData, selectedDate, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ADD_DRIVERS_EVENT_LOG_REQUEST });

    const res = await axios.post(
      `/addEditEvent?companyId=${companyId}&DriverId=${driverId}&eventId=${eventId}`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Params:", `/addEditEvent?companyId=${companyId}&DriverId=${driverId}&eventId=${eventId}`);
    console.log("Event data", eventData);
    console.log("res", res);
    console.log("selected date", selectedDate);

    dispatch({
      type: actionTypes.ADD_DRIVERS_EVENT_LOG_SUCCESS,
      payload: res.data.data,
    });

    if (eventId) {
      toast.success("Event updated successfully!");
    } else {
      toast.success("Event added successfully!");
    }
    // Prefer the event's own date (if provided) so we return to the exact edited day
    const redirectDate =
      (Array.isArray(eventData) && eventData[0]?.eventDateTime) || selectedDate || new Date();

    if (navigate)
      navigate(`/driver-hos/graph-details/${companyId}/${driverId}`, {
        state: { selectedDate: redirectDate },
      }); // redirect after success

    return true;
  } catch (err) {
    console.log(err);
    dispatch({
      type: actionTypes.ADD_DRIVERS_EVENT_LOG_FAIL,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to add event");
    return false;
  }
};

// Delete event
export const deleteEvent = (companyId, driverId, eventId, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DELETE_DRIVER_EVENT_LOG_REQUEST });

    await axios.delete(`/deleteEvent?companyId=${companyId}&driverId=${driverId}&eventId=${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // just remove from redux by id
    dispatch({ type: actionTypes.DELETE_DRIVER_EVENT_LOG_SUCCESS, payload: eventId });

    toast.success("Event deleted successfully");
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.DELETE_DRIVER_EVENT_LOG_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    console.error("Delete event error:", error);
    toast.error(error.response?.data?.message || "Failed to delete event");
  }
};

// Add trailers/shipping docs action
export const trailerShippingDocs = (companyId, driverId, eventData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ADD_DRIVERS_TRAILERS_DATA_REQUEST });

    const res = await axios.post(
      `/trailerShippingDocs?driverId=${driverId}`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Trailer data", eventData);
    console.log("res", res);
    dispatch({
      type: actionTypes.ADD_DRIVERS_TRAILERS_DATA_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Trailer & ShippingDocs updated successfully!");
    
    if (navigate) navigate(`/driver-hos/graph-details/${companyId}/${driverId}`); // redirect after success

    return true;
  } catch (err) {
    console.log(err);
    dispatch({
      type: actionTypes.ADD_DRIVERS_TRAILERS_DATA_FAIL,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to add data");
    return false;
  }
};

export const getDriversEventSummary = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_EVENT_SUMMARY_REQUEST });

    const { data } = await axios.get(`/getDriversEventSummary?companyId=${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Company:", companyId);
    console.log("Event Summary:", data);
    dispatch({ type: actionTypes.GET_DRIVERS_EVENT_SUMMARY_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_EVENT_SUMMARY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
