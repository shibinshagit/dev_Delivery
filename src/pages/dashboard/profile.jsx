import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  IconButton
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { X } from 'lucide-react';
import { updateUser } from '@/redux/reducers/authSlice';
import { BaseUrl } from '@/constants/BaseUrl';

export function Profile() {
  const user = useSelector(state => state.auth.user);
  console.log('user:',user)
  const dispatch = useDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    points: '',
  });

  useEffect(() => {
    if (user) {
      console.log('user:',user)
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        points: user.points || '',
      });
    }
  }, [user]);



  return (
    <>
      <Card className=" mt-3 mb-20 relative shadow-md rounded-lg">
  <CardBody className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 transition duration-300">
    {/* Avatar with hover shadow effect */}
    <Avatar
      src={ "https://static.vecteezy.com/system/resources/previews/026/530/210/original/modern-person-icon-user-and-anonymous-icon-vector.jpg"}
      alt="Profile picture"
      size="xl"
      variant="circular"
      className="shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300"
    />
    
    {/* Name with larger font and blue accent */}
    <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
      {user.name || "Your Name"}
    </Typography>
    
    
    {/* Display bio with italic styling */}
    <Typography variant="small" color="blue-gray" className="italic mt-2 text-center">
      {user.phone || "Add a short bio or description"}
    </Typography>
   

   
  </CardBody>
</Card>


     
    </>
  );
}
