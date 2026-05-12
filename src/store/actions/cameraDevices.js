import axios from "../../axios-config";
import { toast } from "react-toastify";
import * as actionTypes from "../actions/actionTypes";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

const normalizeChannels = (deviceData = {}) =>
  (deviceData.channels || deviceData.channelNames || []).map((channel, index) => ({
    key: channel.key || `CH${index + 1}`,
    name: channel.name?.trim() || "",
    enabled: Boolean(channel.enabled),
  }));

const normalizeDeviceType = (deviceType = "") => {
  if (!deviceType) return "";
  return deviceType.startsWith("HERO-") ? deviceType : `HERO-${deviceType}`;
};

const buildDevicePayload = (deviceData = {}, options = {}) => {
  const channels = normalizeChannels(deviceData);
  const selectedVehicleId =
    deviceData.vehicleId ||
    deviceData.vehcileId ||
    deviceData.vehicleID ||
    deviceData.assignedVehicleId ||
    deviceData.vehicle ||
    null;

  return {
    vehicleId: selectedVehicleId,
    deviceId: deviceData.deviceId?.trim() || "",
    deviceName: deviceData.deviceName?.trim() || "",
    deviceType: options.normalizeDeviceType
      ? normalizeDeviceType(deviceData.deviceType)
      : deviceData.deviceType || "",
    audioVideoChannelQty: Number(deviceData.audioVideoChannelQty || channels.length || 0),
    channels,
    channelName: deviceData.channelName?.trim() || channels[0]?.name || "",
    fleetId: deviceData.fleetId?.trim() || "",
    nodeGuid: deviceData.nodeGuid?.trim() || "",
    ioName: deviceData.ioName?.trim() || "",
    chassisNo: deviceData.chassisNo?.trim() || deviceData.vinNumber?.trim() || "",
  };
};

