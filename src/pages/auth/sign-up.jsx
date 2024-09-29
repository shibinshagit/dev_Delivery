import React, { useState } from 'react';
import { Card, Input, Checkbox, Button, Typography, Alert } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { BaseUrl } from '@/constants/BaseUrl';
import { useDispatch } from 'react-redux';
import { fetchUserData, loginSuccess } from '@/redux/reducers/authSlice';

export function SignUp() {
  const [phone, setPhone] = useState("");
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("You must accept the Terms and Conditions");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }
    if (!/^\d{4}$/.test(code)) {
      setError("Code must be 4 digits.");
      return;
    }

    try {
      const response = await axios.post(`${BaseUrl}/services/delivery_login`, {
        phone,
        code,
      });
      if (response.status === 200) {
        console.log('dbValue:',response.data)
        dispatch(loginSuccess(response.data.token))
        dispatch(fetchUserData(response.data.token))
        navigate("/dashboard/home");
      }
    } catch (error) {
      setError("Invalid phone number or code.");
      console.error('Error checking ', error);
    }
  };

  return (
    <section className="mx-2 flex">
      <div className="flex justify-center items-center w-full min-h-screen py-6">
        <div className="w-full sm:w-4/5 md:w-3/5 lg:w-3/5 flex flex-col items-center justify-center">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4"></Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-11/12 sm:w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleEmailSubmit}>
            <div className="space-y-4 mt-8">
              <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
                <img src='https://bismimess.online/assets/img/gallery/bismi.png' className='w-8 h-8' alt="Logo" />
                <span>Bismi Delivery Partner</span>
              </Button>
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium"></Typography>
             
              <Input
                size="lg"
                placeholder="Phone Number"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{ className: "before:content-none after:content-none" }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength="10"
              />
              <Input
                size="lg"
                placeholder="4-digit Code"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{ className: "before:content-none after:content-none" }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength="4"
              />
            </div>
            {error && (
              <Alert color="red" className="mb-4">
                {error}
              </Alert>
            )}
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  I agree to the&nbsp;
                  <a
                    href="#"
                    className="font-normal text-black transition-colors hover:text-gray-900 underline"
                  >
                    Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <Button className="mt-6" fullWidth type="submit">
              Register Now
            </Button>

            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Want to join us?
              <a href="tel:+917012975494" className="text-gray-900"> chat</a>
            </Typography>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
