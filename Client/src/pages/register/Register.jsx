import { useState, useRef } from "react";
import axios from 'axios'
import { FaUser, FaLock } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import "./register.scss";
import Toastify from 'toastify-js';
export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();
    const usernameRef = useRef();

    const handleRegister = async (e) => {
        e.preventDefault();
        setEmail(emailRef.current.value);
        setPassword(passwordRef.current.value);
        setUsername(usernameRef.current.value);

        try {
            await axios.post(`${process.env.REACT_APP_URL}/api/auth/register`, { email, username, password })
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
        Toastify({
            text: 'Đăng kí  thành công',
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
              display : "flex",
              justifyContent: "center",  // Căn giữa theo chiều ngang
              alignItems: "center",
            },
          }).showToast();
    };
    return (
        <div className="login">
            <div className="body">
                <div className="wrapper">
                    <form action="">
                        <h1>Register</h1>
                        <div className="input-box">
                            <input type="email" placeholder="email address" ref={emailRef} />
                            <SiGmail className="icon" />
                        </div>

                        <div className="input-box">
                            <input type="username" placeholder="username" ref={usernameRef} />
                            <FaUser className="icon" />
                        </div>

                        <div className="input-box">
                            <input type="password" placeholder="password" ref={passwordRef} />
                            <FaLock className="icon" />
                        </div>


                        <div className="remember-forgot">
                            <label>
                                <input type="checkbox" />Remember me
                            </label>
                            <a href="#">
                                <Link to="/newPassword">
                                    Forgot Password?
                                </Link>
                            </a>
                        </div>
                        <button type="submit" onClick={handleRegister}>
                            Register
                        </button>

                        <div className="register-link">
                            <p>Have an account ?
                                <a href="#">
                                    <Link to="/login">
                                        Login
                                    </Link>
                                </a>
                            </p>
                        </div>
                        

                        <div className="register-link">
                            <p>Login by FACE ?
                                <a href="#">
                                    <Link to="/loginAI">
                                        Login
                                    </Link>
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}