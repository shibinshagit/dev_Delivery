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
  const dispatch = useDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    bio: '',
    education: [{ degree: '', institution: '', yearOfCompletion: '' }],
    experience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    skills: [''],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        bio: user.bio || '',
        education: Array.isArray(user.education) ? [...user.education] : [{ degree: '', institution: '', yearOfCompletion: '' }],
        experience: Array.isArray(user.experience) ? [...user.experience] : [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
        skills: Array.isArray(user.skills) ? [...user.skills] : [''],
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleInputChange = (e, field, index = null) => {
    if (index !== null) {
      const updatedArray = [...formData[field]];
      updatedArray[index] = { ...updatedArray[index], [e.target.name]: e.target.value };
      setFormData({ ...formData, [field]: updatedArray });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleSaveChanges = () => {
    axios.put(`${BaseUrl}/api/editprofile/${user._id}`, formData, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
      .then(response => {
        dispatch(updateUser(response.data));
        handleEditToggle();
      })
      .catch(error => {
        console.error('Failed to save profile', error);
      });
  };

  return (
    <>
      <Card className="mx-3 mt-8 mb-6 relative shadow-md rounded-lg">
  <CardBody className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 transition duration-300">
    {/* Avatar with hover shadow effect */}
    <Avatar
      src={user.avatar || "https://static.vecteezy.com/system/resources/previews/026/530/210/original/modern-person-icon-user-and-anonymous-icon-vector.jpg"}
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
      {formData.bio || "Add a short bio or description"}
    </Typography>

    {/* Skills badges with hover interaction */}
    <Typography variant="h6" color="gray" className="mt-4">
      Skills:
    </Typography>
    <div className="flex flex-wrap gap-2 mt-2">
      {formData.skills.length > 0 ? (
        formData.skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors duration-300"
          >
            {skill}
          </span>
        ))
      ) : (
        <Typography variant="small" color="gray">
          Add Skills
        </Typography>
      )}
    </div>

    {/* Education section */}
    <Typography variant="h6" color="blue-gray" className="mt-6">
      Contact:
    </Typography>
    {/* User email */}
    <Typography variant="small" color="gray" className="mb-1">
      {user.email || "Your Email"}
    </Typography>
    
    {/* User phone number */}
    <Typography variant="small" color="gray" className="mb-1">
      {user.phone ? `Phone: ${user.phone}` : "Phone: Not Provided"}
    </Typography>

    {/* Education section */}
    <Typography variant="h6" color="blue-gray" className="mt-6">
      Education:
    </Typography>
    {formData.education.length > 0 ? (
      formData.education.map((edu, index) => (
        <Typography key={index} variant="small" color="gray" className="mt-1">
          {edu.degree} from {edu.institution} ({new Date(edu.yearOfCompletion).toLocaleDateString('en-US', { year: 'numeric' })})
        </Typography>
      ))
    ) : (
      <Typography variant="small" color="gray">
        Add Education
      </Typography>
    )}

    {/* Experience section with formatted dates */}
    <Typography variant="h6" color="blue-gray" className="mt-6">
      Experience:
    </Typography>
    {formData.experience.length > 0 ? (
      formData.experience.map((exp, index) => (
        <Typography key={index} variant="small" color="gray" className="mt-1">
          {exp.role} at {exp.company} (
          {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Present"})
        </Typography>
      ))
    ) : (
      <Typography variant="small" color="gray">
        Add Experience
      </Typography>
    )}

    {/* Edit profile button with hover effect */}
    <Button
      className="mt-6 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition duration-300"
      onClick={handleEditToggle}
    >
      Edit Profile
    </Button>
  </CardBody>
</Card>


      <Dialog open={dialogOpen} handler={setDialogOpen}>
        <DialogHeader>
          <IconButton onClick={handleEditToggle}>
            <X className="h-5 w-5" />
          </IconButton> 
        </DialogHeader>
        <DialogBody className="flex flex-col gap-6 max-h-96 overflow-y-auto">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => handleInputChange(e, 'name')}
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleInputChange(e, 'phone')}
          />
          <Input
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, 'email')}
          />
          <Input
            label="Bio"
            value={formData.bio}
            onChange={(e) => handleInputChange(e, 'bio')}
          />
          <Input
            label="Skills (comma separated)"
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(', ') })}
          />

          {/* Dynamic Experience Fields */}
          {formData.experience.map((exp, index) => (
            <div key={index} className="flex flex-col gap-4 mb-4">
              <Input
                label="Company"
                name="company"
                value={exp.company}
                onChange={(e) => handleInputChange(e, 'experience', index)}
              />
              <Input
                label="Role"
                name="role"
                value={exp.role}
                onChange={(e) => handleInputChange(e, 'experience', index)}
              />
              <Input
                type="date"
                label="Start Date"
                name="startDate"
                value={exp.startDate}
                onChange={(e) => handleInputChange(e, 'experience', index)}
              />
              <Input
                type="date"
                label="End Date"
                name="endDate"
                value={exp.endDate}
                onChange={(e) => handleInputChange(e, 'experience', index)}
              />
              <Input
                label="Description"
                name="description"
                value={exp.description}
                onChange={(e) => handleInputChange(e, 'experience', index)}
              />
              <Button
                className="self-end"
                onClick={() => handleRemoveEntry('experience', index)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
