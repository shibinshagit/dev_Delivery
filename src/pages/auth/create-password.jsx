import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import axios from 'axios';
import { BaseUrl } from '@/constants/BaseUrl';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/reducers/authSlice';

export function CreatePassword() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { email } = location.state;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`${BaseUrl}/api/create-password`, { email, password });
     
      if (response.status === 200) {
        const { token } = response.data;
        // dispatch(fetchCostomers());
        dispatch(loginSuccess({ token }));
        
        alert('Login successful');
        navigate('/dashboard/home');
      } else {
        console.error('Password creation failed');
      }
    } catch (error) {
      console.error('Error creating password', error);
    }
  };

  return (
    <section className="m-6 flex flex-col items-center justify-center">
      
      <div className="flex justify-center items-center w-full min-h-screen py-6">
        
  <form className="w-full sm:w-80 max-w-screen-lg lg:w-1/2 flex flex-col items-center" onSubmit={handleSubmit}>
  <div className="text-center">
        <Typography variant="h2" className="font-bold mb-4">Create Password</Typography>
      </div>
    <div className="mb-4 flex flex-col gap-6 w-full">
      <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
        Password
      </Typography>
      <Input
        type="password"
        size="lg"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
      />
      <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
        Confirm Password
      </Typography>
      <Input
        type="password"
        size="lg"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
      />
      {error && (
        <Typography variant="small" color="red" className="mt-2">
          {error}
        </Typography>
      )}
    </div>
    <Button className="mt-6" fullWidth type="submit">
      Create Password
    </Button>
  </form>
</div>

    </section>
  );
}

export default CreatePassword;
