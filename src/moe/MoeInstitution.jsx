import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Plus, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const MoeInstitution = () => {
  const { currentUser } = useAuth();
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  const [institutionTypes, setInstitutionTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    institutionRegistrationNumber: '',
    institutionName: '',
    institutionCounty: '',
    institutionType: 'INSTITUTE_OF_TECHNOLOGY',
    institutionAddress: '',
    institutionAccreditationStatus: 'ACCREDITED',
    institutionGovernanceScore: '',
    institutionCorruptionRiskIndex: '0.0',
    institutionStakeholderSatisfaction: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  // Fetch total institutions on component mount and when token changes
  useEffect(() => {
    if (currentUser?.token) {
      fetchInstitutionsData();
    }
  }, [currentUser?.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.institutionRegistrationNumber.trim()) errors.institutionRegistrationNumber = 'Registration number is required';
    if (!formData.institutionName.trim()) errors.institutionName = 'Institution name is required';
    if (!formData.institutionCounty.trim()) errors.institutionCounty = 'County is required';
    if (!formData.institutionAddress.trim()) errors.institutionAddress = 'Address is required';
    if (isNaN(formData.institutionGovernanceScore) || formData.institutionGovernanceScore < 0 || formData.institutionGovernanceScore > 100) {
      errors.institutionGovernanceScore = 'Governance score must be between 0 and 100';
    }
    if (isNaN(formData.institutionStakeholderSatisfaction) || formData.institutionStakeholderSatisfaction < 0 || formData.institutionStakeholderSatisfaction > 100) {
      errors.institutionStakeholderSatisfaction = 'Stakeholder satisfaction must be between 0 and 100';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setSubmitStatus({ success: false, message: '' });
      
      // Prepare the request body
      const requestBody = {
        ...formData,
        institutionGovernanceScore: parseFloat(formData.institutionGovernanceScore),
        institutionCorruptionRiskIndex: parseFloat(formData.institutionCorruptionRiskIndex),
        institutionStakeholderSatisfaction: parseFloat(formData.institutionStakeholderSatisfaction)
      };

      console.log('Sending request to:', `${API_BASE_URL}/api/v1/institution/create`);
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/api/v1/institution/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        const errorMessage = data?.message || 
                           data?.error || 
                           `Server responded with status ${response.status}`;
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          response: data
        });
        throw new Error(errorMessage);
      }

      setSubmitStatus({ success: true, message: 'Institution created successfully!' });
      // Reset form and refresh data
      setFormData({
        institutionRegistrationNumber: '',
        institutionName: '',
        institutionCounty: '',
        institutionType: 'INSTITUTE_OF_TECHNOLOGY',
        institutionAddress: '',
        institutionAccreditationStatus: 'ACCREDITED',
        institutionGovernanceScore: '',
        institutionCorruptionRiskIndex: '0.0',
        institutionStakeholderSatisfaction: ''
      });
      setShowCreateForm(false);
      
      // Refresh the institutions data
      fetchInstitutionsData();
    } catch (err) {
      console.error('Error creating institution:', err);
      setSubmitStatus({ success: false, message: err.message || 'An error occurred while creating the institution' });
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutionsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [totalRes, typesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/institution/total`, {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/api/v1/institution/total-by-type`, {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!totalRes.ok || !typesRes.ok) {
        throw new Error('Failed to fetch institution data');
      }

      const totalData = await totalRes.json();
      const typesData = await typesRes.json();

      if (totalData.status === 200) {
        setTotalInstitutions(totalData.data.value);
      }

      if (typesData.status === 200 && Array.isArray(typesData.data)) {
        setInstitutionTypes(typesData.data);
      }
    } catch (err) {
      console.error('Error fetching institution data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Filter institutions based on search and type
  const filteredInstitutions = institutionTypes.filter(type => {
    const matchesSearch = type.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || type.name === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Institutions Overview</h2>
        <p className="text-gray-600">Manage and monitor all registered institutions</p>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {showCreateForm ? 'Cancel' : 'Add New Institution'}
        </button>
      </div>

      {/* Create Institution Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Institution</h3>
          {submitStatus.message && (
            <div className={`mb-4 p-3 rounded ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {submitStatus.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Registration Number */}
              <div>
                <label htmlFor="institutionRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  id="institutionRegistrationNumber"
                  name="institutionRegistrationNumber"
                  value={formData.institutionRegistrationNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionRegistrationNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionRegistrationNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionRegistrationNumber}</p>
                )}
              </div>

              {/* Institution Name */}
              <div>
                <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionName}</p>
                )}
              </div>

              {/* County */}
              <div>
                <label htmlFor="institutionCounty" className="block text-sm font-medium text-gray-700 mb-1">
                  County *
                </label>
                <input
                  type="text"
                  id="institutionCounty"
                  name="institutionCounty"
                  value={formData.institutionCounty}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionCounty ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionCounty && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionCounty}</p>
                )}
              </div>

              {/* Institution Type */}
              <div>
                <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Type
                </label>
                <select
                  id="institutionType"
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="INSTITUTE_OF_TECHNOLOGY">Institute of Technology</option>
                  <option value="NATIONAL_POLYTECHNIC">National Polytechnic</option>
                  <option value="TECHNICAL_UNIVERSITY">Technical University</option>
                  <option value="TECHNICAL_VOCATIONAL_COLLEGE">Technical & Vocational College</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="institutionAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  id="institutionAddress"
                  name="institutionAddress"
                  value={formData.institutionAddress}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionAddress && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionAddress}</p>
                )}
              </div>

              {/* Accreditation Status */}
              <div>
                <label htmlFor="institutionAccreditationStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Accreditation Status
                </label>
                <select
                  id="institutionAccreditationStatus"
                  name="institutionAccreditationStatus"
                  value={formData.institutionAccreditationStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACCREDITED">Accredited</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="REVOKED">Revoked</option>
                </select>
              </div>

              {/* Governance Score */}
              <div>
                <label htmlFor="institutionGovernanceScore" className="block text-sm font-medium text-gray-700 mb-1">
                  Governance Score (0-100) *
                </label>
                <input
                  type="number"
                  id="institutionGovernanceScore"
                  name="institutionGovernanceScore"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.institutionGovernanceScore}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionGovernanceScore ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionGovernanceScore && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionGovernanceScore}</p>
                )}
              </div>

              {/* Corruption Risk Index */}
              <div>
                <label htmlFor="institutionCorruptionRiskIndex" className="block text-sm font-medium text-gray-700 mb-1">
                  Corruption Risk Index (0.0-1.0)
                </label>
                <input
                  type="number"
                  id="institutionCorruptionRiskIndex"
                  name="institutionCorruptionRiskIndex"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={formData.institutionCorruptionRiskIndex}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Stakeholder Satisfaction */}
              <div>
                <label htmlFor="institutionStakeholderSatisfaction" className="block text-sm font-medium text-gray-700 mb-1">
                  Stakeholder Satisfaction (0-100) *
                </label>
                <input
                  type="number"
                  id="institutionStakeholderSatisfaction"
                  name="institutionStakeholderSatisfaction"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.institutionStakeholderSatisfaction}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionStakeholderSatisfaction ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionStakeholderSatisfaction && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionStakeholderSatisfaction}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Institution'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search institutions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Types</option>
              {Array.isArray(institutionTypes) && institutionTypes.map((type) => (
                <option key={type.name} value={type.name}>
                  {type.name} ({type.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Institutions</p>
              <p className="text-2xl font-semibold text-gray-800">{totalInstitutions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Institutions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstitutions.length > 0 ? (
                filteredInstitutions.map((type) => (
                  <tr key={type.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {type.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {type.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((type.count / totalInstitutions) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    No institutions found matching your criteria
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

export default MoeInstitution;