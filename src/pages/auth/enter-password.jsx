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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOTPChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to the next input
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isPassword) {
        const response = await axios.post(`${BaseUrl}/api/verify-password`, { email, password });
        if (response.status === 200) {
          const { token } = response.data;
          dispatch(loginSuccess({ token }));
          navigate('/dashboard/home');
        } else {
          setError('Password verification failed. Please try again.');
        }
      } else {
        const response = await axios.post(`${BaseUrl}/api/verify-otp`, { email, otp: otp.join('') });
        if (response.data.success) {
          navigate('/auth/create-password', { state: { email } });
        } else {
          setError('OTP verification failed. Please check your OTP and try again.');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex flex-col items-center justify-center">
      <div className="text-center">
        <Typography variant="h2" className="font-bold mb-4">
          {isPassword ? 'Welcome Back!' : 'Enter OTP'}
        </Typography>
      </div>
      <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
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
              <div className="flex items-center justify-start mt-2">
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
            <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <div
                key={index}
                className="relative flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg bg-white"
              >
                <input
                  id={`otp-input-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  className="w-full h-full text-center border-none focus:ring-0"
                  maxLength={1}
                  placeholder="-"
                  aria-label={`OTP digit ${index + 1}`}
                />
              </div>
            ))}
          </div>
          
          
          )}
        </div>
        <Button className="mt-6" fullWidth type="submit" disabled={loading}>
          {loading ? 'Processing...' : (isPassword ? 'Login' : 'Verify OTP')}
        </Button>
      </form>
    </section>
  );
}

export default OTPPass;
