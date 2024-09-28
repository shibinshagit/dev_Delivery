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
  IconButton,
  Tooltip
} from "@material-tailwind/react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
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
    education: [{ degree: '', institution: '', yearOfCompletion: '' }],
    experience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    skills: [''],
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industry: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        education: Array.isArray(user.education) ? [...user.education] : [{ degree: '', institution: '', yearOfCompletion: '' }],
        experience: Array.isArray(user.experience) ? [...user.experience] : [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
        skills: Array.isArray(user.skills) ? [...user.skills] : [''],
        companyName: user.companyDetails?.companyName || '',
        companyWebsite: user.companyDetails?.companyWebsite || '',
        companySize: user.companyDetails?.companySize || '',
        industry: user.companyDetails?.industry || ''
      });
    }
  }, [user]);
  

  const handleEditToggle = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleInputChange = (e, field, index = null) => {
    if (index !== null) {
      const updatedArray = [...formData[field]];
      updatedArray[index] = { ...updatedArray[index], [e.target.name]: e.target.value }; // Ensure we are creating a new object
      setFormData({ ...formData, [field]: updatedArray });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };
  

  const handleAddEntry = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], field === 'education' ? { degree: '', institution: '', yearOfCompletion: '' } : { company: '', role: '', startDate: '', endDate: '', description: '' }]
    });
  };

  const handleRemoveEntry = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSaveChanges = () => {
    axios.put(`${BaseUrl}/api/editprofile/${user._id}`, formData, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
      .then(response => {
        console.log('updatedUser:', response.data);
        dispatch(updateUser(response.data));
        handleEditToggle();
      })
      .catch(error => {
        console.error('Failed to save profile', error);
      });
  };

  return (
    <>
      <Card className="mx-3 mt-8 mb-6 relative">
        <CardBody className="flex flex-col items-center p-4">
          <Avatar
            src={user.avatar || "../../../public/img/user.jpg"}
            alt="Profile picture"
            size="xl"
            variant="rounded"
            className="shadow-lg mb-4"
          />
          <Typography variant="h5" color="blue-gray" className="mb-2">
            {user.name || "Your Name"}
          </Typography>
          <Typography variant="small" color="gray">
            {user.email || "Your Email"}
          </Typography>
          <Typography variant="small" color="gray">
            {user.phone ? `Phone: ${user.phone}` : "Phone: Not Provided"}
          </Typography>
          
          {/* Display Skills */}
          <Typography variant="small" color="gray" className="mt-2">
            Skills: {formData.skills.length > 0 ? formData.skills.join(', ') : "Add Skills"}
          </Typography>

          {/* Display Education */}
          <Typography variant="h6" color="gray" className="mt-4">
            Education:
          </Typography>
          {formData.education.map((edu, index) => (
            <Typography key={index} variant="small" color="gray">
              {edu.degree} from {edu.institution} ({edu.yearOfCompletion})
            </Typography>
          ))}
          {formData.education.length === 0 && (
            <Typography variant="small" color="gray">
             Add Education
            </Typography>
          )}

          {/* Display Experience */}
          <Typography variant="h6" color="gray" className="mt-4">
            Experience:
          </Typography>
          {formData.experience.map((exp, index) => (
            <Typography key={index} variant="small" color="gray">
              {exp.role} at {exp.company} ({exp.startDate} - {exp.endDate})
            </Typography>
          ))}
          {formData.experience.length === 0 && (
            <Typography variant="small" color="gray">
              Add Experience
            </Typography>
          )}

         
            <Button
              className="mt-4"
              onClick={handleEditToggle}
            >
              Edit
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
            label="Skills (comma separated)"
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(', ') })}
          />

          {/* Dynamic Education Fields */}
          <Typography variant="h6">Education</Typography>
          {formData.education.map((edu, index) => (
            <div key={index} className="flex flex-col gap-4 mb-4">
              <Input
                label="Degree"
                name="degree"
                value={edu.degree}
                onChange={(e) => handleInputChange(e, 'education', index)}
              />
              <Input
                label="Institution"
                name="institution"
                value={edu.institution}
                onChange={(e) => handleInputChange(e, 'education', index)}
              />
              <Input
                label="Year of Completion"
                name="yearOfCompletion"
                value={edu.yearOfCompletion}
                onChange={(e) => handleInputChange(e, 'education', index)}
              />
              <Button
                className="self-end"
                onClick={() => handleRemoveEntry('education', index)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button
            className="self-start"
            onClick={() => handleAddEntry('education')}
          >
            Add Education
          </Button>

          {/* Dynamic Experience Fields */}
          <Typography variant="h6">Experience</Typography>
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
                label="Start Date"
                name="startDate"
                value={exp.startDate}
                onChange={(e) => handleInputChange(e, 'experience', index)}
              />
              <Input
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
          <Button
            className="self-start"
            onClick={() => handleAddEntry('experience')}
          >
            Add Experience
          </Button>
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
