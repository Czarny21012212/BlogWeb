import {useState} from 'react';
import './register.css';


function Register() {

    const [message, setMessage] = useState('');
    const [registerData, setRegisterData] = useState({
        email: '',
        password: ''
    });

    const [passwordRepeat, setPasswordRepeat] = useState()

    const checkRegister = (e) => {
        e.preventDefault();
        console.log(registerData)
        if (registerData.email === '' || registerData.password === '') {
            setMessage('Please enter your email and password');
        } else if (!registerData.email.endsWith('@gmail.com')) {
            setMessage('Please enter a valid email address');
        } else if (registerData.password.length < 6) {
            setMessage('Password must be at least 6 characters long');
        } else if (registerData.password !== passwordRepeat) {
            setMessage('Passwords do not match');
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        fetch('http://localhost:8082/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Registration failed');
            }
        })
        .then(data => {
            setMessage(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
  return (
    <div className="register-wrapper">
        <div className="register-container">
            <div className="register-header">
            <h1 className="register-title-main">
                <i className="fas fa-pen"></i> BlogWeb
            </h1>

            <h2 className="register-title">Create your account</h2>
            <p className="register-subtitle">
                Join our blogging platform and start sharing your ideas with the world.
            </p>
            </div>

            <div className="register-form">
            <div className="register-form-group">
                <label htmlFor="email">Email</label>
                <input
                type="text"
                name="email"
                placeholder="Enter your email"
                onChange={e => setRegisterData({ ...registerData, [e.target.name]: e.target.value })}
                className="register-input"
                />
            </div>

            <div className="register-form-group">
                <label htmlFor="password">Password</label>
                <input
                type="password"
                id="password"
                placeholder="Enter your password"
                onChange={e => setPasswordRepeat(e.target.value)}
                className="register-input"
                />
            </div>

            <div className="register-form-group">
                <label htmlFor="password">Repeat password</label>
                <input
                type="password"
                name="password"
                placeholder="Enter your password again"
                onChange={e => setRegisterData({ ...registerData, [e.target.name]: e.target.value })}
                className="register-input"
                />
            </div>

            <button type="submit" onClick={checkRegister} className="register-button">
                Register
            </button>

            {message && <p className="register-message">{message}</p>}
            </div>

            <div className="register-footer">
            <div className="divider">or</div>
            <span>Already have an account?</span>
            <a href="/login"> Sign in</a>
            </div>
        </div>
        </div>

  );
}

export default Register;
