import React, { useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../constants/BaseUrl';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  IconButton,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '@material-tailwind/react';

export function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    place: '',
    plan: [],
    paymentStatus: false,
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
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
    axios.post(`${BaseUrl}/api/postorder`, formData)
      .then(response => {
        if (response.status === 200) {
          alert('User added successfully');
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          alert('Phone number already exists');
        } else {
          console.error('There was an error adding the user:', error);
          alert('Error adding user');
        }
      });
  };

  return (
    <div className="container mx-auto">
      <Card className="p-6 max-w-md mx-auto">
        <Typography variant="h5" className="mb-4">
          Add User
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              label="Name"
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              label="Phone Number"
            />
          </div>
          <div className="mb-4">
            <Dropdown>
              <DropdownToggle>
                <Button variant="outlined" color="blue-gray" fullWidth>
                  {formData.place || "Select Place"}
                </Button>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => setFormData({ ...formData, place: 'Brototype' })}>Brototype</DropdownItem>
                <DropdownItem onClick={() => setFormData({ ...formData, place: 'Vytila' })}>Vytila</DropdownItem>
                <DropdownItem onClick={() => setFormData({ ...formData, place: 'Infopark' })}>Infopark</DropdownItem>
                <DropdownItem onClick={() => setFormData({ ...formData, place: 'Map' })}>Select on Map</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="mb-4">
            <Checkbox
              label="Paid"
              name="paymentStatus"
              checked={formData.paymentStatus}
              onChange={handleChange}
            />
          </div>
          {formData.paymentStatus && (
            <>
              <div className="mb-4">
                <Typography variant="h6">Plan</Typography>
                <Checkbox
                  label="Breakfast"
                  name="plan"
                  value="B"
                  onChange={handlePlanChange}
                />
                <Checkbox
                  label="Lunch"
                  name="plan"
                  value="L"
                  onChange={handlePlanChange}
                />
                <Checkbox
                  label="Dinner"
                  name="plan"
                  value="D"
                  onChange={handlePlanChange}
                />
              </div>
              <div className="mb-4">
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  label="Start Date"
                />
              </div>
              <div className="mb-4">
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  label="End Date"
                />
              </div>
            </>
          )}
          <div className="flex justify-between">
            <Button type="submit" color="green">
              Submit
            </Button>
            <Button type="button" color="red" onClick={() => setFormData({
              name: '',
              phone: '',
              place: '',
              plan: [],
              paymentStatus: false,
              startDate: '',
              endDate: ''
            })}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SignUp;





