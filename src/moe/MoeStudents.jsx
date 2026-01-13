import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Users, ChevronDown, Download } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const MoeStudents = () => {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // List of all 47 Kenyan counties
  const allKenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
    'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
    'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga',
    'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
    'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
    'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
    'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
    'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
    'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu',
    'Vihiga', 'Wajir', 'West Pokot'
  ];

  const [availableCounties, setAvailableCounties] = useState(allKenyanCounties);
  const [filters, setFilters] = useState({
    program: 'all',
    status: 'all',
    gender: 'all',
    county: 'all'
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState('all');

  // Fetch students data
  const fetchStudents = async (county = null) => {
    try {
      if (!currentUser?.token) {
        throw new Error('No authentication token found');
      }

      setLoading(true);
      setError(null);

      // For the main endpoint, we'll use GET with query parameters
      let url = `${API_BASE_URL}/api/v1/student-enrollment/`;
      
      if (county) {
        // For county-specific requests, use the student-dtl-cnt endpoint
        url += 'student-dtl-cnt';
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ county })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch students for county: ${county}`);
        }
        
        const data = await response.json();
        console.log('Fetched students by county:', data);
        setStudents(Array.isArray(data) ? data : []);
      } else {
        // For the main list, use GET
        url += 'student-dtl';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch students');
        }
        
        const data = await response.json();
        console.log('Fetched all students:', data);
        setStudents(Array.isArray(data) ? data : []);
      }
      
      // Keep all Kenyan counties but ensure any from the API are included
      const uniqueCounties = [...new Set(students.map(s => s.county).filter(Boolean))];
      setAvailableCounties(prev => [...new Set([...allKenyanCounties, ...prev, ...uniqueCounties])].sort());
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
      console.error('Fetch error:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const getUniqueValues = (key) => {
    return [...new Set(students.map(item => item[key]).filter(Boolean))];
  };

  // Apply filters and search
  const filteredStudents = Array.isArray(students) 
    ? students.filter(student => {
        const matchesSearch = 
          (student.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.studentAdmissionNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.studentNumber || '').includes(searchTerm);
        
        const matchesFilters = 
          (filters.program === 'all' || student.program === filters.program) &&
          (filters.status === 'all' || student.studentCurrentStatus === filters.status) &&
          (filters.gender === 'all' || student.studentGender === filters.gender) &&
          (filters.county === 'all' || student.county === filters.county);
        
        return matchesSearch && matchesFilters;
      })
    : [];

  // Calculate summary statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.studentCurrentStatus === 'Active').length;
  const maleStudents = students.filter(s => s.studentGender === 'Male').length;
  const femaleStudents = students.filter(s => s.studentGender === 'Female').length;

  // Calculate average attendance metrics
  const calculateAverageAttendance = (groupByKey) => {
    const groups = students.reduce((acc, student) => {
      const key = student[groupByKey] || 'Unknown';
      if (!acc[key]) {
        acc[key] = { total: 0, count: 0 };
      }
      // Assuming attendance is a number between 0-100, adjust field name as needed
      const attendance = parseFloat(student.attendancePercentage) || 0;
      acc[key].total += attendance;
      acc[key].count += 1;
      return acc;
    }, {});

    return Object.entries(groups).map(([key, { total, count }]) => ({
      name: key,
      average: count > 0 ? (total / count).toFixed(1) : 0
    })).sort((a, b) => b.average - a.average);
  };

  const attendanceByCounty = calculateAverageAttendance('county');
  const attendanceByInstitution = calculateAverageAttendance('institutionName');
  const attendanceByProgram = calculateAverageAttendance('program');

  // Fetch data on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      program: 'all',
      status: 'all',
      gender: 'all',
      county: 'all'
    });
    setSelectedCounty('all');
    setSearchTerm('');
    fetchStudents(); // Reset to show all students
  };

  // Handle county change
  const handleCountyChange = (e) => {
    const county = e.target.value;
    setSelectedCounty(county);
    
    if (county === 'all') {
      fetchStudents();
    } else {
      fetchStudents(county);
    }
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students Overview</h1>
          <p className="text-gray-600">View and analyze student data across all institutions</p>
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

          {/* Filter Button */}
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
              <div className="absolute right-0 z-10 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                    <select
                      name="program"
                      value={filters.program}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Programs</option>
                      {getUniqueValues('program').map(program => (
                        <option key={program} value={program}>{program}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Dropped Out">Dropped Out</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={filters.gender}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                    <select
                      name="county"
                      value={filters.county}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Counties</option>
                      {getUniqueValues('county').map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="w-full mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* County Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by County</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <select
              value={selectedCounty}
              onChange={handleCountyChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Counties</option>
              {allKenyanCounties.map((county, index) => (
                <option key={index} value={county}>{county}</option>
              ))}
            </select>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{totalStudents.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Students</p>
              <p className="mt-1 text-3xl font-semibold text-green-600">{activeStudents.toLocaleString()}</p>
              <p className="mt-1 text-sm text-gray-500">
                {totalStudents > 0 ? ((activeStudents / totalStudents) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Male Students</p>
              <p className="mt-1 text-3xl font-semibold text-blue-600">{maleStudents.toLocaleString()}</p>
              <p className="mt-1 text-sm text-gray-500">
                {totalStudents > 0 ? ((maleStudents / totalStudents) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Female Students</p>
              <p className="mt-1 text-3xl font-semibold text-pink-600">{femaleStudents.toLocaleString()}</p>
              <p className="mt-1 text-sm text-gray-500">
                {totalStudents > 0 ? ((femaleStudents / totalStudents) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="p-3 bg-pink-50 rounded-full">
              <Users className="h-6 w-6 text-pink-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Metrics Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Average Attendance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Attendance by County */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-4">By County</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {attendanceByCounty.length > 0 ? (
                attendanceByCounty.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
                    <span className="text-sm font-semibold text-blue-600">{item.average}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No attendance data available</p>
              )}
            </div>
          </div>

          {/* Attendance by Institution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-4">By Institution</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {attendanceByInstitution.length > 0 ? (
                attendanceByInstitution.slice(0, 10).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
                    <span className="text-sm font-semibold text-blue-600">{item.average}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No attendance data available</p>
              )}
              {attendanceByInstitution.length > 10 && (
                <p className="text-xs text-gray-500 mt-2">Showing top 10 of {attendanceByInstitution.length} institutions</p>
              )}
            </div>
          </div>

          {/* Attendance by Program */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-4">By Program</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {attendanceByProgram.length > 0 ? (
                attendanceByProgram.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 truncate">{item.name || 'N/A'}</span>
                    <span className="text-sm font-semibold text-blue-600">{item.average}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No attendance data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  County
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={`${student.studentAdmissionNumber}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.studentName || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{student.studentGender || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.studentAdmissionNumber || 'N/A'}</div>
                      <div className="text-xs text-gray-500">ID: {student.studentNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.studentCurrentStatus === 'Active' ? 'bg-green-100 text-green-800' : 
                        student.studentCurrentStatus === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {student.studentCurrentStatus || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.program || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.institutionName || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.county || 'N/A'}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No students found matching your criteria
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

export default MoeStudents;
