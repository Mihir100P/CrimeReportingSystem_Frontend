import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          setUser(null);
        } else {
          const storedUser = JSON.parse(localStorage.getItem("userInfo"));
          setUser(storedUser);
          fetchUserProfile(storedUser?._id); 
        }
      } catch (error) {
        console.error("Token decode error:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token'); 
  
      if (!token) {
        console.error("No token found, user is not authenticated");
        return;
      }
  
      const { data } = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      setAllData(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  const updateUserPoints = async (userId, points) => {
    try {
      const token = localStorage.getItem("token");
  
      const { data } = await axios.put(
        `http://localhost:5000/api/users/update-points/${userId}`,
        { points },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setUser((prevUser) => ({
        ...prevUser,
        credits: data.credits, 
      }));
  
      setAllData((prevData) => ({
        ...prevData,
        credits: data.credits, 
      }));
  
      return { success: true, message: "Points updated successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to update points" };
    }
  };
  
  
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      fetchUserProfile(data._id); 
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/register", userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      fetchUserProfile(data._id); 
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    setAllData(null);
  };


  return (
    <AuthContext.Provider value={{ user, allData, loading, login, register, logout , updateUserPoints}}>  
      {children}
    </AuthContext.Provider>
  );
};
