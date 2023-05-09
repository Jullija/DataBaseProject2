import React, {useState} from 'react';
import styles from '../styles/Login.module.css';
import ParticleAnimation from './ParticleAnimation';
import {FaLock, FaUser, FaEnvelope} from 'react-icons/fa';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [glowingSpan, setGlowingSpan] = useState('login');

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === 'logemail') {
            setEmail(value);
        } else if (name === 'logpass') {
            setPassword(value);
        } else if (name === 'signupemail') {
            setSignUpEmail(value);
        } else if (name === 'signuppass') {
            setSignUpPassword(value);
        } else if (name === 'signupname') {
            setFullName(value);
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        if (!fullName || !signUpEmail || !signUpPassword) {
            setError('Full name, email, and password are required for sign up');
            console.log(error);
            return;
        }

        try {
            const response = await fetch('/api/users/signup', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    name: fullName, email: signUpEmail, password: signUpPassword,
                }),
            });

            if (response.status === 201) {
                const user = await response.json();
                console.log('User signed up successfully:', user);

                // Redirect the user or update the UI as needed
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
                console.log(error);
            }
        } catch (err) {
            console.error('Error signing up:', err);
            setError('Error signing up');
        }
    };

    const handleLogInSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Both email and password are required');
            console.log(error);
            return;
        }

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({email, password}),
            });

            if (response.status === 200) {
                const user = await response.json();
                console.log('Logged in successfully:', user);
                // Update the UI or store the user data as needed
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
                console.log('Error logging in:', errorMessage);
            }
        } catch (err) {
            setError('Error logging in');
            console.log('Error logging in:', err);
        }
    };


    return (<div className={styles['login-container']}>
        <div className={styles.section}>
            <div className={styles.container}>
                <div className={styles.row + ' ' + styles['full-height'] + ' ' + styles['justify-content-center']}>
                    <div
                        className={styles.col12 + ' ' + styles['text-center'] + ' ' + styles['align-self-center'] + ' ' + styles.py5}>
                        <div
                            className={styles.section + ' ' + styles.pb5 + ' ' + styles.pt5 + ' ' + styles['pt-sm-2'] + ' ' + styles['text-center']}>
                            <h6 className={styles.mb0 + ' ' + styles.pb3}>
                    <span id="login" className={glowingSpan === 'login' ? styles.glowing : ''}>
                      Log In
                    </span>
                    <span id="signup" className={glowingSpan === 'signup' ? styles.glowing : ''}>
                      Sign Up
                    </span>
                            </h6>

                            <input
                                className={styles.checkbox}
                                type="checkbox"
                                id="reg-log"
                                name="reg-log"
                                onChange={() => setGlowingSpan(glowingSpan === 'login' ? 'signup' : 'login')}
                            />
                            <label htmlFor="reg-log"></label>

                            <div className={styles['card-3d-wrap'] + ' ' + styles['mx-auto']}>
                                <div className={styles['card-3d-wrapper']}>
                                    <div className={styles['card-front']}>
                                        <div className={styles['center-wrap']}>
                                            <div className={styles.section + ' ' + styles['text-center']}>
                                                <div className={styles['form-group']}>
                                                    <input
                                                        type="email"
                                                        name="logemail"
                                                        className={styles['form-style']}
                                                        placeholder="Your Email"
                                                        id="logemail"
                                                        autoComplete="off"
                                                        value={email}
                                                        onChange={handleChange}
                                                    />
                                                    <i className={styles['input-icon'] + ' ' + styles['uil'] + ' ' + styles['uil-at']}>
                                                        <FaEnvelope/>
                                                    </i>
                                                </div>
                                                <div className={styles['form-group'] + ' ' + styles.mt2}>
                                                    <input
                                                        type="password"
                                                        name="logpass"
                                                        className={styles['form-style']}
                                                        placeholder="Your Password"
                                                        id="logpass"
                                                        autoComplete="off"
                                                        value={password}
                                                        onChange={handleChange}
                                                    />
                                                    <i className={styles['input-icon'] + ' ' + styles['uil'] + ' ' + styles['uil-lock-alt']}>
                                                        <FaLock/>
                                                    </i>
                                                </div>
                                                <button type="submit" className={styles.btn + ' ' + styles.mt4}
                                                        onClick={handleLogInSubmit}>
                                                    Submit
                                                </button>
                                                <p className={styles.mb0 + ' ' + styles.mt4 + ' '}>
                                                    <a href="#0" className={styles.link}>
                                                        Forgot your password?
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles['card-back']}>
                                        <div className={styles['center-wrap']}>
                                            <div className={styles.section + ' ' + styles['text-center']}>
                                                <div className={styles['form-group']}>
                                                    <input
                                                        type="text"
                                                        name="signupname"
                                                        className={styles['form-style']}
                                                        placeholder="Your Full Name"
                                                        id="signupname"
                                                        autoComplete="off"
                                                        value={fullName}
                                                        onChange={handleChange}
                                                    />
                                                    <i className={styles['input-icon'] + ' ' + styles.uil + ' ' + styles['uil-user']}>
                                                        <FaUser/>
                                                    </i>
                                                </div>
                                                <div className={styles['form-group'] + ' ' + styles.mt2}>
                                                    <input
                                                        type="email"
                                                        name="signupemail"
                                                        className={styles['form-style']}
                                                        placeholder="Your Email"
                                                        id="signupemail"
                                                        autoComplete="off"
                                                        value={signUpEmail}
                                                        onChange={handleChange}
                                                    />
                                                    <i className={styles['input-icon'] + ' ' + styles.uil + ' ' + styles['uil-at']}>
                                                        <FaEnvelope/>
                                                    </i>
                                                </div>
                                                <div className={styles['form-group'] + ' ' + styles.mt2}>
                                                    <input
                                                        type="password"
                                                        name="signuppass"
                                                        className={styles['form-style']}
                                                        placeholder="Your Password"
                                                        id="signuppass"
                                                        autoComplete="off"
                                                        value={signUpPassword}
                                                        onChange={handleChange}
                                                    />
                                                    <i className={styles['input-icon'] + ' ' + styles.uil + ' ' + styles['uil-lock-alt']}>
                                                        <FaLock/>
                                                    </i>
                                                </div>
                                                <button type="submit" className={styles.btn + ' ' + styles.mt4}
                                                        onClick={handleSignUpSubmit}>
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={styles['particle-canvas']}>
            <ParticleAnimation/>
        </div>
    </div>);
};

export default Login;