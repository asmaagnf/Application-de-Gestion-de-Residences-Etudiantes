import React, { useState,useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { NavLink } from "react-router-dom";


const Avatar = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const userId = jwtDecode(token).userId;

        // Fetch user info by ID
        axios.get(`http://localhost:8080/api/users/${userId}`)
          .then(response => {
            setUserInfo(response.data);
          })
          .catch(error => {
            console.error('Error fetching user info:', error);
          });
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  return (
    <div>
      <NavLink to="/">
        <div className="bg-purple-500 h-24 w-24 flex items-center justify-center rounded-full relative">
          <span className="text-5xl text-white">
            {userInfo && userInfo.email ? userInfo.email[0].toUpperCase() : "?"}
          </span>
        </div>
      </NavLink>
    </div>
  );
};

export default Avatar;