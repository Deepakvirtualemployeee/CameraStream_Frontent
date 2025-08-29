import axios from "../../axios-config";
import { toast } from "react-toastify";
import * as actionTypes from "../actions/actionTypes";


const token = localStorage.getItem("token"); // or however you store JWT

// Add Driver Action
export const addDriver = (companyId, driverData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ADD_DRIVER_REQUEST });

    const res = await axios.post(
      `/drivers/add?companyId=${companyId}`, // API endpoint for adding driver
      driverData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Driver data", driverData);
    dispatch({
      type: actionTypes.ADD_DRIVER_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Driver added successfully!");
    if (navigate) navigate(`/settings/drivers-listing/${companyId}`); // redirect after success
    return true;
  } catch (err) {
    console.log(err);
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

    const { data } = await axios.get(`/drivers?companyId=${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //  const { data } = await axios.get(`/drivers`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    console.log("Drivers list", data);
    dispatch({
      type: actionTypes.FETCH_DRIVERS_SUCCESS,
      payload: data.data,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.FETCH_DRIVERS_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// GET Co-Drivers
// export const getCoDrivers = (companyId, driverId) => {
//   return (dispatch) => {
//     dispatch(startDrivers());
//     axios.get(`/drivers/codrivers?companyId=${companyId}&driverId=${driverId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     })
//       .then(res => {
//         console.log("CoDrivers:", res.data);
//         dispatch(driversSuccess(res.data.data)); // you may want a separate reducer
//       })
//       .catch(err => {
//         console.error("Error fetching co-drivers:", err);
//         dispatch(driversFail(err));
//       });
//   };
// };

export const getCoDrivers = (companyId, driverId) => async (dispatch) => {
  try {
    const res = await axios.get(`/drivers/codrivers?companyId=${companyId}&driverId=${driverId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Co drivers:", res);
    dispatch({ type: actionTypes.GET_CO_DRIVERS, payload: res.data.data });
  } catch (error) {
    console.error("Error fetching co drivers:", error);
    toast.error(error.response?.data?.message || "Failed to fetch co drivers");
  }
};

// Get driving license issuing state
export const getDriversIssuingState = (companyId) => async (dispatch) => {
  try {
    const res = await axios.get(`/drivers/states`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Drivers states:", res);
    dispatch({ type: actionTypes.GET_DRIVERS_STATE, payload: res.data.data });
  } catch (error) {
    console.error("Error fetching co drivers:", error);
    toast.error(error.response?.data?.message || "Failed to fetch co drivers");
  }
};

// Get driver by ID
export const getDriverById = (companyId, id) => async (dispatch) => {
  try {
    dispatch({ type: "GET_DRIVER_REQUEST" });
    const res = await axios.get(`/drivers?companyId=${companyId}&driverId=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "GET_DRIVER_SUCCESS", payload: res.data.data });
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
    const res = await axios.put(`/drivers?driverId=${id}`, driverData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Update Driver data:", driverData);
    dispatch({ type: "UPDATE_DRIVER_SUCCESS", payload: res.data.data });
    toast.success("Driver updated successfully!");
    if (navigate) navigate(`/settings/drivers-listing/${companyId}`); // redirect after success
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

    await axios.delete(`/drivers?companyId=${companyId}&driverId=${driverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // just remove from redux by id
    dispatch({ type: actionTypes.DELETE_DRIVER_SUCCESS, payload: driverId });

    toast.success("Driver deleted successfully");

    // Redirect back to drivers listing after delete
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

    const res = await axios.put(
      `/drivers/deactivate?driverId=${driverId}&companyId=${companyId}`,
      // { isActive: false }, // mark inactive
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({ type: actionTypes.DEACTIVATE_DRIVER_SUCCESS, payload: res.data.data });
    toast.success("Driver deactivated successfully!");
    if (navigate) navigate(`/settings/drivers-listing/${companyId}`);
  } catch (err) {
    console.log("Token:", token);
    console.log(err);
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

    const res = await axios.put(
      `/drivers/activate?companyId=${companyId}&driverId=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: actionTypes.ACTIVATE_DRIVER_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Driver activated successfully!");
    if (navigate) navigate(`/settings/drivers-listing/${companyId}`);
  } catch (err) {
    dispatch({
      type: actionTypes.ACTIVATE_DRIVER_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to activate driver");
  }
};

