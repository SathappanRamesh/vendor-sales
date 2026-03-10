import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from './Log&Reg/Login';
import Register from './Log&Reg/Register';
import Home from './Home';
import Layout from './Layout';
import Profile from './Profile';
import Customers from './Customers.jsx';
import Sales from './Sales.jsx';
import Verification from './Verification.jsx';
import MyItems from './MyItems.jsx';
import History from './History.jsx';
import { UserDataContext } from './UserDataContext.jsx';
import api from "./api/axios";
import PrivateRoute from './PrivateRoute.jsx';

function App() {
    const [data, setData] = useState();
    const location = useLocation();

    
useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    setData(undefined);
    return;
  }

  fetchUserData();

}, [location.pathname]);
    
          const fetchUserData = async () => {
        try {
          const response = await api.get("https://vendor-sales.onrender.com/get-user-data")
          setData(response.data.userData);
        } catch (error) {
          console.log("Error getting user data:", error); 
        }
      }
      
  return (
    <>
        <UserDataContext.Provider value={{data, }}>
    <Routes>
      <Route path='login' element={<Login/>} />
      <Route path='register' element={<Register/>} />
      <Route path='verify' element={<Verification/>}/>
      {/* Protected Routes */}
      <Route element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
  <Route index element={<Home />} />
  <Route path="home" element={<Home />} />
    <Route path="profile" element={<Profile />} />
  <Route path="profile/:section" element={<Profile />} />
  <Route path="customers" element={<Customers />} />
  <Route path="sales" element={<Sales />} />
  <Route path="history" element={<History />} />
  <Route path="my-items" element={<MyItems />} />
</Route>
    </Routes>
        </UserDataContext.Provider>

    </>
  )
}

export default App
