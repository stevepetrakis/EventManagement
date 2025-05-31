import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      router.push('/events');
    }
  }, [router]);

  const handleSubmit = async  (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    setError('');

    try {
      if (!username || !password) {
        setError('Please enter both username and password');
        return;
      }

      console.log('Attempting to login with:', { username, password });

      const loginResponse = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log('Response status:', loginResponse.status);
      console.log('Response ok:', loginResponse.ok); 

      const data = await loginResponse.json();
      console.log('Response data:', data); 

      if (loginResponse.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userType', data.userType);
        localStorage.setItem('token', data.token || '');

        if (data.userType === 'creator') {
          router.push('/events');
        } else if (data.userType === 'subscriber') {
          router.push('/events');
        } else {
          router.push('/events');
        }
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Detailed error:', err);
      setError('Error connecting to the server. Please try again.');
    }
  };

   const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContent}>
        <h1 className={styles.title}>Welcome Back</h1>
        
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.passwordInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                )}
            </button>
          </div>
          
          <div className={styles.rememberForgot}>
            <label className={styles.rememberLabel}>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            <a href="#" className={styles.forgotLink}>Forgot Username/Password</a>
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.loginButton}>Log-in</button>
          
          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine}></span>
          </div>
          
          <p className={styles.continueText}>continue with</p>
          
          <div className={styles.socialLogin}>
            <button className={styles.socialButton}>
                <img src="/photos/google.png" alt="Google" width={20} height={20} className={styles.socialIcon} /> Google
            </button>
            <button className={styles.socialButton}>
                <img src="/photos/apple.png" alt="Apple" width={20} height={20} className={styles.socialIcon} /> Apple
            </button>
            <button className={styles.socialButton}>
                <img src="/photos/fb.png" alt="Facebook" width={20} height={20} className={styles.socialIcon} /> Facebook
            </button>
        </div>
          
          <p className={styles.signupText}>
            You don't have an account? Then Sign up <a href="#" className={styles.signupLink}>here</a>
          </p>
        </form>
      </div>
      
      <div className={styles.imageContent}>
        <div className={styles.brandContainer}>
          <Image src="/photos/controller.png" alt="Game controller" width={60} height={50} />
          <h2 className={styles.brandName}>eSports</h2>
        </div>
        <div className={styles.illustration}>
          <Image 
            src="/photos/login.png" 
            alt="Illustration of person at computer" 
            width={450} 
            height={450} 
            className={styles.illustrationImage}
          />
        </div>
      </div>
    </div>
  );
}