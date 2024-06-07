import axios from 'axios'
import { loginFailure, loginSuccess, loginStart,logoutSuccess } from './AuthActions'
import Toastify from 'toastify-js';
export const login = async(user, dispatch) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`https://jsserver-pi25.onrender.com/api/auth/login`, user);
        dispatch(loginSuccess(res.data));
        Toastify({
            text: 'Đăng nhập thành công',
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
              display : "flex",
              justifyContent: "center",  // Căn giữa theo chiều ngang
              alignItems: "center",
            },
          }).showToast();
    } catch(err) {
        Toastify({
            text: err.response.data,
            style: {
              background: "red",
              display : "flex",
              justifyContent: "center",  // Căn giữa theo chiều ngang
              alignItems: "center",
            },
          }).showToast();
        dispatch(loginFailure());
    }
}

export const loginAI = async(user, dispatch) => {
    dispatch(loginStart());
    try {
    
        const res = await axios.post(`https://jsserver-pi25.onrender.com/api/auth/loginAI`, user);
        dispatch(loginSuccess(res.data));
    } catch(err) {
        dispatch(loginFailure());
    }
}
export const logout = async(dispatch) => {
    try {
        dispatch(logoutSuccess());
    } catch(err) {
        console.log(err);
    }
}
