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

          await dispatch(AuthSuccess(response.data.message));
          await localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("admin_user", JSON.stringify(user)); // store user in localStorage
          window.location = await '/';
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
    axios.post("/auth/send-otp", { email })
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
    axios.post("/auth/verify-otp", { email, otp })
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
export const resetPasswordAfterOtp = (email, otp, password, confirmPassword) => {
  return dispatch => {
    dispatch(startAuth());
    axios.post("/auth/reset-password/"+email, { newPassword:password, confirmPassword })
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
