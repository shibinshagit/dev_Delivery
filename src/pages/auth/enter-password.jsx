import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import axios from 'axios';
import { BaseUrl } from '@/constants/BaseUrl';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/reducers/authSlice';

export function OTPPass() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { email, isPassword } = location.state;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleOTPChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPassword) {
      try {
        const response = await axios.post(`${BaseUrl}/api/verify-password`, { email, password });
       
      if (response.status === 200) {
        const { token } = response.data;
        // dispatch(fetchCostomers());
        dispatch(loginSuccess({ token }));
        alert('Login successful');
        navigate('/dashboard/home');
      }  else {
          console.error('Password verification failed');
        }
      } catch (error) {
        console.error('Error verifying password', error);
      }
    } else {
      try {
        const response = await axios.post(`${BaseUrl}/api/verify-otp`, { email, otp: otp.join('') });
        if (response.data.success) {
          navigate('/auth/create-password', { state: { email } });
        } else {
          console.error('OTP verification failed');
        }
      } catch (error) {
        console.error('Error verifying OTP', error);
      }
    }
  };

  return (
    <section className="m-8 flex flex-col items-center justify-center">
      <div className="text-center">
        <Typography variant="h2" className="font-bold mb-4">
          {isPassword ? 'Enter Password' : 'Enter OTP'}
        </Typography>
      </div>
      <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col gap-6">
          {isPassword ? (
            <>
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your Password
              </Typography>
              <Input
                type={showPassword ? 'text' : 'password'}
                size="lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <div className="flex items-center justify-start">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <Typography variant="small" color="gray" className="ml-2 font-medium">
                  Show Password
                </Typography>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  size="lg"
                  placeholder="-"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 text-center"
                  maxLength={1}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <Button className="mt-6" fullWidth type="submit">
          {isPassword ? 'Login' : 'Verify OTP'}
        </Button>
      </form>
    </section>
  );
}

export default OTPPass;
