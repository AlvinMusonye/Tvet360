import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  BookOpen, TrendingUp, Users, AlertTriangle, 
  BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon,
  Table, Check, X, Plus, Star, UserPlus, RefreshCw, FileText, Calendar,
  Monitor, Lightbulb
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock data for the overview section (Stats only, others replaced by real/local data)
const mockOverviewData = {
  stats: [
    { id: 1, name: 'Total Programs', value: '24', icon: BookOpen, change: '+12%', changeType: 'increase' },
    { id: 2, name: 'Active Students', value: '1,234', icon: Users, change: '+5%', changeType: 'increase' },
    { id: 3, name: 'Completion Rate', value: '78%', icon: TrendingUp, change: '+3.2%', changeType: 'increase' },
    { id: 4, name: 'Satisfaction', value: '4.5/5', icon: Star, change: '-0.2', changeType: 'decrease' },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// API base URL
const API_BASE_URL = 'http://localhost:8360';

// API Service Functions
const programService = {
  createProgram: async (programData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/program/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(programData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to create program');
      error.response = data; // Attach response to error for debugging
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error; // Re-throw to be caught by the component
  }
},

  getPrograms: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/program/get`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch programs');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  }
};

const Programs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', program: '' });
  const [programs, setPrograms] = useState([]);
  const [studentCounts, setStudentCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isLoadingProgramStudents, setIsLoadingProgramStudents] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programStudents, setProgramStudents] = useState([]);
  const [formData, setFormData] = useState({
    programCode: '',
    programName: '',
    programLevel: 'Certificate',
    programCurriculum: '2023',
    programAccreditationStatus: 'Accredited',
    programInnovationIndex: 3.5,
    programDigitalLiteracyIncluded: true,
    institutionRegistrationNumber: 'INST-001'
  });
  const [digitalLiteracyStats, setDigitalLiteracyStats] = useState({ programsWithDigitalLiteracy: 0, programsWithoutDigitalLiteracy: 0 });
  const [innovationIndex, setInnovationIndex] = useState(0);
  const [isLoadingDigitalLiteracy, setIsLoadingDigitalLiteracy] = useState(true);
  const [isLoadingInnovation, setIsLoadingInnovation] = useState(true);

  const fetchPrograms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/program/get`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch programs');
      }
      
      setPrograms(result.data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError(error.message || 'Failed to load programs');
      toast.error('Failed to load programs');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const fetchStudentCounts = async () => {
    setIsLoadingStudents(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/program/get-std-ttl-prog`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch student counts');
      }
      
      setStudentCounts(result.data || []);
    } catch (error) {
      console.error('Error fetching student counts:', error);
      toast.error('Failed to load student counts');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchDigitalLiteracyStats = async () => {
    setIsLoadingDigitalLiteracy(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/program/get-prog-dgtl-lt`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch digital literacy stats');
      }
      
      setDigitalLiteracyStats(result.data || { programsWithDigitalLiteracy: 0, programsWithoutDigitalLiteracy: 0 });
    } catch (error) {
      console.error('Error fetching digital literacy stats:', error);
    } finally {
      setIsLoadingDigitalLiteracy(false);
    }
  };

  const fetchInnovationIndex = async () => {
    setIsLoadingInnovation(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/program/get-avg-inn-idx`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch innovation index');
      }
      
      setInnovationIndex(result.data || 0);
    } catch (error) {
      console.error('Error fetching innovation index:', error);
    } finally {
      setIsLoadingInnovation(false);
    }
  };

  const fetchStudentsByProgram = async (programName) => {
    setIsLoadingProgramStudents(true);
    setSelectedProgram(programName);
    try {
      // This is a mock implementation - replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/api/v1/students?program=${encodeURIComponent(programName)}`);
      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message || 'Failed to fetch students');
      // setProgramStudents(result.data || []);
      
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockStudents = [
        {
          id: 1,
          studentName: "John Doe",
          studentAdmissionNumber: `ADM${Math.floor(1000 + Math.random() * 9000)}`,
          studentNumber: `STU${Math.floor(1000 + Math.random() * 9000)}`,
          program: programName,
          studentCurrentStatus: "Active",
          studentGender: ["Male", "Female"][Math.floor(Math.random() * 2)],
          enrollmentDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
        },
        {
          id: 2,
          studentName: `Student ${Math.floor(Math.random() * 1000)}`,
          studentAdmissionNumber: `ADM${Math.floor(1000 + Math.random() * 9000)}`,
          studentNumber: `STU${Math.floor(1000 + Math.random() * 9000)}`,
          program: programName,
          studentCurrentStatus: ["Active", "Inactive", "Graduated", "Suspended"][Math.floor(Math.random() * 4)],
          studentGender: ["Male", "Female"][Math.floor(Math.random() * 2)],
          enrollmentDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
        }
      ];
      setProgramStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching students by program:', error);
      toast.error('Failed to load students');
      setProgramStudents([]);
    } finally {
      setIsLoadingProgramStudents(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchStudentCounts();
    fetchDigitalLiteracyStats();
    fetchInnovationIndex();
    
    // Load events and activities from local storage
    const storedEvents = JSON.parse(localStorage.getItem('programEvents') || '[]');
    setEvents(storedEvents);

    const storedActivities = JSON.parse(localStorage.getItem('programActivities') || '[]');
    setActivities(storedActivities);
  }, []);

  const logActivity = (action, programName) => {
    const newActivity = {
      id: Date.now(),
      program: programName,
      action: action,
      time: new Date().toISOString(),
    };
    const updatedActivities = [newActivity, ...activities].slice(0, 10); // Keep last 10
    setActivities(updatedActivities);
    localStorage.setItem('programActivities', JSON.stringify(updatedActivities));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    
    const event = {
      id: Date.now(),
      ...newEvent
    };
    
    const updatedEvents = [...events, event].sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(updatedEvents);
    localStorage.setItem('programEvents', JSON.stringify(updatedEvents));
    
    logActivity('Event Scheduled', newEvent.title);
    
    setShowAddEventModal(false);
    setNewEvent({ title: '', date: '', program: '' });
    toast.success('Event added successfully');
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Prepare the data in the exact format expected by the API
    const programData = {
      programCode: formData.programCode.trim(),
      programName: formData.programName.trim(),
      programLevel: formData.programLevel,
      programCurriculum: formData.programCurriculum.trim(),
      programAccreditationStatus: formData.programAccreditationStatus,
      programInnovationIndex: parseFloat(formData.programInnovationIndex),
      programDigitalLiteracyIncluded: formData.programDigitalLiteracyIncluded,
      institutionRegistrationNumber: formData.institutionRegistrationNumber
    };

    console.log('Submitting program data:', programData); // Debug log

    const response = await programService.createProgram(programData);
    console.log('API Response:', response); // Debug log

    logActivity('New Program Created', programData.programName);
    toast.success('Program created successfully!');
    setShowAddProgramModal(false);
    fetchPrograms();
    
    // Reset form
    setFormData({
      programCode: '',
      programName: '',
      programLevel: 'Certificate',
      programCurriculum: '2023',
      programAccreditationStatus: 'Accredited',
      programInnovationIndex: 3.5,
      programDigitalLiteracyIncluded: true,
      institutionRegistrationNumber: 'INST-001'
    });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      stack: error.stack
    });
    toast.error(`Failed to create program: ${error.message || 'Unknown error'}`);
  }
};

  // Render students list for a selected program
  const renderProgramStudents = () => (
    <div className="mt-4">
      <button 
        onClick={() => setSelectedProgram(null)}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to programs
      </button>
      
      <h3 className="text-lg font-medium text-gray-900 mb-4">Students in {selectedProgram}</h3>
      
      {isLoadingProgramStudents ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading students...</p>
        </div>
      ) : programStudents.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {programStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.studentAdmissionNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.studentNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.studentCurrentStatus === 'Active' ? 'bg-green-100 text-green-800' :
                      student.studentCurrentStatus === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                      student.studentCurrentStatus === 'Graduated' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.studentCurrentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No students found for this program</div>
      )}
    </div>
  );

  // Render student counts by program
  const renderStudentCounts = () => (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Students by Program</h3>
      {isLoadingStudents ? (
        <div className="text-center py-4">Loading student counts...</div>
      ) : studentCounts.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentCounts.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.programCode || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.totalStudentsEnrolled || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">No student data available</div>
      )}
    </div>
  );

  const renderTabContent = () => {
    if (selectedProgram) {
      return renderProgramStudents();
    }
    
    if (activeTab === 'overview') {
      const stats = [
        { 
          ...mockOverviewData.stats[0],
          value: isLoading ? '...' : programs.length.toString()
        },
        {
          ...mockOverviewData.stats[1],
          value: isLoadingStudents ? '...' : studentCounts.reduce((sum, item) => sum + (parseInt(item.totalStudentsEnrolled) || 0), 0).toLocaleString()
        },
        {
          id: 3,
          name: 'Digital Literacy',
          value: isLoadingDigitalLiteracy ? '...' : `${digitalLiteracyStats.programsWithDigitalLiteracy} Included`,
          icon: Monitor,
          change: `${digitalLiteracyStats.programsWithoutDigitalLiteracy} Not Included`,
          changeType: 'increase'
        },
        {
          id: 4,
          name: 'Avg Innovation Index',
          value: isLoadingInnovation ? '...' : (typeof innovationIndex === 'number' ? innovationIndex.toFixed(1) : innovationIndex),
          icon: Lightbulb,
          change: 'Index Score',
          changeType: 'increase'
        }
      ];

      if (error) {
        return (
          <div className="p-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Prepare Pie Chart Data from API response
      const pieChartData = studentCounts.map(item => ({
        name: item.programCode,
        value: item.totalStudentsEnrolled
      })).filter(item => item.value > 0);

      return (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Students by Program */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Students by Program</h3>
              </div>
              <div className="space-y-6">
                {isLoadingStudents ? (
                  <div className="text-center py-4">Loading...</div>
                ) : studentCounts.length > 0 ? (
                  studentCounts.map((program, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                        <h4 className="font-medium text-gray-900">
                          {programs.find(p => p.programCode === program.programCode)?.programName || program.programCode}
                        </h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {program.totalStudentsEnrolled} Enrolled
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No enrollment data available</div>
                )}
              </div>
            </div>

            {/* Program Distribution */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Program Distribution</h3>
              {pieChartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No distribution data available
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity and Upcoming Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{activity.program}</p>
                        <p className="text-sm text-gray-500">{activity.action}</p>
                        <p className="text-xs text-gray-400">{formatTimeAgo(activity.time)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No recent activity</p>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
                <button 
                  onClick={() => setShowAddEventModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Event
                </button>
              </div>
              <div className="space-y-4">
                {events.length > 0 ? (
                  events.map((event) => (
                  <div key={event.id} className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.program || 'General'}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No upcoming events scheduled</p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'programs') {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Programs</h2>
              <button
                onClick={() => setShowAddProgramModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Program
              </button>
            </div>
            
            {renderStudentCounts()}
            
            {loading ? (
              <div className="text-center py-8">Loading programs...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curriculum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Digital Literacy</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {programs.map((program) => (
                      <tr key={program.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {program.programCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.programName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.programLevel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.programCurriculum}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${program.programAccreditationStatus === 'Accredited' 
                              ? 'bg-green-100 text-green-800' 
                              : program.programAccreditationStatus === 'Provisional'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {program.programAccreditationStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.programDigitalLiteracyIncluded ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" /> Included
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="h-3 w-3 mr-1" /> Not Included
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6">
      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div 
            className="fixed inset-0  bg-opacity-50 transition-opacity" 
            onClick={() => setShowAddEventModal(false)}
          ></div>
          <div className="bg-white rounded-lg w-full max-w-md relative z-10 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Upcoming Event</h3>
              <button onClick={() => setShowAddEventModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Related Program (Optional)</label>
                <input
                  type="text"
                  value={newEvent.program}
                  onChange={(e) => setNewEvent({...newEvent, program: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {showAddProgramModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div 
            className="fixed inset-0  bg-opacity-75 transition-opacity" 
            onClick={() => setShowAddProgramModal(false)}
            aria-hidden="true"
          ></div>
          
          <div className="bg-white rounded-lg w-full max-w-md relative z-10">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Program</h3>
                <button
                  onClick={() => setShowAddProgramModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Program Code</label>
                    <input
                      type="text"
                      name="programCode"
                      value={formData.programCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Program Name</label>
                    <input
                      type="text"
                      name="programName"
                      value={formData.programName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <select
                      name="programLevel"
                      value={formData.programLevel}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="Certificate">Certificate</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Degree">Degree</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Curriculum Year</label>
                    <input
                      type="text"
                      name="programCurriculum"
                      value={formData.programCurriculum}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Accreditation Status</label>
                    <select
                      name="programAccreditationStatus"
                      value={formData.programAccreditationStatus}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="Accredited">Accredited</option>
                      <option value="Provisional">Provisional</option>
                      <option value="Not Accredited">Not Accredited</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Innovation Index</label>
                    <input
                      type="number"
                      name="programInnovationIndex"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.programInnovationIndex}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex items-center sm:col-span-2">
                    <input
                      type="checkbox"
                      id="digitalLiteracy"
                      name="programDigitalLiteracyIncluded"
                      checked={formData.programDigitalLiteracyIncluded}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="digitalLiteracy" className="ml-2 block text-sm text-gray-700">
                      Includes Digital Literacy
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProgramModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Program
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Programs Management</h1>
        <p className="text-gray-600">View and manage all training programs</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`${activeTab === 'programs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Programs
          </button>
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default Programs;