import React, { useState, useEffect } from 'react';
import { useMaterialTailwindController } from '@/context/index'; // Adjust the path accordingly
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Typography, Avatar, Chip, Input, Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useSelector } from 'react-redux';

export function Tables() {
  const navigate = useNavigate();
  const [controller] = useMaterialTailwindController();
  const { searchTerm } = controller;
  const customers = useSelector((state) => state.auth.customers);
  const [users, setUsers] = useState(customers);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  const handleUpdate = (user) => {
    navigate(`/dashboard/edit`, { state: { user } });
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'All') {
      return true;
    } else {
      return user.latestOrder && user.latestOrder.status.toLowerCase() === filter.toLowerCase();
    }
  }).filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.place.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mt-3 mb-8 flex flex-col gap-12">
      
       {/* <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
  <Typography variant="h6" color="white" className="hidden md:block">
    Customer Data
  </Typography>
  <div className="flex gap-4">
    <Input
      type="text"
      placeholder="Search ..."
      value={searchTerm}
      onChange={handleSearch}
      className="bg-white"
    />
   
  </div>
</CardHeader> */}


        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
  "Job",
  "Company",

    
    <Menu key="menu">
      <MenuHandler>
        <span>Status</span>
      </MenuHandler>
      <MenuList>
        <MenuItem onClick={() => handleFilterChange('All')}>All</MenuItem>
        <MenuItem onClick={() => handleFilterChange('Active')}>Active</MenuItem>
        <MenuItem onClick={() => handleFilterChange('Leave')}>Leave</MenuItem>
        <MenuItem onClick={() => handleFilterChange('Renew')}>Renew</MenuItem>
        <MenuItem onClick={() => handleFilterChange('Soon')}>Soon</MenuItem>
      </MenuList>
    </Menu>,
  "Type",
  `Apllicants:${filteredUsers.length}`,
].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, key) => {
                const className = `py-3 px-5 ${
                  key === users.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;
                // const { orders } = user;
                // const lastOrder = orders[orders.length - 1] || {};
                const { latestOrder = {} } = user;
                const { status, orderEnd } = latestOrder;
            
                const formattedDate = orderEnd ? new Intl.DateTimeFormat('en-GB').format(new Date(orderEnd)) : '';


                return (
                  <tr key={user._id} className="even:bg-blue-gray-50/50">
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar
                          src="https://static.vecteezy.com/system/resources/previews/026/530/210/original/modern-person-icon-user-and-anonymous-icon-vector.jpg"
                          alt={user.name}
                          size="sm"
                          variant="rounded"
                        />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {user.name}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {user.phone}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.place}
                      </Typography>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {user.plans}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={
                          status === 'renew'
                            ? 'blue-gray'
                            : status === 'leave'
                            ? 'yellow'
                            : new Date(orderEnd).getTime() - new Date().getTime() <= 3 * 24 * 60 * 60 * 1000
                            ? 'red'
                            : status === 'active'
                            ? 'green'
                            : status === 'soon'
                            ? 'blue'
                            : 'orange'
                        }
                        value={status || 'Unpaid'}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {formattedDate || 'N/A'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        as="a"
                        className="text-xs font-semibold text-blue-gray-600"
                        onClick={() => handleUpdate(user)}
                      >
                        Edit
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
  
    </div>
  );
}

export default Tables;
