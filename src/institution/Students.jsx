import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Download, Edit, Trash2, 
  Users, BarChart2, GraduationCap, AlertCircle, BookOpen, User, MapPin
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  FunnelChart, Funnel, LabelList
} from 'recharts';

// Sample data for analytics - replace with your actual data
const enrollmentByGender = [
  { name: 'Male', value: 320, fill: '#1F3C88' },
  { name: 'Female', value: 280, fill: '#F9C74F' },
  { name: 'Other', value: 50, fill: '#2EAD4F' }
];

const enrollmentByAge = [
  { name: '15-19', value: 150 },
  { name: '20-24', value: 280 },
  { name: '25-29', value: 120 },
  { name: '30+', value: 100 }
];

const completionRates = [
  { name: 'Enrolled', value: 650, fill: '#1F3C88' },
  { name: 'Completed', value: 520, fill: '#2EAD4F' },
  { name: 'Dropped Out', value: 120, fill: '#F94144' }
];

const COLORS = ['#1F3C88', '#2EAD4F', '#F7931E', '#00A8B5', '#F9C74F', '#F94144', '#577590'];

const Students = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'analytics'
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    program: 'all',
    status: 'all',
    gender: 'all'
  });

  // Form state
  const [formData, setFormData] = useState({
    admissionNumber: '',
    idNumber: '',
    studentName: '',
    reportingStatus: '',
    programCode: '',
    gender: '',
    dob: '',
    age: '',
    socioEconomicProfile: '',
    hasDisability: false,
    isEthnicMinority: false,
    isRuralLearner: false,
    enrollmentDate: '',
    expectedCompletionDate: '',
    currentStatus: 'enrolled',
    attendanceRate: 0,
    dropoutRisk: 0,
    nysEnrollment: false,
    dualApprenticeship: false,
    rplStatus: false
  });

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) {
      setFormData(prev => ({ ...prev, age: '' }));
      return;
    }
    
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    
    setFormData(prev => ({ ...prev, age: calculatedAge.toString() }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'dob') {
      setFormData(prev => ({ ...prev, [name]: value }));
      calculateAge(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStudents([...students, { ...formData, id: Date.now() }]);
    setShowAddForm(false);
    // Reset form
    setFormData({
      admissionNumber: '',
      idNumber: '',
      studentName: '',
      reportingStatus: '',
      programCode: '',
      gender: '',
      dob: '',
      age: '',
      socioEconomicProfile: '',
      hasDisability: false,
      isEthnicMinority: false,
      isRuralLearner: false,
      enrollmentDate: '',
      expectedCompletionDate: '',
      currentStatus: 'enrolled',
      attendanceRate: 0,
      dropoutRisk: 0,
      nysEnrollment: false,
      dualApprenticeship: false,
      rplStatus: false
    });
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.idNumber?.includes(searchTerm);
    
    const matchesFilters = 
      (filters.program === 'all' || student.programCode === filters.program) &&
      (filters.status === 'all' || student.currentStatus === filters.status) &&
      (filters.gender === 'all' || student.gender === filters.gender);
    
    return matchesSearch && matchesFilters;
  });

  // Stat Card Component
  const StatCard = ({ icon, title, value, change, trend, warning = false }) => (
    <div className={`bg-white p-4 rounded-lg shadow ${warning ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change} {trend === 'up' ? '↑' : '↓'} from last period
            </p>
          )}
        </div>
        <div className={`p-2 rounded-full ${warning ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  // Chart Card Component
  const ChartCard = ({ title, description, children, className = '' }) => (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)] p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          {activeTab === 'list' ? 'Students Management' : 'Student Analytics'}
        </h1>
        <p className="text-[var(--color-text-muted)]">
          {activeTab === 'list' 
            ? 'Manage all student records and information' 
            : 'Track student demographics, risks, and outcomes'}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`${
              activeTab === 'list'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Student List
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`${
              activeTab === 'analytics'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Analytics Dashboard
          </button>
        </nav>
      </div>

      {activeTab === 'list' ? (
        <>
          {/* Student List View */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Students</h1>
              <p className="text-gray-600">Total Students: {students.length}</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students by name, admission or ID number..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={filters.program}
                  onChange={(e) => setFilters({...filters, program: e.target.value})}
                  className="p-2 border rounded-lg text-sm"
                >
                  <option value="all">All Programs</option>
                  <option value="ICT">ICT</option>
                  <option value="ENG">Engineering</option>
                  <option value="BUS">Business</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="p-2 border rounded-lg text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters({...filters, gender: e.target.value})}
                  className="p-2 border rounded-lg text-sm"
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                              <div className="text-sm text-gray-500">{student.idNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.admissionNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.programCode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.currentStatus === 'enrolled' 
                              ? 'bg-green-100 text-green-800' 
                              : student.currentStatus === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.currentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.phoneNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-4">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-lg font-medium">No students found</p>
                          <p className="text-sm mt-1">Try adjusting your search or add a new student</p>
                          <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Student
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Analytics Dashboard */
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={<Users className="w-6 h-6" />} 
              title="Total Students" 
              value={students.length.toString()} 
              change="+12%"
              trend="up"
            />
            <StatCard 
              icon={<GraduationCap className="w-6 h-6" />} 
              title="Completion Rate" 
              value="78.5%" 
              change="+5%"
              trend="up"
            />
            <StatCard 
              icon={<AlertCircle className="w-6 h-6" />} 
              title="At Risk" 
              value="24" 
              change="+3%"
              trend="up"
              warning
            />
            <StatCard 
              icon={<BookOpen className="w-6 h-6" />} 
              title="Programs" 
              value="12" 
              change="+2"
              trend="up"
            />
          </div>

          {/* Enrollment Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard 
              title="Enrollment by Gender" 
              description="Distribution of students by gender"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={enrollmentByGender}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {enrollmentByGender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard 
              title="Enrollment by Age Group" 
              description="Distribution of students by age groups"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentByAge}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1F3C88" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Completion Rates */}
          <ChartCard 
            title="Student Progression" 
            description="From enrollment to completion"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="value"
                    data={completionRates}
                    isAnimationActive
                  >
                    {completionRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList 
                      position="right" 
                      fill="#000" 
                      stroke="none" 
                      dataKey="value" 
                      formatter={(value) => `${value} students`} 
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {/* Add/Edit Student Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-xl font-medium text-gray-900">Add New Student</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div className="space-y-2">
                  <h4 className="text-lg font-medium">Personal Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID/Passport/Birth Cert No *</label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>
                
                {/* Academic Information */}
                <div className="space-y-2">
                  <h4 className="text-lg font-medium">Academic Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admission Number *</label>
                    <input
                      type="text"
                      name="admissionNumber"
                      value={formData.admissionNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Program Code *</label>
                    <input
                      type="text"
                      name="programCode"
                      value={formData.programCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Enrollment Date</label>
                    <input
                      type="date"
                      name="enrollmentDate"
                      value={formData.enrollmentDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Status</label>
                    <select
                      name="currentStatus"
                      value={formData.currentStatus}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                    >
                      <option value="enrolled">Enrolled</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="graduated">Graduated</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-4">
                    <input
                      type="checkbox"
                      id="hasDisability"
                      name="hasDisability"
                      checked={formData.hasDisability}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                    />
                    <label htmlFor="hasDisability" className="ml-2 block text-sm text-gray-700">
                      Has Disability
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isRuralLearner"
                      name="isRuralLearner"
                      checked={formData.isRuralLearner}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                    />
                    <label htmlFor="isRuralLearner" className="ml-2 block text-sm text-gray-700">
                      Rural Learner
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                >
                  Save Student
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