import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Users, ChevronDown, Download } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

// Mock data for aggregate views
const mockAggregateData = {
  socioEconomic: {
    total: 1500,
    lowIncome: 700,
    middleIncome: 600,
    highIncome: 200,
    byProgram: [
      { program: "Computer Science", count: 300, lowIncome: 150, middleIncome: 100, highIncome: 50 },
      { program: "Electrical Engineering", count: 250, lowIncome: 120, middleIncome: 100, highIncome: 30 },
    ],
    byInstitution: [
      { institution: "Nairobi Technical Institute", count: 500, lowIncome: 250, middleIncome: 200, highIncome: 50 },
      { institution: "Mombasa Technical Institute", count: 400, lowIncome: 200, middleIncome: 150, highIncome: 50 },
    ],
    byCounty: [
      { county: "Nairobi", count: 700, lowIncome: 300, middleIncome: 300, highIncome: 100 },
      { county: "Mombasa", count: 400, lowIncome: 200, middleIncome: 150, highIncome: 50 },
    ]
  },
  ruralEnrollment: {
    total: 450,
    byProgram: [
      { program: "Agriculture", count: 150 },
      { program: "Veterinary", count: 100 },
    ],
    byInstitution: [
      { institution: "Nairobi Technical Institute", count: 200 },
      { institution: "Mombasa Technical Institute", count: 150 },
    ],
    byCounty: [
      { county: "Nairobi", count: 200 },
      { county: "Mombasa", count: 150 },
    ]
  },
  rplUptake: {
    total: 200,
    byProgram: [
      { program: "Masonry", count: 80 },
      { program: "Carpentry", count: 70 },
    ],
    byInstitution: [
      { institution: "Nairobi Technical Institute", count: 100 },
      { institution: "Mombasa Technical Institute", count: 80 },
    ],
    byCounty: [
      { county: "Nairobi", count: 120 },
      { county: "Mombasa", count: 80 },
    ]
  },
  nysEnrollment: {
    total: 300,
    byProgram: [
      { program: "Security", count: 120 },
      { program: "Hospitality", count: 90 },
    ],
    byInstitution: [
      { institution: "Nairobi Technical Institute", count: 150 },
      { institution: "Mombasa Technical Institute", count: 100 },
    ]
  }
};

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
  const [showAnalysisDropdown, setShowAnalysisDropdown] = useState(false);
  const [activeView, setActiveView] = useState('students'); // 'students' or aggregate view name
  const [aggregateData, setAggregateData] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState('all');

  // Generate mock student data based on county
  const generateMockStudents = (county = null) => {
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Mary', 'Robert', 'Jennifer'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
    const programs = ['Computer Science', 'Business Administration', 'Engineering', 'Nursing', 'Education', 'Agriculture'];
    const statuses = ['Active', 'Inactive', 'Graduated', 'Dropped Out'];
    const genders = ['Male', 'Female'];
    
    // If no specific county is selected, return data for all counties
    const targetCounties = county ? [county] : allKenyanCounties;
    
    const mockStudents = [];
    
    targetCounties.forEach(county => {
      // Generate between 5-15 students per county
      const numStudents = 5 + Math.floor(Math.random() * 11);
      
      for (let i = 0; i < numStudents; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const program = programs[Math.floor(Math.random() * programs.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const gender = genders[Math.floor(Math.random() * genders.length)];
        
        mockStudents.push({
          id: `STU-${1000 + mockStudents.length}`,
          studentName: `${firstName} ${lastName}`,
          studentAdmissionNumber: `ADM-${new Date().getFullYear()}-${1000 + mockStudents.length}`,
          studentNumber: `STU-${1000 + mockStudents.length}`,
          program,
          studentCurrentStatus: status,
          studentGender: gender,
          county,
          institutionName: `${county} Technical Training Institute`,
          attendanceRate: (70 + Math.floor(Math.random() * 30)).toFixed(1) + '%',
          lastActive: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      }
    });
    
    return mockStudents;
  };

  // Fetch students data
  const fetchStudents = async (county = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock data
      const mockData = generateMockStudents(county);
      setStudents(mockData);
      
      // Update available counties based on mock data
      const uniqueCounties = [...new Set(mockData.map(s => s.county).filter(Boolean))];
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
    const county = e.target.value === 'all' ? null : e.target.value;
    setSelectedCounty(e.target.value);
    fetchStudents(county);
  };

  // Handle view selection for aggregates
  const handleViewSelect = async (view) => {
    setActiveView(view);
    setShowAnalysisDropdown(false);
    setAggregateData(null);

    if (view === 'students') {
      fetchStudents();
      return;
    }

    // Simulate fetching aggregate data
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Map view to data source
      if (view.startsWith('socioEconomic')) {
        setAggregateData(mockAggregateData.socioEconomic);
      } else if (view.startsWith('ruralEnrollment')) {
        setAggregateData(mockAggregateData.ruralEnrollment);
      } else if (view.startsWith('rplUptake')) {
        setAggregateData(mockAggregateData.rplUptake);
      } else if (view.startsWith('nysEnrollment')) {
        setAggregateData(mockAggregateData.nysEnrollment);
      }
    } catch (err) {
      console.error('Error fetching aggregate data:', err);
      setError('Failed to load analysis data');
    } finally {
      setLoading(false);
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

          {/* Analysis Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAnalysisDropdown(!showAnalysisDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <Filter className="w-4 h-4 text-gray-500" />
              <span>Analysis</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showAnalysisDropdown && (
              <div className="absolute right-0 z-20 mt-2 w-72 bg-white rounded-md shadow-lg border border-gray-200 p-2 max-h-96 overflow-y-auto">
                <div className="space-y-1">
                  <button
                    onClick={() => handleViewSelect('students')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'students' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Student List
                  </button>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Socio-Economic</div>
                  <button
                    onClick={() => handleViewSelect('socioEconomic')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'socioEconomic' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Total Overview
                  </button>
                  <button
                    onClick={() => handleViewSelect('socioEconomicByInstitution')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'socioEconomicByInstitution' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    By Institution
                  </button>
                  <button
                    onClick={() => handleViewSelect('socioEconomicByCounty')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'socioEconomicByCounty' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    By County
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Rural Learners</div>
                  <button
                    onClick={() => handleViewSelect('ruralEnrollment')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'ruralEnrollment' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Total Overview
                  </button>
                  <button
                    onClick={() => handleViewSelect('ruralEnrollmentByInstitution')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'ruralEnrollmentByInstitution' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    By Institution
                  </button>
                  <button
                    onClick={() => handleViewSelect('ruralEnrollmentByCounty')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'ruralEnrollmentByCounty' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    By County
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">RPL Uptake</div>
                  <button
                    onClick={() => handleViewSelect('rplUptake')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'rplUptake' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Total Overview
                  </button>
                  <button
                    onClick={() => handleViewSelect('rplUptakeByInstitution')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'rplUptakeByInstitution' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    By Institution
                  </button>
                  <button
                    onClick={() => handleViewSelect('rplUptakeByCounty')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'rplUptakeByCounty' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    By County
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">NYS Enrollment</div>
                  <button
                    onClick={() => handleViewSelect('nysEnrollment')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'nysEnrollment' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Total Overview
                  </button>
                  <button
                    onClick={() => handleViewSelect('nysEnrollmentByInstitution')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeView === 'nysEnrollmentByInstitution' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    By Institution
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filter Button */}
          {activeView === 'students' && (
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
          )}

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {activeView === 'students' ? (
      <>
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
      </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {activeView.includes('socioEconomic') && 'Socio-Economic Analysis'}
            {activeView.includes('ruralEnrollment') && 'Rural Enrollment Analysis'}
            {activeView.includes('rplUptake') && 'RPL Uptake Analysis'}
            {activeView.includes('nysEnrollment') && 'NYS Enrollment Analysis'}
          </h2>

          {aggregateData && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">Total</h3>
                  <p className="text-2xl font-bold text-blue-600">{aggregateData.total || 0}</p>
                </div>
                {aggregateData.lowIncome !== undefined && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800">Low Income</h3>
                    <p className="text-2xl font-bold text-green-600">{aggregateData.lowIncome}</p>
                  </div>
                )}
                {aggregateData.middleIncome !== undefined && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-800">Middle Income</h3>
                    <p className="text-2xl font-bold text-yellow-600">{aggregateData.middleIncome}</p>
                  </div>
                )}
                {aggregateData.highIncome !== undefined && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-800">High Income</h3>
                    <p className="text-2xl font-bold text-purple-600">{aggregateData.highIncome}</p>
                  </div>
                )}
              </div>

              {/* Detailed Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {activeView.includes('ByInstitution') ? 'Institution' : 
                         activeView.includes('ByCounty') ? 'County' : 'Category'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      {aggregateData.lowIncome !== undefined && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low Income</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Middle Income</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">High Income</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(() => {
                      let dataToRender = [];
                      if (activeView.includes('ByInstitution')) dataToRender = aggregateData.byInstitution || [];
                      else if (activeView.includes('ByCounty')) dataToRender = aggregateData.byCounty || [];
                      else dataToRender = aggregateData.byProgram || []; // Default to program or general view

                      return dataToRender.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.institution || item.county || item.program || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.count}
                          </td>
                          {item.lowIncome !== undefined && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.lowIncome}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.middleIncome}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.highIncome}
                              </td>
                            </>
                          )}
                        </tr>
                      ));
                    })()}
                    {(!aggregateData.byInstitution && activeView.includes('ByInstitution')) || 
                     (!aggregateData.byCounty && activeView.includes('ByCounty')) ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No breakdown data available for this view.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoeStudents;
