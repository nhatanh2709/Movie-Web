import axios from "axios";

import { loginFailure, loginStart, loginSuccess } from "./AuthActions";


export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`https://nodejs-server-1-o4q8.onrender.com/api/auth/login`, user);
    res.data.isAdmin && dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};