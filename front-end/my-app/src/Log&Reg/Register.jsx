import React from "react";
import styles from './Register.module.css'
import { useState,useEffect } from "react";
import {Link, useNavigate } from 'react-router-dom';
import api from "../api/axios";

function Register() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const [isLoader, setIsLoader] = useState(false);
    const [passwordError, setPasswordError] = useState()
    function checkStrongPassword(password) {

  let reasons = "";

  if (password.length < 8) {
    reasons = "Password must be at least 8 characters long";
  return {
    isStrong: reasons.length === 0,
    reasons: reasons
  };
  }

  if (!/[A-Z]/.test(password)) {
    reasons = "Password must contain at least one uppercase letter";
  return {
    isStrong: reasons.length === 0,
    reasons: reasons
  };
  }

  if (!/[a-z]/.test(password)) {
    reasons = "Password must contain at least one lowercase letter";
  return {
    isStrong: reasons.length === 0,
    reasons: reasons
  };
  }

  if (!/[0-9]/.test(password)) {
    reasons = "Password must contain at least one number";
  return {
    isStrong: reasons.length === 0,
    reasons: reasons
  };
  }

  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
    reasons = "Password must contain at least one special character";
  return {
    isStrong: reasons.length === 0,
    reasons: reasons
  };
  }

  return {
    isStrong: reasons.length === 0,
    reasons: reasons
  };
}

    const hanndleSubmit = async (e) => {
        e.preventDefault();
        setIsLoader(true);
        const isStrongPassword = checkStrongPassword(user.password);
        if (!isStrongPassword.isStrong) {
            setPasswordError(isStrongPassword.reasons);
            setIsLoader(false);
            return;
        }
        try {
            const response = await api.post('http://localhost:3000/register', {user})
            console.log(response.data);
                  localStorage.setItem('verificationEmail', response.data.email);
            localStorage.setItem("showGuide", true);
            navigate('/verify', {
            replace: true,
            });
        } catch (error) {
            console.log("Error logging in:", error);
        } finally {
            setIsLoader(false);
        }
    }
    
  return (
    <>
        {isLoader && (
    <div className={styles.loaderWrapper}>
      <div className={styles.threeBody}>
        <div className={styles.threeBodyDot}></div>
        <div className={styles.threeBodyDot}></div>
        <div className={styles.threeBodyDot}></div>
      </div>
    </div>
        )}
    <div className={styles.glass}>

    <div className={styles.regFormContainer}>
    <form onSubmit={hanndleSubmit} className={styles.regForm} action="">
        <h2>Sign up</h2>

        <div className={styles.regInputContainer}>
        <label htmlFor="">Username</label>
        <input className={styles.regInput} onChange={(e) => setUser((p) => ({...p, username: e.target.value}))} type="text" required />
        </div>

        <div className={styles.regInputContainer}>
        <label htmlFor="">Email</label>
        <input className={styles.regInput} onChange={(e) => setUser((p) => ({...p, email: e.target.value}))} type="email" required />
        </div>

        <div className={styles.regInputContainer}>
        <label htmlFor="">Password</label>
        <input className={styles.regInput} onChange={(e) => setUser((p) => ({...p, password: e.target.value}))} type="password" required />
        </div>
        {passwordError?.length > 0 && (
        <span className={styles.passwordError}>{passwordError}</span>
        )}
        <button className={styles.regSubmitBtn} onClick={() => hanndleSubmit}>Submit</button>
        <h6 ><Link to="/login">Already Have an Account?</Link></h6>
    </form>
    </div>
    </div>

    </>
  )
}

export default Register;
