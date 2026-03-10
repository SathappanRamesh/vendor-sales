import api from "../api/axios";
import styles from './Login.module.css'
import { useState} from "react";
import { Link, useNavigate, } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoader(true);
    try {
      const response = await api.post("https://vendor-sales.onrender.com/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate('/home', { replace: true });
      }
    } catch (error) {
      console.log("error logging in:", error);
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

    <div className={styles.loginBody}>
      <div className={styles.loginFormContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 style={{color: "white"}}>Log In</h2>
          <span className={styles.inputSpan}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input style={{backgroundColor: "GrayText"}} onChange={(e) => {setEmail(e.target.value)}} type="email" name="email" id="email"
            /></span>
          <span className={styles.inputSpan}>
    <label htmlFor="password" className={styles.label}>Password</label>
    <input style={{backgroundColor: "GrayText"}} onChange={(e) => {setPassword(e.target.value)}} type="password" name="password" id="password"
  /></span>
<div className={styles.tooltipContainer}>
  <span className={styles.tooltip}>LogIn free Access</span>
<span
  onClick={async () => {
    setIsLoader(true);
    try {
      const response = await api.post(
        "https://vendor-sales.onrender.com/login",
        {
          email: "demo@mysite.com",
          password: "demo123",
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.log("error logging in:", error);
    } finally {
      setIsLoader(false);
    }
  }}
  className={styles.text}
>
  Demo Account
</span>
</div>

  <input className={styles.submit} type="submit" value="Log In" />
  <span className={styles.span}>Don't have an account? <a href="/register">Sign up</a></span>
</form>
    </div>
      </div>
    </>
  )
}

export default Login;
