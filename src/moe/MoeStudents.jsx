import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Users, ChevronDown, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const MoeStudents = () => {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    programCode: 'all',
    studentReportingStatus: 'all',
    studentGender: 'all',
    studentSocioEconomicStatus: 'all',
    studentDisabilityStatus: 'all',
    studentRuralLearner: 'all',
    studentNYSEnrollment: 'all',
    studentDualApprenticeship: 'all',
    studentRPLStatus: 'all',
    institution: 'all',
    county: 'all',
    completionStatus: 'all'
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const filterRef = useRef(null);

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/student-dtl`, {
        headers: { 'Authorization': `Bearer ${currentUser?.token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const studentData = await response.json();
      setStudents(Array.isArray(studentData) ? studentData : []);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
      console.error('Fetch error:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/institution/get`, {
        headers: { 'Authorization': `Bearer ${currentUser?.token}` },
      });
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        setInstitutions(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch institutions', err);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/program/get`, {
        headers: { 'Authorization': `Bearer ${currentUser?.token}` },
      });
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        setPrograms(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch programs', err);
    }
  };

  const uniquePrograms = useMemo(() => {
    return [...new Set(students.map(item => item.programCode).filter(Boolean))];
  }, [students]);

  const availableCounties = useMemo(() => {
    return [...new Set(institutions.map(inst => inst.institutionCounty).filter(Boolean))].sort();
  }, [institutions]);

  // Create a map of institution registration numbers to names
  const institutionMap = useMemo(() => {
    return institutions.reduce((acc, inst) => {
      acc[inst.institutionRegistrationNumber] = inst.institutionName;
      return acc;
    }, {});
  }, [institutions]);

  const institutionObjectMap = useMemo(() => {
    return institutions.reduce((acc, inst) => {
        acc[inst.institutionRegistrationNumber] = inst;
        return acc;
    }, {});
  }, [institutions]);

  const programMap = useMemo(() => {
    return programs.reduce((acc, prog) => {
      acc[prog.programCode] = prog.programName;
      return acc;
    }, {});
  }, [programs]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || Object.values(filters).some(value => value !== 'all');
  }, [searchTerm, filters]);

  // Apply filters and search
  const filteredStudents = useMemo(() => {
    return Array.isArray(students) 
    ? students.filter(student => {
        const matchesSearch = 
          (student.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.studentAdmissionNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.studentNumber || '').includes(searchTerm);
        
        const studentInstitution = institutionObjectMap[student.institutionRegistrationNumber];

        const matchesFilters = 
          (filters.programCode === 'all' || student.programCode === filters.programCode) &&
          (filters.studentReportingStatus === 'all' || student.studentReportingStatus === filters.studentReportingStatus) &&
          (filters.studentGender === 'all' || (student.studentGender?.toLowerCase() === filters.studentGender.toLowerCase())) &&
          (filters.studentSocioEconomicStatus === 'all' || student.studentSocioEconomicStatus === filters.studentSocioEconomicStatus) &&
          (filters.studentDisabilityStatus === 'all' || String(student.studentDisabilityStatus) === filters.studentDisabilityStatus) &&
          (filters.studentRuralLearner === 'all' || String(student.studentRuralLearner) === filters.studentRuralLearner) &&
          (filters.studentNYSEnrollment === 'all' || String(student.studentNYSEnrollment) === filters.studentNYSEnrollment) &&
          (filters.studentDualApprenticeship === 'all' || String(student.studentDualApprenticeship) === filters.studentDualApprenticeship) &&
          (filters.studentRPLStatus === 'all' || String(student.studentRPLStatus) === filters.studentRPLStatus) &&
          (filters.institution === 'all' || 
            (student.institutionName || institutionMap[student.institutionRegistrationNumber] || '').toLowerCase().includes(filters.institution.toLowerCase())) &&
          (filters.county === 'all' || (student.institutionCounty === filters.county) || (studentInstitution && studentInstitution.institutionCounty === filters.county)) &&
          (filters.completionStatus === 'all' || 
            (filters.completionStatus === 'Active' && student.studentExpectedCompletionDate && new Date(student.studentExpectedCompletionDate) >= new Date()) ||
            (filters.completionStatus === 'Inactive' && student.studentExpectedCompletionDate && new Date(student.studentExpectedCompletionDate) < new Date())
          );
        
        return matchesSearch && matchesFilters;
      })
    : [];
  }, [students, searchTerm, filters, institutionMap, institutionObjectMap]);

  // Calculate summary statistics
  const totalStudents = students.length;
  const maleStudents = students.filter(s => s.studentGender?.toLowerCase() === 'male').length;
  const femaleStudents = students.filter(s => s.studentGender?.toLowerCase() === 'female').length;

  // Calculate average attendance metrics
  const attendanceByProgram = useMemo(() => {
    const groupByKey = 'programCode';
    const groups = students.reduce((acc, student) => {
      const key = student[groupByKey] || 'Unknown';
      if (!acc[key]) {
        acc[key] = { total: 0, count: 0 };
      }
      const attendance = (student.studentAttendanceRate || 0) * 100;
      acc[key].total += attendance;
      acc[key].count += 1;
      return acc;
    }, {});

    return Object.entries(groups).map(([key, { total, count }]) => ({
      name: programMap[key] || key,
      average: count > 0 ? (total / count).toFixed(1) : 0
    })).sort((a, b) => b.average - a.average);
  }, [students, programMap]);

  // Pagination for programs list
  const [programPage, setProgramPage] = useState(1);
  const programsPerPage = 10;
  const currentPrograms = useMemo(() => {
    const start = (programPage - 1) * programsPerPage;
    return attendanceByProgram.slice(start, start + programsPerPage);
  }, [attendanceByProgram, programPage]);
  const totalProgramPages = Math.ceil(attendanceByProgram.length / programsPerPage);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Fetch data on component mount
  useEffect(() => {
    fetchStudents();
    fetchInstitutions();
    fetchPrograms();
  }, []);

  // Handle click outside filter to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      programCode: 'all',
      studentReportingStatus: 'all',
      studentGender: 'all',
      studentSocioEconomicStatus: 'all',
      studentDisabilityStatus: 'all',
      studentRuralLearner: 'all',
      studentNYSEnrollment: 'all',
      studentDualApprenticeship: 'all',
      studentRPLStatus: 'all',
      institution: 'all',
      county: 'all',
      completionStatus: 'all'
    });
    setSearchTerm('');
    setCurrentPage(1);
    fetchStudents(); // Reset to show all students
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
          {/* County Filter */}
          <div className="relative">
            <select
              name="county"
              value={filters.county}
              onChange={handleFilterChange}
              className="w-full pl-4 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Counties</option>
              {availableCounties.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          {/* Institution Filter */}
          <div className="relative">
            <input
              list="institutions-list"
              type="text"
              name="institution"
              placeholder="Filter by Institution..."
              className="w-full pl-4 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleFilterChange({ target: { name: 'institution', value: e.target.value || 'all' } })}
            />
            <datalist id="institutions-list">
              {institutions.map((inst) => (
                <option key={inst.institutionRegistrationNumber} value={inst.institutionName} />
              ))}
            </datalist>
          </div>

          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <Filter className="w-4 h-4 text-gray-500" />
              <span>Filter</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 z-10 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 p-4 max-h-[80vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                    <select
                      name="programCode"
                      value={filters.programCode}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Programs</option>
                      {uniquePrograms.map(programCode => (
                        <option key={programCode} value={programCode}>
                          {programMap[programCode] || programCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active Status</label>
                    <select
                      name="completionStatus"
                      value={filters.completionStatus}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="studentReportingStatus"
                      value={filters.studentReportingStatus}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Statuses</option>
                      <option value="REPORTED">Reported</option>
                      <option value="NOT_REPORTED">Not Reported</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="studentGender"
                      value={filters.studentGender}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Socio-Economic Status</label>
                    <select
                      name="studentSocioEconomicStatus"
                      value={filters.studentSocioEconomicStatus}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="Low Income">Low Income</option>
                      <option value="Middle Income">Middle Income</option>
                      <option value="High Income">High Income</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disability Status</label>
                    <select
                      name="studentDisabilityStatus"
                      value={filters.studentDisabilityStatus}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rural Learner</label>
                    <select
                      name="studentRuralLearner"
                      value={filters.studentRuralLearner}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NYS Enrollment</label>
                    <select
                      name="studentNYSEnrollment"
                      value={filters.studentNYSEnrollment}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dual Apprenticeship</label>
                    <select
                      name="studentDualApprenticeship"
                      value={filters.studentDualApprenticeship}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RPL Status</label>
                    <select
                      name="studentRPLStatus"
                      value={filters.studentRPLStatus}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
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

        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total </p>
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
              <p className="text-sm font-medium text-gray-500">Male </p>
              <p className="mt-1 text-3xl font-semibold text-blue-600">{maleStudents.toLocaleString()}</p>
              <p className="mt-1 text-sm text-gray-500">
                {totalStudents > 0 ? ((maleStudents / totalStudents) * 100).toFixed(1) : 0}%
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
              <p className="text-sm font-medium text-gray-500">Female</p>
              <p className="mt-1 text-3xl font-semibold text-pink-600">{femaleStudents.toLocaleString()}</p>
              <p className="mt-1 text-sm text-gray-500">
                {totalStudents > 0 ? ((femaleStudents / totalStudents) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-3 bg-pink-50 rounded-full">
              <Users className="h-6 w-6 text-pink-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Metrics Section */}
      {!hasActiveFilters && (
      <div className="mb-8 transition-all duration-300 ease-in-out">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Average Attendance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
          {/* Attendance by Program */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-4">By Program</h3>
            <div className="space-y-3 min-h-[200px]">
              {attendanceByProgram.length > 0 ? (
                currentPrograms.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 truncate">{item.name || 'N/A'}</span>
                    <span className="text-sm font-semibold text-blue-600">{item.average}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No attendance data available</p>
              )}
            </div>
            {attendanceByProgram.length > programsPerPage && (
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setProgramPage(prev => Math.max(prev - 1, 1))}
                  disabled={programPage === 1}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500">Page {programPage} of {totalProgramPages}</span>
                <button
                  onClick={() => setProgramPage(prev => Math.min(prev + 1, totalProgramPages))}
                  disabled={programPage === totalProgramPages}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

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
                  Institution
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.length > 0 ? (
                currentStudents.map((student, index) => (
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
                      <div className="text-sm text-gray-900">
                        {student.institutionName || 'N/A'}
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
                      <div className="text-sm text-gray-900">
                        {programMap[student.programCode] || student.programCode || 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No students found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
    </div>
  );
};

export default MoeStudents;