// Fetch camera devices by companyId
export const fetchCameraDevices = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.FETCH_ELD_DEVICES_REQUEST });

    const { data } = await axios.get("/devices", {
      headers: getAuthHeaders(),
      params: {
        companyId,
        page: 1,
        limit: 20,
      },
    });
    
    dispatch({
      type: actionTypes.FETCH_ELD_DEVICES_SUCCESS,
      payload: Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.docs)
        ? data.data.docs
        : Array.isArray(data?.devices)
        ? data.devices
        : [],
    });
    console.log("Camera device lists:", data);
  } catch (err) {
    dispatch({
      type: actionTypes.FETCH_ELD_DEVICES_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Add camera device
export const addCameraDevice = (companyId, deviceData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ADD_ELD_DEVICE_REQUEST });

    const payload = buildDevicePayload({
      ...deviceData,
      companyId,
    });

    const res = await axios.post(
      "/devices",
      payload,
      {
        headers: getAuthHeaders(),
        params: {
          companyId,
        },
      }
    );

    dispatch({
      type: actionTypes.ADD_ELD_DEVICE_SUCCESS,
      payload: res.data.data || payload,
    });

    toast.success(res.data?.message || "Device added successfully!");
    if (navigate) navigate(`/settings/camera-devices/${companyId}`);

    return true;
  } catch (err) {
    dispatch({
      type: actionTypes.ADD_ELD_DEVICE_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to add device");
    return false;
  }
};

// Get camera device by ID
export const getCameraDeviceById = (companyId, id) => async (dispatch) => {
  try {
    dispatch({ type: "GET_ELD_DEVICE_REQUEST" });

    const res = await axios.get("/devices/by-id", {
      headers: getAuthHeaders(),
      params: {
        companyId,
        deviceId: id,
      },
    });

    console.log("Edit camera device:", res);
    dispatch({
      type: "GET_ELD_DEVICE_SUCCESS",
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: "GET_ELD_DEVICE_FAILURE",
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Update camera device
export const updateCameraDevice = (companyId, id, deviceData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_ELD_DEVICE_REQUEST" });

    const payload = buildDevicePayload(deviceData, { normalizeDeviceType: true });

    const res = await axios.put("/devices", payload, {
      headers: getAuthHeaders(),
      params: {
        companyId,
        deviceId: id,
      },
    });

    console.log("Update camera device:", payload);
    dispatch({
      type: "UPDATE_ELD_DEVICE_SUCCESS",
      payload: res.data.data,
    });

    toast.success("Camera device updated successfully!");
    if (navigate) navigate(`/settings/camera-devices/${companyId}`);

  } catch (err) {
    console.log(err);
    dispatch({
      type: "UPDATE_ELD_DEVICE_FAILURE",
      payload: err.response?.data?.message || err.message,
    });
    toast.error("Failed to update camera device");
  }
};

// Get all unassigned camera devices
export const getUnassignedCameraDevices = (companyId) => async (dispatch) => {
    try {
      const res = await axios.get("/elds/unassigned", {
        headers: getAuthHeaders(),
        params: {
          companyId,
        },
      });
      console.log("Unassigned camera devices:", res);
      dispatch({ type: actionTypes.GET_UNASSIGNED_ELDS, payload: res.data.data });
    } catch (error) {
      console.error("Error fetching unassigned camera devices:", error);
      toast.error(error.response?.data?.message || "Failed to fetch unassigned camera devices");
    }
  };

// Delete camera device
export const deleteCameraDevice = (companyId, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DELETE_ELD_REQUEST });

    const res = await axios.delete("/devices", {
      headers: getAuthHeaders(),
      params: {
        companyId,
        id,
      },
    });

    dispatch({
      type: actionTypes.DELETE_ELD_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Camera device deleted successfully!");
    if (navigate) navigate(`/settings/camera-devices/${companyId}`);

    return true;
  } catch (err) {
    console.log(err);
    dispatch({
      type: actionTypes.DELETE_ELD_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to delete camera device");
    return false;
  }
};

// Deactivate camera device
export const deactivateCameraDevice = (companyId, deviceId, navigate) => async (dispatch) => {
  try {
    const cameraDeviceId = deviceId?.toString().trim();

    if (!cameraDeviceId) {
      toast.error("Device ID is required to deactivate camera device");
      return false;
    }

    dispatch({ type: actionTypes.DEACTIVATE_ELD_REQUEST });

    const res = await axios.patch("/devices/deactivate", {}, {
      headers: getAuthHeaders(),
      params: {
        companyId,
        deviceId: cameraDeviceId,
      },
    });

    dispatch({
      type: actionTypes.DEACTIVATE_ELD_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Camera device deactivated successfully!");
    if (navigate) navigate(`/settings/camera-devices/${companyId}`);

    return true;
  } catch (err) {
    console.log("Deactivate camera device failed:", err);
    dispatch({
      type: actionTypes.DEACTIVATE_ELD_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to deactivate camera device");
    return false;
  }
};

// Activate camera device
export const activateCameraDevice = (companyId, deviceId, navigate) => async (dispatch) => {
  try {
    const cameraDeviceId = deviceId?.toString().trim();

    if (!cameraDeviceId) {
      toast.error("Device ID is required to activate camera device");
      return false;
    }

    dispatch({ type: actionTypes.ACTIVATE_ELD_REQUEST });

    const res = await axios.patch("/devices/activate", {}, {
      headers: getAuthHeaders(),
      params: {
        companyId,
        deviceId: cameraDeviceId,
      },
    });

    dispatch({
      type: actionTypes.ACTIVATE_ELD_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Camera device activated successfully!");
    if (navigate) navigate(`/settings/camera-devices/${companyId}`);

    return true;
  } catch (err) {
    console.log("Activate camera device failed:", err);
    dispatch({
      type: actionTypes.ACTIVATE_ELD_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to activate camera device");
    return false;
  }
};

// Unassign vehicle from camera device
export const unassignVehicleFromCameraDevice = (companyId, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.UNASSIGN_ELD_REQUEST });

    const res = await axios.put("/elds/unassign-vehicle", {}, {
      headers: {
        ...getAuthHeaders(),
      },
      params: {
        companyId,
        eldId: id,
      },
    });

    dispatch({
      type: actionTypes.UNASSIGN_ELD_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Vehicle unassigned successfully!");
    if (navigate) navigate(`/settings/camera-devices/${companyId}`);
    return true;
  } catch (err) {
    dispatch({
      type: actionTypes.UNASSIGN_ELD_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to unassign vehicle");
    return false;
  }
};
