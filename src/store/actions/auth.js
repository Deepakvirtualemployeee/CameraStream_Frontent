import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";

// Start loading
export const startAuth = () => {
  return {
    type: actionTypes.START_AUTH
  };
};

// Auth success
export const AuthSuccess = (message) => {
  toast.success(message);
  return {
    type: actionTypes.AUTH_SUCCESS,
    message: message,
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

// Login action
export const login = (data, navigate) => {
  return dispatch => {
    dispatch(startAuth());
    axios.post("/login", data)
      .then(response => {
        if (response.status === 200) {
          dispatch(AuthSuccess(response.data.message));
          localStorage.setItem("token", response.data.token);
          window.location = '/';
        } else {
          dispatch(AuthFail(response.data.message));
        }
      })
      .catch((err) => {
        dispatch(AuthFail(err?.response?.data?.message || "Login failed"));
      });
  };
};

// Forgot password (send OTP)
export const forgotPassword = (email) => {
  return dispatch => {
    dispatch(startAuth());
    axios.post("/forgot-password", { email })
      .then(response => {
        if (response.status === 200) {
          dispatch(AuthSuccess(response.data.message));
        } else {
          dispatch(AuthFail(response.data.message));
        }
      })
      .catch(error => {
        const errMsg = error?.response?.data?.message || "Something went wrong";
        dispatch(AuthFail(errMsg));
      });
  };
};

// Verify OTP
export const verifyOtp = (email, otp) => {
  return dispatch => {
    dispatch(startAuth());
    axios.post("/verify-otp", { email, otp })
      .then(response => {
        if (response.status === 200) {
          dispatch(AuthSuccess(response.data.message));
        } else {
          dispatch(AuthFail(response.data.message));
        }
      })
      .catch(error => {
        const errMsg = error?.response?.data?.message || "Invalid OTP";
        dispatch(AuthFail(errMsg));
      });
  };
};

// Reset password after OTP
export const resetPasswordAfterOtp = (email, otp, password) => {
  return dispatch => {
    dispatch(startAuth());
    axios.post("/reset-password-after-otp", { email, otp, password })
      .then(response => {
        if (response.status === 200) {
          dispatch(AuthSuccess(response.data.message));
        } else {
          dispatch(AuthFail(response.data.message));
        }
      })
      .catch(error => {
        const errMsg = error?.response?.data?.message || "Password reset failed";
        dispatch(AuthFail(errMsg));
      });
  };
};

export const register = (data, navigate) => {
  return dispatch => {
    dispatch(startAuth());
    axios.post("/register", data)
      .then(response => {
        if (response.status === 200) {
          dispatch(AuthSuccess(response.data.message));
          navigate("/login"); // redirect after successful registration
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
