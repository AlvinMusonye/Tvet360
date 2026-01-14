import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ChevronDown, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock Data
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const initialFilters = {
  programCode: 'all',
  studentCurrentStatus: 'all',
  studentGender: 'all',
  studentSocioEconomicStatus: 'all',
  studentDisabilityStatus: 'all',
  studentRuralLearner: 'all',
  studentNYSEnrollment: 'all',
  studentDualApprenticeship: 'all',
  studentRPLStatus: 'all',
  ethnicGroupId: '',
  wardId: '',
  enrollmentDateStart: '',
  enrollmentDateEnd: '',
  completionDateStart: '',
  completionDateEnd: '',
  attendanceRateMin: '',
  attendanceRateMax: '',
  dropoutRiskMin: '',
  dropoutRiskMax: '',
};

const Students = () => {
  const { currentUser } = useAuth();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    studentAdmissionNumber: "",
    studentNumber: "",
    studentName: "",
    studentReportingStatus: "REPORTED",
    studentGender: "Male",
    studentDateOfBirth: "",
    studentSocioEconomicStatus: "Low Income",
    studentDisabilityStatus: false,
    studentRuralLearner: false,
    studentEnrollmentDate: "",
    studentExpectedCompletionDate: "",
    studentCurrentStatus: "Active",
    studentAttendanceRate: 0.1,
    studentDropoutRisk: 0.1,
    studentNYSEnrollment: false,
    studentDualApprenticeship: false,
    studentRPLStatus: false,
    ethnicGroupId: 0,
    programCode: "",
    wardId: 0
  });

  // Mock data fetch functions
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/student-dtl`, {
        headers: { 'Authorization': `Bearer ${currentUser?.token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch students');
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

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    try {
        const payload = {
            ...newStudentData,
            studentAttendanceRate: parseFloat(newStudentData.studentAttendanceRate) || 0,
            studentDropoutRisk: parseFloat(newStudentData.studentDropoutRisk) || 0,
            ethnicGroupId: parseInt(newStudentData.ethnicGroupId) || 0,
            wardId: parseInt(newStudentData.wardId) || 0,
        };

        const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser?.token}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to enroll student');
        }
        
        setShowEnrollModal(false);
        fetchStudents(); // Refresh student list
        setSuccessMessage(result.message || 'Student enrolled successfully!');
        setTimeout(() => setSuccessMessage(''), 5000); // Hide after 5 seconds
        setNewStudentData({ // Reset form
            studentAdmissionNumber: "", studentNumber: "", studentName: "", studentReportingStatus: "REPORTED", studentGender: "Male", studentDateOfBirth: "", studentSocioEconomicStatus: "Low Income", studentDisabilityStatus: false, studentRuralLearner: false, studentEnrollmentDate: "", studentExpectedCompletionDate: "", studentCurrentStatus: "Active", studentAttendanceRate: 0.1, studentDropoutRisk: 0.1, studentNYSEnrollment: false, studentDualApprenticeship: false, studentRPLStatus: false, ethnicGroupId: 0, programCode: "", wardId: 0
        });

    } catch (err) {
        setError(err.message);
        console.error('Enrollment error:', err);
    } finally {
        setLoading(false);
    }
};

  // Handle filter selection
  const handleFilterSelect = async (filter) => {
    setActiveFilter(filter);
    setShowFilterDropdown(false);
    setCurrentPage(1);
    
    try {
      if (filter === 'all') {
        setFilters(initialFilters);
        setSearchTerm('');
        await fetchStudents();
      }
    } catch (err) {
      console.error('Error in handleFilterSelect:', err);
      setError(`Failed to load data: ${err.message}`);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleNewStudentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStudentData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Apply filters and search
  const filteredStudents = Array.isArray(students) 
    ? students.filter(student => {
        const matchesSearch = 
          (student.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.studentAdmissionNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.studentNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesFilters = 
          (filters.programCode === 'all' || student.programCode === filters.programCode) &&
          (filters.studentCurrentStatus === 'all' || student.studentCurrentStatus === filters.studentCurrentStatus) &&
          (filters.studentGender === 'all' || student.studentGender === filters.studentGender) &&
          (filters.studentSocioEconomicStatus === 'all' || student.studentSocioEconomicStatus === filters.studentSocioEconomicStatus) &&
          (filters.studentDisabilityStatus === 'all' || String(student.studentDisabilityStatus) === filters.studentDisabilityStatus) &&
          (filters.studentRuralLearner === 'all' || String(student.studentRuralLearner) === filters.studentRuralLearner) &&
          (filters.studentNYSEnrollment === 'all' || String(student.studentNYSEnrollment) === filters.studentNYSEnrollment) &&
          (filters.studentDualApprenticeship === 'all' || String(student.studentDualApprenticeship) === filters.studentDualApprenticeship) &&
          (filters.studentRPLStatus === 'all' || String(student.studentRPLStatus) === filters.studentRPLStatus) &&
          (filters.ethnicGroupId === '' || String(student.ethnicGroupId) === filters.ethnicGroupId) &&
          (filters.wardId === '' || String(student.wardId) === filters.wardId) &&
          (!filters.enrollmentDateStart || new Date(student.studentEnrollmentDate) >= new Date(filters.enrollmentDateStart)) &&
          (!filters.enrollmentDateEnd || new Date(student.studentEnrollmentDate) <= new Date(filters.enrollmentDateEnd)) &&
          (!filters.completionDateStart || new Date(student.studentExpectedCompletionDate) >= new Date(filters.completionDateStart)) &&
          (!filters.completionDateEnd || new Date(student.studentExpectedCompletionDate) <= new Date(filters.completionDateEnd)) &&
          (filters.attendanceRateMin === '' || student.studentAttendanceRate >= parseFloat(filters.attendanceRateMin)) &&
          (filters.attendanceRateMax === '' || student.studentAttendanceRate <= parseFloat(filters.attendanceRateMax)) &&
          (filters.dropoutRiskMin === '' || student.studentDropoutRisk >= parseFloat(filters.dropoutRiskMin)) &&
          (filters.dropoutRiskMax === '' || student.studentDropoutRisk <= parseFloat(filters.dropoutRiskMax));
        
        return matchesSearch && matchesFilters;
      })
    : [];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

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
          <button
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Enroll Student
          </button>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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
              <div className="absolute right-0 z-10 w-72 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
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

                  {activeFilter === 'all' && (
                    <div className="p-2 space-y-2 border-t mt-2">
                      <h4 className="px-2 text-xs font-semibold text-gray-500 uppercase">Filter List</h4>
                      <div>
                        <label className="text-xs text-gray-600">Gender</label>
                        <select name="studentGender" value={filters.studentGender} onChange={handleFilterChange} className="w-full p-1 border rounded-md text-sm">
                          <option value="all">All</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Socio-Economic Status</label>
                        <select name="studentSocioEconomicStatus" value={filters.studentSocioEconomicStatus} onChange={handleFilterChange} className="w-full p-1 border rounded-md text-sm">
                          <option value="all">All</option>
                          <option value="Low Income">Low Income</option>
                          <option value="Middle Income">Middle Income</option>
                          <option value="High Income">High Income</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Disability</label>
                        <select name="studentDisabilityStatus" value={filters.studentDisabilityStatus} onChange={handleFilterChange} className="w-full p-1 border rounded-md text-sm">
                          <option value="all">All</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Rural Learner</label>
                        <select name="studentRuralLearner" value={filters.studentRuralLearner} onChange={handleFilterChange} className="w-full p-1 border rounded-md text-sm">
                          <option value="all">All</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                       <div>
                        <label className="text-xs text-gray-600">Current Status</label>
                        <select name="studentCurrentStatus" value={filters.studentCurrentStatus} onChange={handleFilterChange} className="w-full p-1 border rounded-md text-sm">
                          <option value="all">All</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Graduated">Graduated</option>
                          <option value="Dropped Out">Dropped Out</option>
                        </select>
                      </div>
                      <button onClick={() => setFilters(initialFilters)} className="w-full text-center text-sm text-blue-600 hover:underline">
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Display success message */}
      {successMessage && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}

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
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
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
                {currentStudents.map((student) => (
                  <tr key={student.studentAdmissionNumber} className="hover:bg-gray-50">
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
                      {student.programCode || student.program}
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
                      {student.studentEnrollmentDate ? formatDate(student.studentEnrollmentDate) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredStudents.length > 0 ? indexOfFirstItem + 1 : 0}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredStudents.length)}</span> of{' '}
                    <span className="font-medium">{filteredStudents.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
        </div>
      )}

      {showEnrollModal && (
        <div className="fixed inset-0  bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Enroll New Student</h3>
                <button onClick={() => setShowEnrollModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEnrollStudent} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
                  <input id="studentName" name="studentName" value={newStudentData.studentName} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" required />
                </div>
                <div>
                  <label htmlFor="studentAdmissionNumber" className="block text-sm font-medium text-gray-700">Admission Number</label>
                  <input id="studentAdmissionNumber" name="studentAdmissionNumber" value={newStudentData.studentAdmissionNumber} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" required />
                </div>
                <div>
                  <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">Student Number (ID/Passport/Birth Cert)</label>
                  <input id="studentNumber" name="studentNumber" value={newStudentData.studentNumber} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" placeholder="ID, Passport, or Birth Cert No." required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="studentGender" className="block text-sm font-medium text-gray-700">Gender</label>
                  <select id="studentGender" name="studentGender" value={newStudentData.studentGender} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="studentDateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input id="studentDateOfBirth" type="date" name="studentDateOfBirth" value={newStudentData.studentDateOfBirth} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" required />
                </div>
                <div>
                  <label htmlFor="studentSocioEconomicStatus" className="block text-sm font-medium text-gray-700">Socio-Economic Status</label>
                  <select id="studentSocioEconomicStatus" name="studentSocioEconomicStatus" value={newStudentData.studentSocioEconomicStatus} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md">
                    <option value="Low Income">Low Income</option>
                    <option value="Middle Income">Middle Income</option>
                    <option value="High Income">High Income</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="programCode" className="block text-sm font-medium text-gray-700">Program Code</label>
                  <input id="programCode" name="programCode" value={newStudentData.programCode} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" required />
                </div>
                <div>
                  <label htmlFor="studentCurrentStatus" className="block text-sm font-medium text-gray-700">Current Status</label>
                  <select id="studentCurrentStatus" name="studentCurrentStatus" value={newStudentData.studentCurrentStatus} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Dropped Out">Dropped Out</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="studentReportingStatus" className="block text-sm font-medium text-gray-700">Reporting Status</label>
                  <select id="studentReportingStatus" name="studentReportingStatus" value={newStudentData.studentReportingStatus} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md">
                    <option value="REPORTED">Reported</option>
                    <option value="NOT_REPORTED">Not Reported</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentEnrollmentDate" className="block text-sm font-medium text-gray-700">Enrollment Date</label>
                  <input id="studentEnrollmentDate" type="date" name="studentEnrollmentDate" value={newStudentData.studentEnrollmentDate} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" required />
                </div>
                <div>
                  <label htmlFor="studentExpectedCompletionDate" className="block text-sm font-medium text-gray-700">Expected Completion Date</label>
                  <input id="studentExpectedCompletionDate" type="date" name="studentExpectedCompletionDate" value={newStudentData.studentExpectedCompletionDate} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentAttendanceRate" className="block text-sm font-medium text-gray-700">Attendance Rate (0-1)</label>
                  <input id="studentAttendanceRate" type="number" step="0.01" min="0" max="1" name="studentAttendanceRate" value={newStudentData.studentAttendanceRate} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" />
                </div>
                <div>
                  <label htmlFor="studentDropoutRisk" className="block text-sm font-medium text-gray-700">Dropout Risk (0-1)</label>
                  <input id="studentDropoutRisk" type="number" step="0.01" min="0" max="1" name="studentDropoutRisk" value={newStudentData.studentDropoutRisk} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" />
                </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ethnicGroupId" className="block text-sm font-medium text-gray-700">Ethnic Group ID</label>
                  <input id="ethnicGroupId" type="number" name="ethnicGroupId" value={newStudentData.ethnicGroupId} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" />
                </div>
                <div>
                  <label htmlFor="wardId" className="block text-sm font-medium text-gray-700">Ward ID</label>
                  <input id="wardId" type="number" name="wardId" value={newStudentData.wardId} onChange={handleNewStudentChange} className="mt-1 p-2 block w-full border rounded-md" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                <label className="flex items-center gap-2"><input type="checkbox" name="studentDisabilityStatus" checked={newStudentData.studentDisabilityStatus} onChange={handleNewStudentChange} /> Disabled</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="studentRuralLearner" checked={newStudentData.studentRuralLearner} onChange={handleNewStudentChange} /> Rural</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="studentNYSEnrollment" checked={newStudentData.studentNYSEnrollment} onChange={handleNewStudentChange} /> NYS</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="studentDualApprenticeship" checked={newStudentData.studentDualApprenticeship} onChange={handleNewStudentChange} /> Dual Apprenticeship</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="studentRPLStatus" checked={newStudentData.studentRPLStatus} onChange={handleNewStudentChange} /> RPL</label>
              </div>
              <div className="p-4 bg-gray-50 border-t text-right space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? 'Enrolling...' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;