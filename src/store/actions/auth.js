import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";
import {ROLES } from "../../../src/constants"

// Start loading
export const startAuth = () => {
  return {
    type: actionTypes.START_AUTH
  };
};

// Auth success
export const AuthSuccess = (payload) => {
  toast.success(payload.message);
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: payload,   
  };
};


// Auth failure
export const AuthFail = (message) => {
  toast.error(message);
  return {
    type: actionTypes.AUTH_FAIL,
    message: message
  };
};
 
export const restoreUserFromLocalStorage = () => {
  return (dispatch) => {
    const storedUser = localStorage.getItem("admin_user");
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch(AuthSuccess({ user }));
    }
  };
};

// Login action
export const login = (data, navigate) => {   
  return dispatch => {     
    dispatch(startAuth());     
    axios.post("/auth/login", data)       
      .then(async response => {         
        if (response.status === 200) {           
          const user = response.data.data.user;   // user details
          
          console.log("User from API:", user);
          console.log("Role from API:", user.role, "Type:", typeof user.role);
          
           
          let roleNumber = user.role;
          
          if (typeof user.role === 'string') {
            const roleMap = {
              'company administrator': ROLES.Company_Administrator,
              'fleet manager': ROLES.FLEET_MANAGER,
              'driver': ROLES.DRIVER,
              'broker': ROLES.Broker,
              'company safety personal': ROLES.Company_Safety_Personal,
            };
            roleNumber = roleMap[user.role.toLowerCase()] || user.role;
          }
          
          user.role = roleNumber;
          console.log("Final role:", user.role);
          
          await dispatch(AuthSuccess({ message: response.data.message, user }));           
          await localStorage.setItem("token", response.data.accessToken);           
          localStorage.setItem("admin_user", JSON.stringify(user));           
          window.location = '/';         
        } else {           
          dispatch(AuthFail(response.data.message));         
        }       
      })       
      .catch((err) => {         
        console.log("Login error:", err);
        dispatch(AuthFail(err?.response?.data?.message || "Login failed"));       
      });   
  }; 
};

// Forgot password (send OTP)
export const forgotPassword = (email) => {
  return dispatch => {
    dispatch(startAuth());
    const cleanEmail = email?.trim().toLowerCase();
    return axios.post("/auth/send-otp", { email: cleanEmail })
      .then(response => {
        if (response.status === 200) {
          dispatch(AuthSuccess({ message: response.data.message }));
          return response.data;
        } else {
          dispatch(AuthFail(response.data.message));
          throw new Error(response.data.message);
        }
      })
      .catch(error => {
        const errMsg = error?.response?.data?.message || "Something went wrong";
        dispatch(AuthFail(errMsg));
        throw error;
      });
  };
};

// Verify OTP
export const verifyOtp = (email, otp) => {
  return dispatch => {
    dispatch(startAuth());
    const cleanEmail = email?.trim().toLowerCase();
    return axios.post("/auth/verify-otp", { email: cleanEmail, otp })
      .then(response => {
        if (response.status === 200) {
          dispatch(AuthSuccess({ message: response.data.message }));
          return response.data;
        } else {
          dispatch(AuthFail(response.data.message));
          throw new Error(response.data.message);
        }
      })
      .catch(error => {
        const errMsg = error?.response?.data?.message || "Invalid OTP";
        dispatch(AuthFail(errMsg));
        throw error;
      });
  };
};

// Reset password after OTP
export const resetPasswordAfterOtp = (email, password, confirmPassword) => {
  return dispatch => {
    dispatch(startAuth());
    const cleanEmail = email?.trim().toLowerCase();
    return axios.post(`/auth/reset-password/${cleanEmail}`, { newPassword: password, confirmPassword })
      .then(response => {
        if (response.status === 200) {
          dispatch(AuthSuccess({ message: response.data.message }));
          return response.data;
        } else {
          dispatch(AuthFail(response.data.message));
          throw new Error(response.data.message);
        }
      })
      .catch(error => {
        const errMsg = error?.response?.data?.message || "Password reset failed";
        dispatch(AuthFail(errMsg));
        throw error;
      });
  };
};

// Verify email (from verification link)
export const verifyEmail = (token) => {
  return async (dispatch) => {
    dispatch(startAuth());
    try {
      const res = await axios.get(`/auth/verify-email/${token}`);
      dispatch(AuthSuccess({ message: res.data?.message || "Email verified", user: null }));
      return { success: true, message: res.data?.message };
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Invalid or expired verification link";
      dispatch(AuthFail(errMsg));
      return { success: false, message: errMsg };
    }
  };
};

export const register = (data, navigate) => {
  return dispatch => {
    dispatch(startAuth());
    axios.post("/auth/register", data)
      .then(response => {
        if (response.status === 201) {
          dispatch(AuthSuccess(response.data.message));
          navigate("/signup-finished");
        } else {
          dispatch(AuthFail(response.data.message));
        }
      })
      .catch(error => {
        const errMsg = error?.response?.data?.message || "Registration failed";
        dispatch(AuthFail(errMsg));
      });
  };
};
