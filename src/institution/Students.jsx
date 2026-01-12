import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Calendar, Plus, Users, ChevronDown } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const Students = () => {
  const { currentUser } = useAuth();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); 
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [socioEconomicData, setSocioEconomicData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    program: 'all',
    status: 'all',
    gender: 'all'
  });

  // Fetch students data
  const fetchStudents = async () => {
    try {
      if (!currentUser?.token) {
        throw new Error('No authentication token found');
      }

      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/students`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch students');
      }
      
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
      console.error('Fetch error:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date to YYYY-MM-DDT00:00:00Z
  const formatDateForApi = (dateString) => {
    const date = new Date(dateString);
    // Format as YYYY-MM-DD and append T00:00:00Z
    return date.toISOString().split('T')[0] + 'T00:00:00Z';
  };

  // Fetch socio-economic data by program
  const fetchSocioEconomicByProgram = async (programCode) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/student-enrollment/total-soc-econ-prog`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser?.token}`
          },
          body: JSON.stringify({
            startDate: formatDateForApi(dateRange.startDate),
            endDate: formatDateForApi(dateRange.endDate),
            programCode: programCode || ''
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch socio-economic data by program');
      }

      return await response.json();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred while fetching program data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch socio-economic data
  const fetchSocioEconomicData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        startDate: formatDateForApi(dateRange.startDate),
        endDate: formatDateForApi(dateRange.endDate)
      }).toString();

      const apiUrl = `${API_BASE_URL}/api/v1/student-enrollment/total-soc-econ?${queryParams}`;
      console.log('Fetching from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      setSocioEconomicData(data);
    } catch (err) {
      console.error('Error in fetchSocioEconomicData:', err);
      setError(`Failed to fetch socio-economic data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  const filteredStudents = Array.isArray(students) 
    ? students.filter(student => {
        const matchesSearch = 
          (student.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.admissionNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.idNumber || '').includes(searchTerm);
        
        const matchesFilters = 
          (filters.program === 'all' || student.program === filters.program) &&
          (filters.status === 'all' || student.status === filters.status) &&
          (filters.gender === 'all' || student.gender === filters.gender);
        
        return matchesSearch && matchesFilters;
      })
    : [];

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));

    // If socio-economic filter is active, refetch data
    if (activeFilter === 'socioEconomic' || activeFilter === 'socioEconomicByProgram') {
      if (activeFilter === 'socioEconomic') {
        fetchSocioEconomicData();
      } else {
        fetchSocioEconomicByProgram();
      }
    }
  };

  // Handle filter selection
  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
    setShowFilterDropdown(false);
    
    if (filter === 'socioEconomic') {
      fetchSocioEconomicData();
    } else if (filter === 'socioEconomicByProgram') {
      fetchSocioEconomicByProgram('');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-600">Manage and analyze student data</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <Filter className="w-4 h-4 text-gray-500" />
              <span>Filter</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="p-2">
                  <button
                    onClick={() => handleFilterSelect('all')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Show All Students
                  </button>
                  <button
                    onClick={() => handleFilterSelect('socioEconomicByProgram')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'socioEconomicByProgram' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Socio-Economic by Program
                  </button>
                  <button
                    onClick={() => handleFilterSelect('socioEconomic')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'socioEconomic' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Socio-Economic Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Range Picker (shown when a date-based filter is active) */}
      {(activeFilter === 'socioEconomic' || activeFilter === 'socioEconomicByProgram') && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select Date Range</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="w-full pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  className="w-full pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Socio-Economic Data Display */}
      {!loading && !error && activeFilter === 'socioEconomic' && socioEconomicData && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Socio-Economic Distribution</h3>
          {/* Add your data visualization components here */}
          <pre className="bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify(socioEconomicData, null, 2)}
          </pre>
        </div>
      )}

      {/* Socio-Economic by Program Display */}
      {!loading && !error && activeFilter === 'socioEconomicByProgram' && socioEconomicData && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Socio-Economic by Program</h3>
          {/* Add your program-specific data visualization here */}
          <pre className="bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify(socioEconomicData, null, 2)}
          </pre>
        </div>
      )}

      {/* Students Table (shown when no specific filter is active) */}
      {!loading && !error && activeFilter === 'all' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{student.idNumber || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.admissionNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.program || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status || 'inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                        <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No students found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;