import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { legacy_createStore as createStore } from "redux";
import { thunk } from "redux-thunk";
import auth from './store/reducer/auth';
import companiesReducer from './store/reducer/companies';

// Import Bootstrap 5.3.3 CSS
//import 'bootstrap/dist/css/bootstrap.min.css';  // Corrected Bootstrap import for styling
import "bootstrap";
import { combineReducers, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancers = window?.__REDUX_DEVTOOLS_EXTENSION__?.() || compose;
const rootReducer = combineReducers({
  auth: auth,
  companies: companiesReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// Create a root for the React application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
