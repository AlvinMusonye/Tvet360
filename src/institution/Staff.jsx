import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, Award, Clock, UserCheck, UserPlus, Plus, Eye, Edit, Trash2 } from 'lucide-react';

// Sample data - replace with actual data from your API
const qualificationData = [
  { name: 'PhD', value: 25 },
  { name: 'Masters', value: 35 },
  { name: 'Bachelors', value: 30 },
  { name: 'Diploma', value: 10 },
];

const specializationData = [
  { name: 'Engineering', value: 40 },
  { name: 'ICT', value: 30 },
  { name: 'Business', value: 20 },
  { name: 'Other', value: 10 },
];

const employmentData = [
  { name: 'Permanent', value: 60 },
  { name: 'Contract', value: 25 },
  { name: 'Part-time', value: 15 },
];

const workloadData = [
  { name: 'Mon', hours: 8 },
  { name: 'Tue', hours: 7 },
  { name: 'Wed', hours: 6 },
  { name: 'Thu', hours: 7 },
  { name: 'Fri', hours: 6 },
];

const COLORS = ['#1F3C88', '#2EAD4F', '#F7931E', '#00A8B5', '#F9C74F'];

const StaffDashboard = () => {
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [newStaff, setNewStaff] = useState({
    pfNumber: '',
    qualification: 'Diploma',
    specialization: '',
    workload: '',
    evaluationScore: '',
    professionalDevelopment: false,
    employmentTerms: 'PSC',
    hireDate: '',
    terminationDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStaff(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    setStaffList([...staffList, { ...newStaff, id: Date.now() }]);
    setNewStaff({
      pfNumber: '',
      qualification: 'Diploma',
      specialization: '',
      workload: '',
      evaluationScore: '',
      professionalDevelopment: false,
      employmentTerms: 'PSC',
      hireDate: '',
      terminationDate: ''
    });
    setIsAddStaffModalOpen(false);
  };

  const handleViewStaff = (staff) => {
    setViewingStaff(staff);
    setIsViewModalOpen(true);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-1 mb-2">Staff & Trainer Management</h1>
          <p className="text-[var(--color-text-muted)]">Monitor workforce capacity and development for hiring and training strategies</p>
        </div>
        <button
          onClick={() => setIsAddStaffModalOpen(true)}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-medium overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PF Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workload (hrs/week)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.pfNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.qualification}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.specialization}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.workload}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.evaluationScore}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewStaff(staff)}
                      className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mr-3"
                      title="View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900 mr-3" title="Edit">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No staff members found. Click "Add New Staff" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add New Staff Member</h2>
                <button 
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PF Number *</label>
                    <input
                      type="text"
                      name="pfNumber"
                      value={newStaff.pfNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
                    <select
                      name="qualification"
                      value={newStaff.qualification}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                      required
                    >
                      <option value="Diploma">Diploma</option>
                      <option value="Degree">Degree</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                    <input
                      type="text"
                      name="specialization"
                      value={newStaff.specialization}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workload (hrs/week) *</label>
                    <input
                      type="number"
                      name="workload"
                      value={newStaff.workload}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Score</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      name="evaluationScore"
                      value={newStaff.evaluationScore}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="professionalDevelopment"
                      name="professionalDevelopment"
                      checked={newStaff.professionalDevelopment}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                    />
                    <label htmlFor="professionalDevelopment" className="ml-2 block text-sm text-gray-700">
                      Professional Development Uptake
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Terms *</label>
                    <select
                      name="employmentTerms"
                      value={newStaff.employmentTerms}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                      required
                    >
                      <option value="PSC">PSC</option>
                      <option value="BOM">BOM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date *</label>
                    <input
                      type="date"
                      name="hireDate"
                      value={newStaff.hireDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Termination Date</label>
                    <input
                      type="date"
                      name="terminationDate"
                      value={newStaff.terminationDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddStaffModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                  >
                    Add Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Staff Modal */}
      {isViewModalOpen && viewingStaff && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Staff Details</h2>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">PF Number</p>
                    <p className="mt-1 text-sm text-gray-900">{viewingStaff.pfNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Qualification</p>
                    <p className="mt-1 text-sm text-gray-900">{viewingStaff.qualification}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Specialization</p>
                    <p className="mt-1 text-sm text-gray-900">{viewingStaff.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Workload (hrs/week)</p>
                    <p className="mt-1 text-sm text-gray-900">{viewingStaff.workload}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Evaluation Score</p>
                    <p className="mt-1 text-sm text-gray-900">{viewingStaff.evaluationScore || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Professional Development</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {viewingStaff.professionalDevelopment ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employment Terms</p>
                    <p className="mt-1 text-sm text-gray-900">{viewingStaff.employmentTerms}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hire Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(viewingStaff.hireDate).toLocaleDateString()}
                    </p>
                  </div>
                  {viewingStaff.terminationDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Termination Date</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(viewingStaff.terminationDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="heading-3 mb-4">Weekly Workload (hrs)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#1F3C88" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-medium">
          <div className="flex justify-between items-center mb-4">
            <h3 className="heading-3">Professional Development</h3>
            <button className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-bg-muted)] px-3 py-1.5 rounded-lg">
              <UserPlus className="w-4 h-4" />
              Enroll Staff
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Digital Skills Training</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[var(--color-primary)] h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pedagogy Workshop</span>
                <span className="font-medium">52%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[var(--color-secondary)] h-2 rounded-full" style={{ width: '52%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Industry Certification</span>
                <span className="font-medium">38%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[var(--color-accent)] h-2 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;