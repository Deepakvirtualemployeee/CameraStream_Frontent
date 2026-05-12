import axios from "../../axios-config";
import { toast } from "react-toastify";
import * as actionTypes from "../actions/actionTypes";

const getAuthConfig = () => ({
  headers: {
    "Content-Type": "application/json",
  },
});

const isRouteNotFoundError = (error) => {
  const status = error?.response?.status;
  const message = (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    ""
  )
    .toString()
    .toLowerCase();

  return status === 404 || message.includes("route not found") || message.includes("cannot");
};

const requestWithFallbacks = async (factories) => {
  let lastError;

  for (const createRequest of factories) {
    try {
      return await createRequest();
    } catch (error) {
      lastError = error;
      if (!isRouteNotFoundError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
};

const normalizeDriverPayload = (driverData = {}, companyId) => {
  const payload = {
    companyId: driverData.companyId || companyId,
    userName: driverData.userName || "",
    firstName: driverData.firstName || "",
    lastName: driverData.lastName || "",
    email: driverData.email || "",
    phoneNumber: driverData.phoneNumber || "",
    licenseState: driverData.licenseState || "",
    licenseNumber: driverData.licenseNumber || "",
    homeTerminal: driverData.homeTerminal || "",
    assignedVehicleId: driverData.assignedVehicleId || null,
    coDriverId: driverData.coDriverId || null,
    hosRules: driverData.hosRules || "",
    cargoType: driverData.cargoType || "",
    restart: driverData.restart || "",
    restBreak: driverData.restBreak || "",
    allowShortHaulException: Boolean(driverData.allowShortHaulException),
    allowSplitSleeperBerth: Boolean(driverData.allowSplitSleeperBerth),
    allowPersonalConveyance: Boolean(driverData.allowPersonalConveyance),
    allowYardMove: Boolean(driverData.allowYardMove),
    allowManualDriver: Boolean(driverData.allowManualDriver),
    restrictDriverFromCreationDateAndTime: Boolean(
      driverData.restrictDriverFromCreationDateAndTime
    ),
  };

  if (driverData.password) {
    payload.password = driverData.password;
  }

  if (driverData.confirmPassword) {
    payload.confirmPassword = driverData.confirmPassword;
  }

  return payload;
};

const extractDrivers = (data) => {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.docs)) return data.data.docs;
  if (Array.isArray(data?.docs)) return data.docs;
  return [];
};

const extractSingleDriver = (data) => {
  if (Array.isArray(data?.data)) return data.data[0] || null;
  if (Array.isArray(data?.data?.docs)) return data.data.docs[0] || null;
  return data?.data || null;
};

// Add Driver Action
export const addDriver = (companyId, driverData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ADD_DRIVER_REQUEST });

    const payload = normalizeDriverPayload(driverData, companyId);
    const res = await requestWithFallbacks([
      () => axios.post("/drivers", payload, getAuthConfig()),
      () => axios.post(`/drivers/add?companyId=${companyId}`, payload, getAuthConfig()),
    ]);

    dispatch({
      type: actionTypes.ADD_DRIVER_SUCCESS,
      payload: res.data?.data || payload,
    });

    toast.success(res.data?.message || "Driver added successfully!");
    if (navigate) navigate(`/settings/drivers-listing/${companyId}`);
    return true;
  } catch (err) {
    dispatch({
      type: actionTypes.ADD_DRIVER_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to add driver");
    return false;
  }
};

// Fetch Drivers by companyId
export const fetchDrivers = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.FETCH_DRIVERS_REQUEST });

    const { data } = await axios.get(`/drivers?companyId=${companyId}`, getAuthConfig());

    dispatch({
      type: actionTypes.FETCH_DRIVERS_SUCCESS,
      payload: extractDrivers(data),
    });
  } catch (err) {
    dispatch({
      type: actionTypes.FETCH_DRIVERS_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Get co-drivers
export const getCoDrivers = (companyId, driverId) => async (dispatch) => {
  try {
    const res = await requestWithFallbacks([
      () => axios.get(`/drivers/codrivers?companyId=${companyId}&driverId=${driverId}`, getAuthConfig()),
      () => axios.get(`/drivers/co-drivers?companyId=${companyId}&driverId=${driverId}`, getAuthConfig()),
    ]);

    dispatch({
      type: actionTypes.GET_CO_DRIVERS,
      payload: res.data?.data || [],
    });
  } catch (error) {
    console.error("Error fetching co drivers:", error);
    toast.error(error.response?.data?.message || "Failed to fetch co drivers");
  }
};

// Get driving license issuing state
export const getDriversIssuingState = () => async (dispatch) => {
  try {
    const res = await requestWithFallbacks([
      () => axios.get("/drivers/states", getAuthConfig()),
      () => axios.get("/drivers/license-states", getAuthConfig()),
    ]);

    dispatch({
      type: actionTypes.GET_DRIVERS_STATE,
      payload: res.data?.data || [],
    });
  } catch (error) {
    console.error("Error fetching driver states:", error);
    toast.error(error.response?.data?.message || "Failed to fetch driver states");
  }
};

// Get driver by ID
export const getDriverById = (companyId, id) => async (dispatch) => {
  try {
    dispatch({ type: "GET_DRIVER_REQUEST" });
    const res = await axios.get(`/drivers?companyId=${companyId}&driverId=${id}`, getAuthConfig());
    dispatch({
      type: "GET_DRIVER_SUCCESS",
      payload: extractSingleDriver(res.data),
    });
  } catch (err) {
    dispatch({
      type: "GET_DRIVER_FAILURE",
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Update driver
export const updateDriver = (companyId, id, driverData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_DRIVER_REQUEST" });

    const payload = normalizeDriverPayload(driverData, companyId);
    const res = await axios.put(
      `/drivers?companyId=${companyId}&driverId=${id}`,
      payload,
      getAuthConfig()
    );

    dispatch({
      type: "UPDATE_DRIVER_SUCCESS",
      payload: res.data?.data || payload,
    });
    toast.success(res.data?.message || "Driver updated successfully!");
    if (navigate) navigate(`/settings/drivers-listing/${companyId}`);
  } catch (err) {
    dispatch({
      type: "UPDATE_DRIVER_FAILURE",
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to update driver");
  }
};

// Delete driver
export const deleteDriver = (companyId, driverId, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DELETE_DRIVER_REQUEST });

    await axios.delete(`/drivers?companyId=${companyId}&driverId=${driverId}`, getAuthConfig());

    dispatch({ type: actionTypes.DELETE_DRIVER_SUCCESS, payload: driverId });
    toast.success("Driver deleted successfully");

    if (navigate) navigate(`/settings/drivers-listing/${companyId}`);
  } catch (error) {
    dispatch({
      type: actionTypes.DELETE_DRIVER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    console.error("Delete driver error:", error);
    toast.error(error.response?.data?.message || "Failed to delete driver");
  }
};

// Deactivate driver
export const deactivateDriver = (companyId, driverId, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DEACTIVATE_DRIVER_REQUEST });

    const res = await axios.patch(
      `/drivers/deactivate?driverId=${driverId}&companyId=${companyId}`,
      {},
      getAuthConfig()
    );

    dispatch({
      type: actionTypes.DEACTIVATE_DRIVER_SUCCESS,
      payload: res.data?.data,
    });
    toast.success(res.data?.message || "Driver deactivated successfully!");
    if (navigate) navigate(`/settings/drivers-listing/${companyId}`);
  } catch (err) {
    dispatch({
      type: actionTypes.DEACTIVATE_DRIVER_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to deactivate driver");
  }
};

// Activate Driver
export const activateDriver = (companyId, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ACTIVATE_DRIVER_REQUEST });

    const res = await axios.patch(
      `/drivers/activate?companyId=${companyId}&driverId=${id}`,
      {},
      getAuthConfig()
    );

    dispatch({
      type: actionTypes.ACTIVATE_DRIVER_SUCCESS,
      payload: res.data?.data,
    });

    toast.success(res.data?.message || "Driver activated successfully!");
    if (navigate) navigate(`/settings/drivers-listing/${companyId}`);
  } catch (err) {
    dispatch({
      type: actionTypes.ACTIVATE_DRIVER_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to activate driver");
  }
};
