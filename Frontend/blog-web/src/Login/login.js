import './login.css';
import { useState } from 'react';

function Login() {

    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const checkLogin = (e) => {
        e.preventDefault();
        if (loginData.email === '' || loginData.password === '') {
            setMessage('Please enter your email and password');
        } else if (!loginData.email.endsWith('@gmail.com')) {
            setMessage('Please enter a valid email address');
        } else if (loginData.password.length < 6) {
            setMessage('Password must be at least 6 characters long');
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        fetch('http://localhost:8082/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Login failed');
            }
        })
        .then(data => {
            setMessage(data.message);
            window.location.href = '/'; 

        })
        .catch(error => {
           setMessage(error.message);
        });
    }

    return (
    <div className="all-container">
        <div className="login-wrapper">
        <div className="icon-container"></div>
        <div className="login-container">
            <h1>Login</h1>
            <form className="login-form" onSubmit={checkLogin}>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                name="email"
                placeholder="Enter your username"
                className="input-wrapper"
                onChange={(e) => setLoginData({ ...loginData, [e.target.name]: e.target.value })}
                required
            />

            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
                <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="input-wrapper"
                placeholder="Enter your password"
                onChange={(e) => setLoginData({ ...loginData, [e.target.name]: e.target.value })}
                required
                />
                <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? "Hide" : "Show"}
                </button>
            </div>

            <div className="form-options">
                <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
                </div>
                <a className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit">Login</button>

            {message && <p className={message === "success" ? "success-message" : "error-message"}>{message}</p>}

            <div className="divider">or</div>

            <div className="signup-link">
                Don't have an account? <a href="/register">Sign up</a>
            </div>
            </form>
        </div>
        </div>
    </div>
    );
}

export default Login;
