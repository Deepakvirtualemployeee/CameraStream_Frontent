import * as actionTypes from "./actionTypes";
import axios from "../../axios-config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
};

export const createDvir = (payload) => async (dispatch) => {
  dispatch({ type: actionTypes.CREATE_DVIR_REQUEST });

  try {
    const toId = (val) => {
      const candidate = val?.value || val?.id || val?._id || val?.name || val;
      return typeof candidate === "string" && candidate.match(/^[a-fA-F0-9]{24}$/)
        ? candidate
        : null;
    };

    const cleanPayload = {
      vehicleId: payload.vehicleId,
      driverId: payload.driverId,
      trailers: payload.trailers || "",
      location: payload.location,
      dateTime: payload.dateTime,
      odometer: payload.odometer || 0,
      unitDefects: (payload.unitDefects || [])
        .map(toId)
        .filter(Boolean),
      trailerDefects: (payload.trailerDefects || [])
        .map(toId)
        .filter(Boolean),
      status: payload.status,
      safetyStatus: payload.safetyStatus,
      notes: payload.notes || "",
    };

    const { data } = await axios.post("/dvirs", cleanPayload, {
      headers: getAuthHeaders(),
    });

    dispatch({
      type: actionTypes.CREATE_DVIR_SUCCESS,
      payload: data?.data || null,
    });
    return data?.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error.message || "Failed to create DVIR";
    dispatch({
      type: actionTypes.CREATE_DVIR_FAIL,
      payload: message,
    });
    throw error;
  }
};

export const getDvirs = ({ companyId, driverId, vehicleId } = {}) => async (dispatch) => {
  dispatch({ type: actionTypes.GET_DVIRS_REQUEST });
  try {
    const params = new URLSearchParams();
    if (companyId) params.append("companyId", companyId);
    if (driverId) params.append("driverId", driverId);
    if (vehicleId) params.append("vehicleId", vehicleId);

    const { data } = await axios.get(`/dvirs?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    dispatch({
      type: actionTypes.GET_DVIRS_SUCCESS,
      payload: data?.data || [],
    });
    return data?.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Failed to fetch DVIRs";
    dispatch({ type: actionTypes.GET_DVIRS_FAIL, payload: message });
    throw error;
  }
};

export const getUnitDefects = () => async (dispatch) => {
  dispatch({ type: actionTypes.GET_UNIT_DEFECTS_REQUEST });
  try {
    const { data } = await axios.get("/dvir/unit-defects", {
      headers: getAuthHeaders(),
    });
    const items = (data?.data || []).map((item) => ({
      value: item._id || item.id,
      label: item.name,
    }));
    dispatch({
      type: actionTypes.GET_UNIT_DEFECTS_SUCCESS,
      payload: items,
    });
    return items;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Failed to fetch unit defects";
    dispatch({ type: actionTypes.GET_UNIT_DEFECTS_FAIL, payload: message });
    throw error;
  }
};

export const getTrailerDefects = () => async (dispatch) => {
  dispatch({ type: actionTypes.GET_TRAILER_DEFECTS_REQUEST });
  try {
    const { data } = await axios.get("/dvir/trailer-defects", {
      headers: getAuthHeaders(),
    });
    const items = (data?.data || []).map((item) => ({
      value: item._id || item.id,
      label: item.name,
    }));
    dispatch({
      type: actionTypes.GET_TRAILER_DEFECTS_SUCCESS,
      payload: items,
    });
    return items;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Failed to fetch trailer defects";
    dispatch({ type: actionTypes.GET_TRAILER_DEFECTS_FAIL, payload: message });
    throw error;
  }
};

export const getDvirById = (id) => async (dispatch) => {
  dispatch({ type: actionTypes.GET_DVIR_BY_ID_REQUEST });
  try {
    const { data } = await axios.get(`/dvirs/${id}`, {
      headers: getAuthHeaders(),
    });
    dispatch({
      type: actionTypes.GET_DVIR_BY_ID_SUCCESS,
      payload: data?.data || null,
    });
    return data?.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Failed to fetch DVIR";
    dispatch({ type: actionTypes.GET_DVIR_BY_ID_FAIL, payload: message });
    throw error;
  }
};

export const updateDvir = (id, payload) => async (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_DVIR_REQUEST });
  try {
    const toId = (val) => {
      const candidate = val?.value || val?.id || val?._id || val?.name || val;
      return typeof candidate === "string" && candidate.match(/^[a-fA-F0-9]{24}$/)
        ? candidate
        : null;
    };

    const cleanPayload = { ...payload };

    if (Object.prototype.hasOwnProperty.call(payload, "unitDefects")) {
      cleanPayload.unitDefects = (payload.unitDefects || [])
        .map(toId)
        .filter(Boolean);
    }

    if (Object.prototype.hasOwnProperty.call(payload, "trailerDefects")) {
      cleanPayload.trailerDefects = (payload.trailerDefects || [])
        .map(toId)
        .filter(Boolean);
    }

    Object.keys(cleanPayload).forEach((key) => {
      const val = cleanPayload[key];
      if (val === undefined || val === "") {
        delete cleanPayload[key];
      }
    });

    const { data } = await axios.put(`/dvirs/${id}`, cleanPayload, {
      headers: getAuthHeaders(),
    });

    dispatch({
      type: actionTypes.UPDATE_DVIR_SUCCESS,
      payload: data?.data || null,
    });
    return data?.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Failed to update DVIR";
    dispatch({ type: actionTypes.UPDATE_DVIR_FAIL, payload: message });
    throw error;
  }
};
