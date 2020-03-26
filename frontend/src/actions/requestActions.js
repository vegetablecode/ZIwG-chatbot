import axios from "axios";
import { GET_ERRORS, GET_REQUESTS } from "./types";
import { baseUrl } from "../config";

export const createRequest = (request, history) => async dispatch => {
  try {
    await axios.post(baseUrl + "/api/request", request);
    history.push("/login");
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response.data
    });
  }
};

export const getRequests = () => async dispatch => {
  const res = await axios.get(baseUrl + "/api/request/all");
  dispatch({
    type: GET_REQUESTS,
    payload: res.data
  });
};