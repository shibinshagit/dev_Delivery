import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
  // try {
  //   const decodedToken = jwtDecode(token);
  //   const userEmail = decodedToken.email;

  //   if (userEmail !== 'admin050@gmail.com') {
  //     return <Navigate to="/" replace />;
  //   }

 
  // } catch (error) {
  //   return <Navigate to="/" replace />;
  // }
};
export const IsAuthenticated = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (token) {
    console.log('auth;',token)
    return <Navigate to="/dashboard/home"/>;
  }
  return children;
};

