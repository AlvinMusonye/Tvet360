import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ChevronDown } from 'lucide-react';

// Mock Data
const mockStudents = [
  {
    id: 1,
    studentName: "John Doe",
    studentAdmissionNumber: "ADM001",
    studentNumber: "STU001",
    program: "Computer Science",
    studentCurrentStatus: "Active",
    studentGender: "Male",
    institution: "Nairobi Technical Institute",
    county: "Nairobi",
    socioEconomicStatus: "Low Income",
    isRural: false,
    isRPL: false,
    isNYS: false,
    enrollmentDate: "2023-01-15"
  },
  {
    id: 2,
    studentName: "Jane Smith",
    studentAdmissionNumber: "ADM002",
    studentNumber: "STU002",
    program: "Electrical Engineering",
    studentCurrentStatus: "Active",
    studentGender: "Female",
    institution: "Mombasa Technical Institute",
    county: "Mombasa",
    socioEconomicStatus: "Middle Income",
    isRural: true,
    isRPL: true,
    isNYS: false,
    enrollmentDate: "2023-02-20"
  }
];

// Mock data responses
const mockData = {
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

const Students = () => {
  const { currentUser } = useAuth();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(mockStudents);
  const [socioEconomicData, setSocioEconomicData] = useState(null);
  const [filters, setFilters] = useState({
    program: 'all',
    status: 'all',
    gender: 'all'
  });

  // Mock data fetch functions
  const fetchStudents = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStudents(mockStudents);
      setSocioEconomicData(null);
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Socio-Economic Data
  const fetchSocioEconomicData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSocioEconomicData(mockData.socioEconomic);
    } catch (err) {
      setError('Failed to fetch socio-economic data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocioEconomicByProgram = async (programCode = '') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = programCode 
        ? mockData.socioEconomic.byProgram.find(p => 
            p.program.toLowerCase().includes(programCode.toLowerCase())
          ) || mockData.socioEconomic.byProgram
        : mockData.socioEconomic.byProgram;
      setSocioEconomicData({ 
        ...mockData.socioEconomic, 
        byProgram: Array.isArray(data) ? data : [data] 
      });
    } catch (err) {
      setError('Failed to fetch program data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Rural Enrollment
  const fetchRuralEnrollment = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSocioEconomicData(mockData.ruralEnrollment);
    } catch (err) {
      setError('Failed to fetch rural enrollment data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRuralEnrollmentByProgram = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSocioEconomicData({ 
        ...mockData.ruralEnrollment, 
        byProgram: mockData.ruralEnrollment.byProgram 
      });
    } catch (err) {
      setError('Failed to fetch rural enrollment by program');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // RPL Uptake
  const fetchRplUptake = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSocioEconomicData(mockData.rplUptake);
    } catch (err) {
      setError('Failed to fetch RPL uptake data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRplUptakeByProgram = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSocioEconomicData({ 
        ...mockData.rplUptake, 
        byProgram: mockData.rplUptake.byProgram 
      });
    } catch (err) {
      setError('Failed to fetch RPL uptake by program');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // NYS Enrollment
  const fetchNysEnrollment = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSocioEconomicData(mockData.nysEnrollment);
    } catch (err) {
      setError('Failed to fetch NYS enrollment data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNysEnrollmentByProgram = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSocioEconomicData({ 
        ...mockData.nysEnrollment, 
        byProgram: mockData.nysEnrollment.byProgram 
      });
    } catch (err) {
      setError('Failed to fetch NYS enrollment by program');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter selection
  const handleFilterSelect = async (filter) => {
    setActiveFilter(filter);
    setShowFilterDropdown(false);
    
    try {
      if (filter === 'all') {
        setFilters({ program: 'all', status: 'all', gender: 'all' });
        setSearchTerm('');
        await fetchStudents();
      } 
      // Socio-Economic Filters
      else if (filter === 'socioEconomic') {
        await fetchSocioEconomicData();
      } 
      else if (filter === 'socioEconomicByProgram') {
        await fetchSocioEconomicByProgram();
      }
      // Rural Enrollment Filters
      else if (filter === 'ruralEnrollment') {
        await fetchRuralEnrollment();
      }
      else if (filter === 'ruralEnrollmentByProgram') {
        await fetchRuralEnrollmentByProgram();
      }
      // RPL Uptake Filters
      else if (filter === 'rplUptake') {
        await fetchRplUptake();
      }
      else if (filter === 'rplUptakeByProgram') {
        await fetchRplUptakeByProgram();
      }
      // NYS Enrollment Filters
      else if (filter === 'nysEnrollment') {
        await fetchNysEnrollment();
      }
      else if (filter === 'nysEnrollmentByProgram') {
        await fetchNysEnrollmentByProgram();
      }
    } catch (err) {
      console.error('Error in handleFilterSelect:', err);
      setError(`Failed to load data: ${err.message}`);
    }
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
          (filters.gender === 'all' || student.studentGender === filters.gender);
        
        return matchesSearch && matchesFilters;
      })
    : [];

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
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter className="w-4 h-4 text-gray-500" />
              <span>Filter</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 z-10 w-72 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="p-2 space-y-1">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">General</div>
                  <button
                    onClick={() => handleFilterSelect('all')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Students
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Socio-Economic</div>
                  <button
                    onClick={() => handleFilterSelect('socioEconomic')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'socioEconomic' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Total Socio-Economic Enrollment
                  </button>
                  <button
                    onClick={() => handleFilterSelect('socioEconomicByProgram')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'socioEconomicByProgram' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    By Program
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rural Learners</div>
                  <button
                    onClick={() => handleFilterSelect('ruralEnrollment')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'ruralEnrollment' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Total Rural Enrollment
                  </button>
                  <button
                    onClick={() => handleFilterSelect('ruralEnrollmentByProgram')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'ruralEnrollmentByProgram' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    By Program
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">RPL Uptake</div>
                  <button
                    onClick={() => handleFilterSelect('rplUptake')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'rplUptake' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Total RPL Uptake
                  </button>
                  <button
                    onClick={() => handleFilterSelect('rplUptakeByProgram')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'rplUptakeByProgram' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    By Program
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">NYS Enrollment</div>
                  <button
                    onClick={() => handleFilterSelect('nysEnrollment')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'nysEnrollment' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Total NYS Enrollment
                  </button>
                  <button
                    onClick={() => handleFilterSelect('nysEnrollmentByProgram')}
                    className={`w-full text-left px-4 py-2 text-sm rounded ${
                      activeFilter === 'nysEnrollmentByProgram' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    By Program
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Display loading state */}
      {loading && (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      )}

      {/* Display error message */}
      {error && (
        <div className="p-4 mb-4 text-red-600 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Display data based on active filter */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {activeFilter === 'all' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                          <div className="text-sm text-gray-500">{student.studentNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.studentAdmissionNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.program}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.studentCurrentStatus === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.studentCurrentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(student.enrollmentDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {activeFilter === 'socioEconomic' && 'Socio-Economic Enrollment'}
                {activeFilter === 'socioEconomicByProgram' && 'Socio-Economic by Program'}
                {activeFilter === 'ruralEnrollment' && 'Rural Enrollment'}
                {activeFilter === 'ruralEnrollmentByProgram' && 'Rural Enrollment by Program'}
                {activeFilter === 'rplUptake' && 'RPL Uptake'}
                {activeFilter === 'rplUptakeByProgram' && 'RPL Uptake by Program'}
                {activeFilter === 'nysEnrollment' && 'NYS Enrollment'}
                {activeFilter === 'nysEnrollmentByProgram' && 'NYS Enrollment by Program'}
              </h2>
              
              {socioEconomicData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800">Total</h3>
                    <p className="text-2xl font-bold text-blue-600">{socioEconomicData.total || 0}</p>
                  </div>
                  
                  {socioEconomicData.lowIncome !== undefined && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800">Low Income</h3>
                      <p className="text-2xl font-bold text-green-600">{socioEconomicData.lowIncome}</p>
                    </div>
                  )}
                  
                  {socioEconomicData.middleIncome !== undefined && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-yellow-800">Middle Income</h3>
                      <p className="text-2xl font-bold text-yellow-600">{socioEconomicData.middleIncome}</p>
                    </div>
                  )}
                  
                  {socioEconomicData.highIncome !== undefined && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-purple-800">High Income</h3>
                      <p className="text-2xl font-bold text-purple-600">{socioEconomicData.highIncome}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Display data tables for specific filters */}
              {socioEconomicData?.byProgram && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    {activeFilter.includes('Program') ? 'Program Data' : 'By Program'}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {activeFilter.includes('socioEconomic') ? 'Program' : 
                             activeFilter.includes('rural') ? 'Program' : 
                             activeFilter.includes('rpl') ? 'Program' : 
                             activeFilter.includes('nys') ? 'Program' : 'Name'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          {socioEconomicData.byProgram[0]?.lowIncome !== undefined && (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low Income</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Middle Income</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">High Income</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {socioEconomicData.byProgram.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.program || item.institution || item.county}
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Students;