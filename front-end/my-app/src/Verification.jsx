import { useRef, useState } from 'react';
import { useLocation, useNavigate,Link } from 'react-router-dom';
import styles from './Verification.module.css';
import api from "./api/axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function VerificationCode() {
  const inputRefs = useRef([]);
  const [code, setCode] = useState(Array(4).fill(''));
  const navigate = useNavigate();
  const email = localStorage.getItem('verificationEmail') || '';

  const handleInputChange = (e, index) => {
    const value = e.target.value.slice(-1); // Get last character
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {    
    e.preventDefault();

    try {
      const verificationCode = code.join('');
      const response = await api.post('https://vendor-sales.onrender.com/verify-code', {
        email,
        code: verificationCode,
      });
      
      if (response.data.success) {
        toast.info('Verification successful!');
        navigate('/login');
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.bodyClass}>
      <ToastContainer />
      <div className={styles.container}>
        <header className={styles.verifyHeader}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor">
              <path d="M14.049 5.54a1 1 0 0 1 1.071.443l.994 1.587a1 1 0 0 0 .316.316l1.587.994a1 1 0 0 1 .444 1.072l-.42 1.824a1 1 0 0 0 0 .448l.42 1.825a1 1 0 0 1-.444 1.07l-1.587.995a.993.993 0 0 0-.316.316l-.994 1.587a1 1 0 0 1-1.071.444l-1.825-.42a1 1 0 0 0-.447 0l-1.825.42a1 1 0 0 1-1.071-.444l-.994-1.587a1.001 1.001 0 0 0-.317-.316l-1.586-.994a1 1 0 0 1-.444-1.071l.419-1.825a1 1 0 0 0 0-.448l-.42-1.824a1 1 0 0 1 .445-1.072l1.586-.994a1 1 0 0 0 .317-.316l.994-1.587a1 1 0 0 1 1.07-.443l1.826.419a1 1 0 0 0 .447 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m9.515 12.536l2.035 1.949l2.935-4.97" />
            </g>
          </svg>
        </header>
        <h4> 
          Please enter the 4-digit verification code 
          <br />
          we sent via SMS:
        </h4>
        <form className={styles.verifyForm} onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            {[0, 1, 2, 3].map((_, index) => (
              <input
                key={index}
                className={styles.input}
                type="number"
                maxLength="1"
                onInput={(e) => handleInputChange(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <button className={styles.verifybtn}>Verify OTP</button>
          <h6>Didn't receive the code?</h6>
          <a href="#" onClick={() => handleSubmit()}> Send code again</a>
          <Link to='/register'><a href="#"> Change E-mail address</a></Link>
        </form>
      </div>
    </div>
  );
}

export default VerificationCode;
