import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2 } from 'lucide-react';

const Students = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [students, setStudents] = useState([]);
  
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

  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)] p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Students Management</h1>
        <p className="text-[var(--color-text-muted)]">Manage all student records and information</p>
      </div>
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
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Add Student Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Student</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Personal Information */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Personal Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number *</label>
                    <input
                      type="text"
                      name="admissionNumber"
                      value={formData.admissionNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID/Passport/Birth Cert No *</label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      readOnly
                      className="w-full p-2 border rounded-md bg-gray-100"
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>

                {/* Program Information */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Program Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Status *</label>
                    <select
                      name="reportingStatus"
                      value={formData.reportingStatus}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Reported">Reported</option>
                      <option value="Not Reported">Not Reported</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Code *</label>
                    <input
                      type="text"
                      name="programCode"
                      value={formData.programCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Socio-Economic Profile</label>
                    <select
                      name="socioEconomicProfile"
                      value={formData.socioEconomicProfile}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Profile</option>
                      <option value="Low-income">Low-income</option>
                      <option value="Middle-class">Middle-class</option>
                      <option value="Upper-Class">Upper-Class</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                    <input
                      type="date"
                      name="enrollmentDate"
                      value={formData.enrollmentDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Completion Date</label>
                    <input
                      type="date"
                      name="expectedCompletionDate"
                      value={formData.expectedCompletionDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                {/* Status and Additional Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Status & Additional Info</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                    <select
                      name="currentStatus"
                      value={formData.currentStatus}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="enrolled">Enrolled</option>
                      <option value="dropped out">Dropped Out</option>
                      <option value="completed">Completed</option>
                      <option value="attachment">Attachment</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Rate (%)</label>
                    <input
                      type="number"
                      name="attendanceRate"
                      value={formData.attendanceRate}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dropout Risk (%)</label>
                    <input
                      type="number"
                      name="dropoutRisk"
                      value={formData.dropoutRisk}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center">
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
                        id="isEthnicMinority"
                        name="isEthnicMinority"
                        checked={formData.isEthnicMinority}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                      />
                      <label htmlFor="isEthnicMinority" className="ml-2 block text-sm text-gray-700">
                        Ethnic Minority
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
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="nysEnrollment"
                        name="nysEnrollment"
                        checked={formData.nysEnrollment}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                      />
                      <label htmlFor="nysEnrollment" className="ml-2 block text-sm text-gray-700">
                        NYS Enrollment
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="dualApprenticeship"
                        name="dualApprenticeship"
                        checked={formData.dualApprenticeship}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                      />
                      <label htmlFor="dualApprenticeship" className="ml-2 block text-sm text-gray-700">
                        Dual Apprenticeship
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rplStatus"
                        name="rplStatus"
                        checked={formData.rplStatus}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                      />
                      <label htmlFor="rplStatus" className="ml-2 block text-sm text-gray-700">
                        RPL Status
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-dark)]"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adm No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID/Passport</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.admissionNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.idNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.programCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.currentStatus === 'enrolled' ? 'bg-green-100 text-green-800' :
                        student.currentStatus === 'dropped out' ? 'bg-red-100 text-red-800' :
                        student.currentStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.currentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mr-3">
                        <Edit className="w-4 h-4 inline mr-1" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4 inline mr-1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No students found. Click 'Add Student' to get started.
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

export default Students;