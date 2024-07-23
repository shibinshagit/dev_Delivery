import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from '../../constants/BaseUrl';
import './swal.css';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Checkbox,
  List,
  ListItem
} from "@material-tailwind/react";
import { useDispatch } from 'react-redux';
import { fetchCostomers } from '@/redux/reducers/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';

function Edit() {
  const location = useLocation();
  const user = location.state.user || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    place: '',
    plan: [],
    paymentStatus: false,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    };

    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      place: user.place || '',
      plan: user.latestOrder?.plan || [],
      paymentStatus: user.paymentStatus || false,
      startDate: formatDate(user.latestOrder?.orderStart) || '',
      endDate: formatDate(user.latestOrder?.orderEnd) || '',
    });
  }, [user]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestedPlaces = ['Brototype', 'Vytila', 'Infopark'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'phone' && value.length > 10) {
      return;
    }

    if (name === 'startDate') {
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      setFormData({
        ...formData,
        startDate: value,
        endDate: endDate.toISOString().split('T')[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }

    if (name === 'place') {
      setShowSuggestions(value.length > 0);
    }
  };

  const handlePlanChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      const updatedPlan = checked
        ? [...prevFormData.plan, value]
        : prevFormData.plan.filter((plan) => plan !== value);
      return { ...prevFormData, plan: updatedPlan };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${BaseUrl}/api/updateUser/${user._id}`, formData)
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchCostomers());
          alert('User updated successfully');
        } 
        else if (response.status === 204) {
          alert('Fill all order data');
        }  
        else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          alert('Phone number already exists');
        }
        else {
          console.error('There was an error updating the user:', error);
          alert('Error updating user');
        }
      });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
  
    Swal.fire({
      title: 'Select an option',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: 'Block',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete the user
        axios.delete(`${BaseUrl}/api/deleteUser/${user._id}`)
          .then(response => {
            if (response.status === 200) {
              dispatch(fetchCostomers());
              Swal.fire('Deleted!', 'User has been deleted.', 'success');
              navigate('/dashboard/home')
            } else {
              Swal.fire('Error!', 'Cannot delete user.', 'error');
            }
          })
          .catch(error => {
            console.error('Error deleting user:', error);
            Swal.fire('Error!', 'An error occurred while deleting the user.', 'error');
          });
      } else if (result.isDenied) {
        // Soft delete (trash) the user
        axios.put(`${BaseUrl}/api/trashUser/${user._id}`)
          .then(response => {
            if (response.status === 200) {
              // dispatch(fetchCostomers());
              // Swal.fire('Trashed!', 'User has been moved to trash.', 'success');
              setIsEditing(false);

            } else {
              Swal.fire('Error!', 'Cannot trash user.', 'error');
            }
          })
          .catch(error => {
            console.error('Error trashing user:', error);
            Swal.fire('Error!', 'An error occurred while trashing the user.', 'error');
          });
      }
    });
  };
  

  const handleSuggestionClick = (place) => {
    setFormData({
      ...formData,
      place,
    });
    setShowSuggestions(false);
  };

  // const today = new Date().toISOString().split('T')[0];
  // ============================================================================================Date change
const today = new Date();
const twentyDaysAgo = new Date(today);
twentyDaysAgo.setDate(today.getDate() - 25);
const todayISO = today.toISOString().split('T')[0];
const twentyDaysAgoISO = twentyDaysAgo.toISOString().split('T')[0];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center my-12">
      <Card className="w-full max-w-lg">
        <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            Edit User
          </Typography>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody className="p-6">
            <div className="mb-4">
              <Input
                type="text"
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={!isEditing}
              />
            </div>
            <div className="mb-4">
              <Input
                type="number"
                name="phone"
                label="Phone Number"
                value={formData.phone}
                pattern="\d{10}"
                maxLength="10"
                onChange={handleChange}
                required
                disabled={!isEditing}
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                name="place"
                label="Place"
                value={formData.place}
                onChange={handleChange}
                required
                disabled={!isEditing}
              />
              {showSuggestions && (
                <List className="border rounded shadow-lg mt-2">
                  {suggestedPlaces
                    .filter((place) =>
                      place.toLowerCase().includes(formData.place.toLowerCase())
                    )
                    .map((place, index) => (
                      <ListItem
                        key={index}
                        onClick={() => handleSuggestionClick(place)}
                        className="cursor-pointer"
                      >
                        {place}
                      </ListItem>
                    ))}
                </List>
              )}
            </div>
            <div className="mb-4">
              <Checkbox
                name="paymentStatus"
                label="Paid"
                checked={formData.paymentStatus}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            {formData.paymentStatus && (
              <>
                <div className="mb-4">
                  <Typography variant="small" className="font-semibold mb-2">
                    Plan
                  </Typography>
                  <div className="flex flex-col gap-2">
                    <Checkbox
                      name="plan"
                      label="Breakfast"
                      value="B"
                      checked={formData.plan.includes('B')}
                      onChange={handlePlanChange}
                      disabled={!isEditing}
                    />
                    <Checkbox
                      name="plan"
                      label="Lunch"
                      value="L"
                      checked={formData.plan.includes('L')}
                      onChange={handlePlanChange}
                      disabled={!isEditing}
                    />
                    <Checkbox
                      name="plan"
                      label="Dinner"
                      value="D"
                      checked={formData.plan.includes('D')}
                      onChange={handlePlanChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Input
                    type="date"
                    name="startDate"
                    label="Start Date"
                    value={formData.startDate}
                    min={twentyDaysAgoISO} // restricts start date before today
                    onChange={handleChange}
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div className="mb-4">
                  <Input
                    type="date"
                    name="endDate"
                    label="End Date"
                    value={formData.endDate}
                    readOnly // disables entering the end date manually
                    required
                    disabled
                  />
                </div>
              </>
            )}
          </CardBody>
          <div className="flex justify-end p-6">
            {isEditing ? (
              <>
                <Button type="button" color="red" className="mr-2" onClick={handleDelete}>
                  Delete
                </Button>
                <Button type="button" color="red" className="mr-2" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button type="submit" color="green">
                  Submit
                </Button>
              </>
            ) : (
              <Button type="button" color="blue" onClick={handleEditClick}>
                Edit
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Edit;
