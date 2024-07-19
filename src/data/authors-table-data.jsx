import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../constants/BaseUrl';

function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // Default filter

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/users`);
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updateorder/${id}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  // Filtering logic based on selected filter
  const filteredUsers = users.filter(user => {
    if (filter === 'All') {
      return true; // Show all users if filter is 'All'
    } else {
      return user.orders.length > 0 && user.orders[user.orders.length - 1].status.toLowerCase() === filter.toLowerCase();
    }
  }).filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.place.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (error) {
    return <p>{error}</p>; 
  }

  return (
    <div className="container">
      <div className="page-inner">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-round">
              <div className="card-header">
                <div className="card-head-row card-tools-still-right">
                  <div className="card-title"></div>
                  <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-lg-flex">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <button type="submit" className="btn btn-search pe-1">
                          <i className="fa fa-search search-icon"></i>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Search ..."
                        className="form-control"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                  </nav>
                  <div className="card-tools">
                    <div className="dropdown">
                      <button
                        className="btn btn-icon btn-clean me-0"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <a
                          className={`dropdown-item ${filter === 'All' ? 'active' : ''}`}
                          href="#"
                          onClick={() => handleFilterChange('All')}
                        >
                          All
                        </a>
                        <a
                          className={`dropdown-item ${filter === 'Active' ? 'active' : ''}`}
                          href="#"
                          onClick={() => handleFilterChange('Active')}
                        >
                          Active
                        </a>
                        <a
                          className={`dropdown-item ${filter === 'Leave' ? 'active' : ''}`}
                          href="#"
                          onClick={() => handleFilterChange('Leave')}
                        >
                          Leave
                        </a>
                        <a
                          className={`dropdown-item ${filter === 'Renew' ? 'active' : ''}`}
                          href="#"
                          onClick={() => handleFilterChange('Renew')}
                        >
                          Renew
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  {filteredUsers.map(user => (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={user._id}>
                      <div className="card card-round">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-4">
                              <img
                                src="/img/user.png"
                                alt={user.name}
                                className="img-fluid rounded-circle"
                              />
                            </div>
                            <div className="col-8">
                              <h6 className="mb-0">
                                {user.name}
                              </h6>
                              <small className="text-muted">
                                {user.phone}
                              </small>
                              <p className="mb-0">
                                {user.place}
                              </p>
                              <p className="mb-0">
                                Status: {user.orders.length > 0 ? user.orders[user.orders.length - 1].status : 'No orders'}
                              </p>
                              <button
                                className="btn btn-primary btn-sm mt-2"
                                onClick={() => handleUpdate(user._id)}
                              >
                                Update Order
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;
