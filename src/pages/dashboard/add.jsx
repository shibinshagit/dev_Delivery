import React, { useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../constants/BaseUrl';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Checkbox,
  Select,
  Option,
} from "@material-tailwind/react";

function Add() {
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
    <div className="flex justify-center my-12">
      <Card className="w-full max-w-lg">
        <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            Add User
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
              />
            </div>
            <div className="mb-4">
              <Input
                type="number"
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
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
              />
              {/* <Select
                label="Place"
                name='place'
                value={formData.place}
                onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                required
              >
                <Option value="Brototype">Brototype</Option>
                <Option value="Vytila">Vytila</Option>
                <Option value="Infopark">Infopark</Option>
              </Select> */}
            </div>
            <div className="mb-4">
              <Checkbox
                name="paymentStatus"
                label="Paid"
                checked={formData.paymentStatus}
                onChange={handleChange}
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
                    />
                    <Checkbox
                      name="plan"
                      label="Lunch"
                      value="L"
                      checked={formData.plan.includes('L')}
                      onChange={handlePlanChange}
                    />
                    <Checkbox
                      name="plan"
                      label="Dinner"
                      value="D"
                      checked={formData.plan.includes('D')}
                      onChange={handlePlanChange}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Input
                    type="date"
                    name="startDate"
                    label="Start Date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Input
                    type="date"
                    name="endDate"
                    label="End Date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
          </CardBody>
          <div className="flex justify-end p-6">
            <Button
              type="button"
              color="red"
              className="mr-2"
              onClick={() => setFormData({
                name: '',
                phone: '',
                place: '',
                plan: [],
                paymentStatus: false,
                startDate: '',
                endDate: ''
              })}
            >
              Cancel
            </Button>
            <Button type="submit" color="green">
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Add;
