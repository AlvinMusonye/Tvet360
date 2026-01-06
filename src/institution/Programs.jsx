import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  BookOpen, TrendingUp, Users, AlertTriangle, 
  BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon,
  Table, Check, X
} from 'lucide-react';
import { useState } from 'react';

// Sample data - replace with actual data from your API
const programPerformanceData = [
  { 
    programCode: 'ICT-101', 
    name: 'Information Communication Technology', 
    level: 'Diploma', 
    curriculum: '2023 Curriculum', 
    accreditationStatus: 'Accredited',
    innovationIndex: 4.2, 
    digitalLiteracy: true, 
    enrollment: 320, 
    risk: 'Low' 
  },
  { 
    programCode: 'ENG-205', 
    name: 'Mechanical Engineering', 
    level: 'Certificate', 
    curriculum: '2022 Curriculum', 
    accreditationStatus: 'Accredited',
    innovationIndex: 3.8, 
    digitalLiteracy: true, 
    enrollment: 280, 
    risk: 'Medium' 
  },
  { 
    programCode: 'BUS-110', 
    name: 'Business Administration', 
    level: 'Diploma', 
    curriculum: '2023 Curriculum', 
    accreditationStatus: 'Accredited',
    innovationIndex: 3.5, 
    digitalLiteracy: true, 
    enrollment: 250, 
    risk: 'Low' 
  },
  { 
    programCode: 'HOS-301', 
    name: 'Hospitality Management', 
    level: 'Certificate', 
    curriculum: '2021 Curriculum', 
    accreditationStatus: 'Not Accredited',
    innovationIndex: 3.9, 
    digitalLiteracy: false, 
    enrollment: 190, 
    risk: 'High' 
  },
  { 
    programCode: 'AGR-150', 
    name: 'Sustainable Agriculture', 
    level: 'Certificate', 
    curriculum: '2022 Curriculum', 
    accreditationStatus: 'Accredited',
    innovationIndex: 3.2, 
    digitalLiteracy: false, 
    enrollment: 150, 
    risk: 'Medium' 
  },
];

const auditOpinionData = [
  { name: 'Qualified', value: 65 },
  { name: 'Unqualified', value: 20 },
  { name: 'Disclaimer', value: 10 },
  { name: 'Adverse', value: 5 },
];

const passRateData = [
  { month: 'Jan', 'Module 1': 78, 'Module 2': 65, 'Module 3': 82 },
  { month: 'Feb', 'Module 1': 82, 'Module 2': 70, 'Module 3': 85 },
  { month: 'Mar', 'Module 1': 85, 'Module 2': 75, 'Module 3': 88 },
  { month: 'Apr', 'Module 1': 88, 'Module 2': 78, 'Module 3': 90 },
  { month: 'May', 'Module 1': 90, 'Module 2': 82, 'Module 3': 92 },
];

const demandForecastData = [
  { year: '2024', forecast: 1200, actual: 1150 },
  { year: '2025', forecast: 1350, actual: null },
  { year: '2026', forecast: 1480, actual: null },
  { year: '2027', forecast: 1620, actual: null },
  { year: '2028', forecast: 1750, actual: null },
];

const COLORS = ['#1F3C88', '#2EAD4F', '#F7931E', '#00A8B5', '#F9C74F'];

const Programs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'programs':
        return renderProgramsTable();
      default:
        return renderOverview();
    }
  };
  
  const renderOverview = () => {
    // Sort programs by enrollment and take top 10
    const topPrograms = [...programPerformanceData]
      .sort((a, b) => b.enrollment - a.enrollment)
      .slice(0, 10);

    return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Total Programs</p>
              <p className="text-3xl font-bold">24</p>
            </div>
            <div className="p-3 rounded-full bg-[var(--color-primary-light)] bg-opacity-10">
              <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Avg. Innovation Index</p>
              <p className="text-3xl font-bold">3.9/5.0</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Digital Literacy</p>
              <p className="text-3xl font-bold text-[var(--color-tech)]">4.1/5.0</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <BarChart2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Risk Flags</p>
              <p className="text-3xl font-bold text-red-600">3</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Program Popularity */}
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="heading-3 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Programs by Enrollment
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topPrograms}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="enrollment" fill="#1F3C88" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit Opinion */}
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="heading-3 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Financial Audit Opinion
          </h3>
          <div className="h-80 flex flex-col items-center justify-center">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={auditOpinionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {auditOpinionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Pass Rates */}
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="heading-3 mb-4 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5" />
            Module Pass Rates (%)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={passRateData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Module 1" stroke="#1F3C88" strokeWidth={2} />
                <Line type="monotone" dataKey="Module 2" stroke="#2EAD4F" strokeWidth={2} />
                <Line type="monotone" dataKey="Module 3" stroke="#F7931E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 gap-6">
        {/* Demand Forecast */}
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="heading-3 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            5-Year Program Demand Forecast
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={demandForecastData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  name="Forecasted Students" 
                  stroke="#1F3C88" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual Students" 
                  stroke="#2EAD4F" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk Flags Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-medium">
        <h3 className="heading-3 mb-4 flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Risk Flags
        </h3>
        <div className="space-y-4">
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Hospitality Program</h4>
                <p className="text-sm text-gray-600">High risk due to declining enrollment and low pass rates</p>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">High Priority</span>
            </div>
          </div>
          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Agriculture Program</h4>
                <p className="text-sm text-gray-600">Medium risk: Equipment maintenance overdue</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Monitor</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  };

  const renderProgramsTable = () => (
    <div className="bg-white rounded-lg shadow-medium overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="heading-3 flex items-center">
          <Table className="w-5 h-5 mr-2" />
          Programs List
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program Code
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curriculum
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accreditation
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Innovation Index
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Digital Literacy
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {programPerformanceData.map((program, index) => (
              <tr key={program.programCode} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {program.programCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {program.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {program.level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {program.curriculum}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    program.accreditationStatus === 'Accredited' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {program.accreditationStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-[var(--color-primary)] h-2.5 rounded-full" 
                        style={{ width: `${program.innovationIndex * 20}%` }}
                      ></div>
                    </div>
                    <span>{program.innovationIndex.toFixed(1)}/5.0</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {program.digitalLiteracy ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">{programPerformanceData.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-[var(--color-primary)] bg-blue-50">
                1
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </a>
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'programs' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('programs')}
        >
          All Programs
        </button>
      </div>
      
      {renderTabContent()}
    </div>
  );
};

export default Programs;
