import React, {useState, useEffect} from "react";
import styles from "./Layout.module.css"
import { Outlet, Link, useNavigate } from "react-router-dom";
import { UserDataContext } from './UserDataContext.jsx';
import api from "./api/axios";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navOpen, setNaveOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

    const [isGuideShow, setIsGuideShow] = useState(   )
    
    useEffect(() => {
  setIsGuideShow(localStorage.getItem("showGuide") === "true" ? true : false);
    },[])
  
    const  handleCloseGuide = (e) => {
                      e.preventDefault();
          try {
        api.post('https://vendor-sales.onrender.com/close-guide');
      setIsGuideShow(false);
      localStorage.setItem("showGuide", Boolean(false))
      } catch (error) {
        console.log(error);
      }
    }
      useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize(); // initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    console.log("op");
    navigate('/login');
  }

  return (
    <>
    {!navOpen && (

    <nav className={styles.nav}>
        <img className={styles.logo} src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/7a3ec529632909.55fc107b84b8c.png" alt="" />
        {!isMobile && (
        <div className={styles.navContentContainer}>
        <span className={styles.navTextWrap} > <svg width={24} height={24} fill="none" stroke="#5400f0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  <path d="M9 22V12h6v10" />
</svg><Link style={{textDecoration: "none", color: "white"}} to="/home">Home</Link></span>

        <span className={styles.navTextWrap}><svg width={24} height={24} fill="none" stroke="#5400f0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
  <path d="M9 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
</svg> <Link style={{textDecoration: "none", color: "white"}} to="/customers">Customers</Link></span>
        <span className={styles.navTextWrap}> <svg width={24} height={24} fill="none" stroke="#5400f0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
</svg><Link style={{textDecoration: "none", color: "white"}} to="/sales">Sales</Link></span>
        <span className={styles.navTextWrap}><svg width={24} height={24} fill="none" stroke="#5400f0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" />
  <path d="M12 6v6l4 2" />
</svg> <Link style={{textDecoration: "none", color: "white"}} to="/history">History</Link></span>

        <span className={styles.navTextWrap} ><svg width={24} height={24} fill="none" stroke="#5400f0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 6h13" />
  <path d="M8 12h13" />
  <path d="M8 18h13" />
  <path d="M3 6h.01" />
  <path d="M3 12h.01" />
  <path d="M3 18h.01" />
</svg><Link style={{textDecoration: "none", color: "white"}} to="/my-items">My Items</Link></span>
        </div>
        )}

        <>
            {isMobile ? (
                <>
                 <svg onClick={() => setSidebarOpen(true)} width={24} height={24} fill="none" stroke="#5400f0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 12h18" />
  <path d="M3 6h18" />
  <path d="M3 18h18" />
</svg>
                </>
            ) : (
              <div className={styles.logAndUserContainer}>
                <Link to="/profile">
  <svg className={styles.userIcon} width={24} height={24} fill="none" stroke="#5400f0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  <path d="M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
</svg>
</Link>
<span>|</span>

  <button onClick={ handleLogOut} className={styles.logoutBtn}>Logout</button>
        </div>
            )}
            {!isMobile && (
             <span className={styles.navTextWrap} > 
<svg onClick={() => setIsGuideShow(true)} width={24} height={24} fill="#3c61d3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 <path d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9Zm0 1.5c4.151 0 7.5 3.349 7.5 7.5s-3.349 7.5-7.5 7.5A7.488 7.488 0 0 1 4.5 12c0-4.151 3.349-7.5 7.5-7.5Zm0 3c-1.65 0-3 1.35-3 3h1.5c0-.838.662-1.5 1.5-1.5s1.5.662 1.5 1.5c0 .574-.37 1.084-.914 1.266l-.305.093a1.516 1.516 0 0 0-1.031 1.43v.961h1.5v-.96l.305-.095A2.855 2.855 0 0 0 15 10.5c0-1.65-1.35-3-3-3Zm-.75 7.5v1.5h1.5V15h-1.5Z"></path>
</svg></span>
            )}

        {sidebarOpen && (
          <>
            <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)}></div>
                    <div className={styles.sidebar}>
                        <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>×</button>
                        <span><Link style={{textDecoration: "none", color: "white"}} to="/home">Home</Link></span>
                        <span><Link style={{textDecoration: "none", color: "white"}} to="/customers">Customers</Link></span>
                        <span><Link style={{textDecoration: "none", color: "white"}} to="/sales">Sales</Link></span>
                        <span><Link style={{textDecoration: "none", color: "white"}} to="/history">History</Link></span>
                        <span><Link style={{textDecoration: "none", color: "white"}} to="/my-items">My Items</Link></span>
                        <span onClick={() => setIsGuideShow(true)}>How to Use</span>
                        <span onClick={() => setNaveOpen(true)}>Close Nav</span>

                    </div>
                              </>

        )}
        </>
    </nav>
    )}
    <Outlet/>
    
    {/*-------------------------------- card  */}
    {isGuideShow && (
      <div className={styles.overlay}>
      <div className={styles.card}>
      <div className={styles.cardHeader}>Tutorial</div>
    
      <div className={styles.cardInfo}>
        <p className={styles.cardTitle}>
          How to access our Billing Management System ?
        </p>
    
        <p>
          <div >
    
            <div>
    1. Enter Customer Details
    Enter the Customer Phone Number and Customer Name before adding items.
        </div>
            <div>2. Enter Item Quantity or Amount
    Type a number for the item.
    Example: 23
    After typing the number, press + to confirm and add the item to the bill.
    
    </div>
            <div>3. Enter the Item Name
    After pressing +, the cursor will move to the Item Name field.
    Enter the name of the item before adding the next one.</div>
            <div>4. Use Multiplication if Needed
    If you want to multiply numbers, use *.
    
    Example:
    
    3*4 |
    You don’t need to write expressions like 3*1.
    Simply typing 3 will give the same result.
    </div>
            <div>5. Add More Items
    Repeat the same process.</div>
          </div>
        </p>
      </div>
    
      <div className={styles.footer}>
        <button type="button" onClick={(e) => handleCloseGuide(e)} className={styles.cardAction}>
          I Understand 
        </button>
      </div>
    </div>
    </div>
    )}
    </>
  )
}

export default Layout;
