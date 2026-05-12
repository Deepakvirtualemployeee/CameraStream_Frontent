import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const normalizePortalUser = (user) => {
  if (!user) return user;

  if (user.name && user.status) {
    return user;
  }

  return {
    ...user,
    name: [user.firstName, user.lastName].filter(Boolean).join(" ").trim(),
    status: user.isActive ? "Active" : "Inactive",
  };
};

// Get all portal users
export const getPortalUsers = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_PORTAL_USERS_REQUEST });
    const res = await axios.get(`/portal-users?companyId=${companyId}`, {
      headers: getAuthHeaders(),
    });
    console.log("Get all users:", res.data.data);
    // users list is in res.data.data (array)
    dispatch({
      type: actionTypes.GET_PORTAL_USERS_SUCCESS,
      payload: (res.data.data || []).map(normalizePortalUser),
    });
  } catch (err) {
    dispatch({
      type: actionTypes.GET_PORTAL_USERS_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Create portal users
export const createPortalUser = (companyId, userData, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.CREATE_PORTAL_USERS_REQUEST });
  
      const res = await axios.post("/portal-users", userData, {
        headers: getAuthHeaders(),
      });
      console.log("User Data Create", userData);
      dispatch({
        type: actionTypes.CREATE_PORTAL_USERS_SUCCESS,
        payload: normalizePortalUser(res.data.data),
      });
  
      toast.success("User created successfully!");
  
      // redirect to list page
      if (navigate) navigate(`/settings/portal-users/${companyId}`);
    } catch (err) {
      console.log(err);
      dispatch({
        type: actionTypes.CREATE_PORTAL_USERS_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to create user");
    //   toast.error(err.response?.data?.data?.error || err.response?.data?.message || "Failed to create user");
    }
  };
  
// Update portal user
export const updatePortalUser = (companyId, id, userData, navigate) => async (dispatch) => {
  console.log("Veh data", userData);
  try {
    dispatch({ type: actionTypes.UPDATE_PORTAL_USERS_REQUEST });
    const res = await axios.put(`/portal-users?userId=${id}`, userData, {
      headers: getAuthHeaders(),
    });
    console.log("Update user:", res);
    dispatch({
      type: actionTypes.UPDATE_PORTAL_USERS_SUCCESS,
      payload: normalizePortalUser(res.data.data),
    });
    toast.success("User updated successfully!");

    if (navigate) navigate(`/settings/portal-users/${companyId}`);

  } catch (err) {
    console.log("Update user:", err);

    dispatch({
      type: actionTypes.UPDATE_PORTAL_USERS_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to update user");
  }
};

// Get portal user by ID
export const getPortalUserById = (companyId, id) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.GET_PORTAL_USERS_BY_ID_REQUEST });
  
      const res = await axios.get(`/portal-users/by-id?companyId=${companyId}&userId=${id}`, {
        headers: getAuthHeaders(),
      });
      console.log("portal-usersbyId:", res.data.data);
      dispatch({
        type: actionTypes.GET_PORTAL_USERS_BY_ID_SUCCESS,
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.GET_PORTAL_USERS_BY_ID_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to fetch user details");
    }
  };
  
// Deactivate portal user
export const deactivatePortalUser = (companyId, id, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.DEACTIVATE_PORTAL_USERS_REQUEST });
  
      const res = await axios.patch(`/portal-users/deactivate?companyId=${companyId}&userId=${id}`, {}, {
        headers: getAuthHeaders(),
      });
  
      dispatch({
        type: actionTypes.DEACTIVATE_PORTAL_USERS_SUCCESS,
        payload: normalizePortalUser(res.data.data),
      });
  
      toast.success("User deactivated successfully!");
      if (navigate) navigate(`/settings/portal-users/${companyId}`);

      return true;
    } catch (err) {
      dispatch({
        type: actionTypes.DEACTIVATE_PORTAL_USERS_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to deactivate user");
      return false;
    }
  };
  
  // Activate portal user
export const activatePortalUser = (companyId, id, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.ACTIVATE_PORTAL_USERS_REQUEST });
  
      const res = await axios.patch(
        `/portal-users/activate?companyId=${companyId}&userId=${id}`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
  
      dispatch({
        type: actionTypes.ACTIVATE_PORTAL_USERS_SUCCESS,
        payload: normalizePortalUser(res.data.data),
      });
  
      toast.success("User activated successfully!");
      if (navigate) navigate(`/settings/portal-users/${companyId}`);
      return true;
    } catch (err) {
      dispatch({
        type: actionTypes.ACTIVATE_PORTAL_USERS_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to activate user");
      return false;
    }
  };
  
// Delete portal user
export const deletePortalUser = (companyId, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DELETE_PORTAL_USERS_REQUEST });
    await axios.delete(`/portal-users?companyId=${companyId}&userId=${id}`, {
      headers: getAuthHeaders(),
    });

    // just remove from redux by id
    dispatch({ type: actionTypes.DELETE_PORTAL_USERS_SUCCESS, payload: id });
    toast.success("User deleted successfully!");
    if (navigate) navigate(`/settings/portal-users/${companyId}`);

  } catch (err) {
    dispatch({
      type: actionTypes.DELETE_PORTAL_USERS_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to delete user");
  }
};
