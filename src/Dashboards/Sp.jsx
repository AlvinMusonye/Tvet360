import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const Sp = () => {
  const { currentUser } = useAuth();
  const [showAddClient, setShowAddClient] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    userPassword: '',
    userInstitution: '',
    userRole: 'MINISTRY_OF_EDUCATION_ADMIN'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Available roles for selection
  const availableRoles = [
    { value: 'MINISTRY_OF_EDUCATION_ADMIN', label: 'MOE Admin' },
    { value: 'INSTITUTION_ADMIN', label: 'Institution Admin' },
  ];

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    console.log('Attempting login with:', formData.username);
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    const data = await response.json();
    console.log('Login API Response:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    // Extract user data with fallbacks for different response structures
    const userData = {
      token: data.token || data.access_token,
      username: data.username || data.user?.username,
      role: data.role || data.user?.role,
      // Add any other required fields from your API response
    };

    // Validate we have the minimum required data
    if (!userData.token || !userData.username || !userData.role) {
      console.error('Incomplete user data received:', data);
      throw new Error('Incomplete user data received from server');
    }

    // Call login with rememberMe flag
    login(userData, formData.rememberMe);

    // Redirect based on role
    const userRole = userData.role.toUpperCase();
    switch(userRole) {
      case 'MINISTRY_OF_EDUCATION_ADMIN':
      case 'MOE_ADMIN':
        navigate('/moe');
        break;
      case 'INSTITUTION_ADMIN':
        navigate('/institution');
        break;
      case 'SP_ADMIN':
        navigate('/sp');
        break;
      default:
        console.warn('Unknown role, redirecting to default dashboard');
        navigate('/dashboard');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError(err.message || 'An error occurred during login. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
const handleAddClient = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setIsLoading(true);

  console.log('Preparing to create user with data:', formData);

  // Prepare the data to match backend expectations
  const userData = {
    username: formData.username.trim(),
    userPassword: formData.userPassword,
    userInstitution: formData.userInstitution || null, // Send null if not provided
    userRole: formData.userRole
  };

  try {
    console.log('Sending request to create user:', userData);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser?.token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });

    const responseData = await response.json();
    console.log('Create user response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create user');
    }

    // If we get here, the request was successful
    setSuccess('User created successfully!');
    
    // Reset the form
    setFormData({
      username: '',
      userPassword: '',
      userInstitution: '',
      userRole: 'MINISTRY_OF_EDUCATION_ADMIN'
    });
    
    // Refresh the clients list
    await fetchClients();
    setShowAddClient(false);
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => setSuccess(''), 5000);
    
  } catch (err) {
    console.error('Error creating user:', err);
    setError(err.message || 'An error occurred while creating the user');
    
    // Auto-hide error message after 5 seconds
    setTimeout(() => setError(''), 5000);
  } finally {
    setIsLoading(false);
  }
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="mb-10">
        <div>
          <h2 className="text-2xl font-bold">Service Provider Dashboard</h2>
          <p className="text-gray-600">System Overview & Client Management</p>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="text-lg font-semibold mb-2">Total Clients</h3>
          <p className="text-3xl font-bold">{clients.length}</p>
          <p className="text-sm text-gray-500">Active accounts</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold">24</p>
          <p className="text-sm text-gray-500">Currently online</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="text-lg font-semibold mb-2">System Status</h3>
          <p className="text-3xl font-bold text-green-600">Operational</p>
          <p className="text-sm text-gray-500">All systems normal</p>
        </div>
      </div>

      {/* Client Management */}
      <div className="bg-white p-6 rounded-lg shadow-medium mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Client Management</h3>
          <button
            onClick={() => setShowAddClient(!showAddClient)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            {showAddClient ? 'Cancel' : 'Add New Client'}
          </button>
        </div>

        {showAddClient && (
          <form onSubmit={handleAddClient} className="mb-8 p-6 border rounded-lg bg-gray-50">
            <h4 className="text-lg font-medium mb-4">Add New Client</h4>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
                {success}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="userPassword"
                  value={formData.userPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {formData.userRole === 'INSTITUTION_ADMIN' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <input
                    type="text"
                    name="userInstitution"
                    value={formData.userInstitution}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required={formData.userRole === 'INSTITUTION_ADMIN'}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="userRole"
                  value={formData.userRole}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {availableRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Add Client
              </button>
            </div>
          </form>
        )}

        {/* Clients Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.userInstitution || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {availableRoles.find(r => r.value === client.userRole)?.label || client.userRole}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No clients found. Add a new client to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sp;