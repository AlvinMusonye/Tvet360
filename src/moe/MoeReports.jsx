// src/moe/MoeReports.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  BookOpen, Users, TrendingUp, FileText, Printer, Download,
  Shield, Briefcase, Handshake, BarChart2, AlertTriangle, CheckCircle, School, UserCheck, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

// Mock data - replace with API calls
const institutionData = [
  { id: 1, name: 'Nairobi Technical Institute', type: 'National', students: 4500, region: 'Nairobi' },
  { id: 2, name: 'Mombasa Polytechnic', type: 'County', students: 3200, region: 'Coast' },
  { id: 3, name: 'Kisumu Technical Institute', type: 'County', students: 2800, region: 'Nyanza' },
  { id: 4, name: 'Nakuru College of Technology', type: 'National', students: 3800, region: 'Rift Valley' },
  { id: 5, name: 'Eldoret Technical Training Institute', type: 'National', students: 4100, region: 'Rift Valley' },
];

const enrollmentData = [
  { program: 'ICT', enrollment: 12500, capacity: 15000, yoyChange: 12 },
  { program: 'Engineering', enrollment: 9800, capacity: 12000, yoyChange: 5 },
  { program: 'Business', enrollment: 8500, capacity: 10000, yoyChange: 8 },
  { program: 'Hospitality', enrollment: 6500, capacity: 8000, yoyChange: 6 },
  { program: 'Health Sciences', enrollment: 7200, capacity: 9000, yoyChange: 9 },
];

const MoeReports = () => {
  const { currentUser } = useAuth();
  const reportRef = useRef();
  const tableRef = useRef();
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [programEnrollmentData, setProgramEnrollmentData] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewingReport, setViewingReport] = useState(null);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [averageEnrollment, setAverageEnrollment] = useState(0);

  const enrollmentTrends = {
    yearlyComparison: [
      { year: '2022', students: 42000 },
      { year: '2023', students: 45500 },
      { year: '2024', students: 48000 },
    ],
    monthlyTrend: [
      { name: 'Jan', current: 4000, last: 3800 },
      { name: 'Feb', current: 1200, last: 1100 },
      { name: 'Mar', current: 1100, last: 1050 },
      { name: 'Apr', current: 1300, last: 1200 },
      { name: 'May', current: 8500, last: 8000 },
      { name: 'Jun', current: 1400, last: 1300 },
      { name: 'Jul', current: 1200, last: 1150 },
      { name: 'Aug', current: 1100, last: 1000 },
      { name: 'Sep', current: 9200, last: 8900 },
      { name: 'Oct', current: 1500, last: 1400 },
      { name: 'Nov', current: 1300, last: 1250 },
      { name: 'Dec', current: 800, last: 750 },
    ]
  };

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    pageStyle: `
      @page { 
        size: A4 landscape;
        margin: 1cm;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact; 
        }
        .no-print { 
          display: none !important; 
        }
        .print-table {
          width: 100%;
          border-collapse: collapse;
        }
        .print-table th, .print-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .print-table th {
          background-color: #f2f2f2;
        }
      }
    `
  });

  useEffect(() => {
    const fetchTotalInstitutions = async () => {
      if (!currentUser?.token) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/institution/total`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.status === 200) {
          setTotalInstitutions(data.data.value);
        }
      } catch (error) {
        console.error('Error fetching total institutions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalInstitutions();
  }, [currentUser]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      if (!currentUser?.token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/institution/get`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        if (result.data) {
          setInstitutions(result.data);
          if (result.data.length > 0) {
            setSelectedInstitution(result.data[0].institutionRegistrationNumber);
          }
        }
      } catch (error) {
        console.error('Error fetching institutions:', error);
      }
    };
    fetchInstitutions();
  }, [currentUser]);

  useEffect(() => {
    const fetchEnrollmentStats = async () => {
      if (!currentUser?.token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/student-total-by-inst`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        const data = Array.isArray(result) ? result : (result.data || []);
        
        const total = data.reduce((sum, item) => {
          const count = typeof item === 'number' ? item : (item.count || item.totalStudents || item.total || item.enrollment || 0);
          return sum + count;
        }, 0);
        
        setTotalEnrollments(total);
        setAverageEnrollment(data.length > 0 ? Math.round(total / data.length) : 0);
      } catch (error) {
        console.error('Error fetching enrollment stats:', error);
      }
    };
    fetchEnrollmentStats();
  }, [currentUser]);

  useEffect(() => {
    const fetchProgramData = async () => {
      if (!selectedInstitution || !currentUser?.token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/program/get-std-ttl-prog-inst?institutionRegistrationNumber=${selectedInstitution}`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        if (result.data) {
          const formattedData = result.data.map(item => ({
            program: item.programCode,
            enrollment: item.totalStudentsEnrolled,
            capacity: 0 // API doesn't provide capacity
          }));
          setProgramEnrollmentData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching program enrollment:', error);
        setProgramEnrollmentData([]);
      }
    };
    fetchProgramData();
  }, [selectedInstitution, currentUser]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!currentUser?.token) return;
      setLoadingStudents(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/student/get`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        const data = Array.isArray(result) ? result : (Array.isArray(result?.data) ? result.data : []);
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [currentUser]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  // Handle export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student Reports');
    XLSX.writeFile(wb, 'student_reports.xlsx');
  };

  const renderReportModal = () => {
    if (viewingReport !== 'enrollment-comparison') return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" /> Enrollment Comparison Report
            </h2>
            <button onClick={() => setViewingReport(null)} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Yearly Growth</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrollmentTrends.yearlyComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="students" fill="#3b82f6" name="Total Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Monthly Intake Trends (Current vs Last Year)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={enrollmentTrends.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="current" stroke="#3b82f6" name="Current Year" strokeWidth={2} />
                      <Line type="monotone" dataKey="last" stroke="#9ca3af" name="Last Year" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Analysis Summary</h3>
              <p className="text-blue-700 text-sm">
                Enrollment has shown a consistent upward trend over the last 3 years. 
                Major intakes in May and September continue to drive the majority of new student registrations. 
                Current year performance is tracking approximately 5-8% higher than the previous year across most months.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8" ref={reportRef}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6" /> MOE Reports Dashboard
            </h1>
            <p className="text-gray-600">
              National oversight, policy formulation, and strategic decision-making
            </p>
          </div>
       
       
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard 
          icon={<School className="w-6 h-6" />} 
          title="Total Institutions" 
          value={loading ? "..." : totalInstitutions.toLocaleString()}
          change="+5% YoY"
        />
        <ReportCard 
          icon={<Users className="w-6 h-6" />} 
          title="Total Enrollments" 
          value={students.length.toLocaleString()}
          change="+8% YoY"
        />
        <ReportCard 
          icon={<UserCheck className="w-6 h-6" />} 
          title="Average Enrollment per Institution" 
          value="3,000"
          change="+3% YoY"
        />
      </div>

      {/* Enrollment by Program */}
      <ReportSection 
        icon={<BookOpen className="w-5 h-5" />} 
        title="Enrollment by Program"
        description="Current enrollment numbers across different programs"
      >
        <div className="mb-4">
          <label htmlFor="institution-select" className="block text-sm font-medium text-gray-700 mb-1">Select Institution</label>
          <select
            id="institution-select"
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="mt-1 block w-full md:w-1/2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
          >
            {institutions.length === 0 && <option>Loading institutions...</option>}
            {institutions.map((inst) => (
              <option key={inst.institutionRegistrationNumber} value={inst.institutionRegistrationNumber}>
                {inst.institutionName}
              </option>
            ))}
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={programEnrollmentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="program" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="enrollment" fill="#3b82f6" name="Current Enrollment" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ReportSection>

      {/* Student Reports */}
      <StudentReportsSection 
        tableRef={tableRef}
        handlePrint={handlePrint}
        exportToExcel={exportToExcel}
        students={currentStudents}
        loading={loadingStudents}
        pagination={{
          currentPage,
          totalPages,
          totalItems: students.length,
          setCurrentPage,
          indexOfFirstItem,
          indexOfLastItem
        }}
      />

      {/* Reports List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" /> Available Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReportItem 
            icon={<FileText />}
            title="MOE Executive Summary"
            description="National TVET performance snapshot and recommendations"
          />
          <ReportItem 
            icon={<BookOpen />}
            title="National Enrollment Report"
            description="Comprehensive enrollment analysis by program and region"
          />
          <ReportItem 
            icon={<Users />}
            title="Equity & Compliance"
            description="Diversity, inclusion, and compliance metrics"
          />
          <ReportItem 
            icon={<Briefcase />}
            title="Employment Outcomes"
            description="Graduate employment and skills analysis"
          />
          <ReportItem 
            icon={<TrendingUp />}
            title="Enrollment Comparison"
            description="Compare enrollments: Last Year vs Current Year & Monthly Trends"
            onClick={() => setViewingReport('enrollment-comparison')}
          />
        </div>
      </div>

      {renderReportModal()}
    </div>
  );
};

// Student Reports Section
const StudentReportsSection = ({ tableRef, handlePrint, exportToExcel, students, loading, pagination }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Users className="w-5 h-5" /> Student Reports
      </h2>
      <p className="text-gray-600 text-sm mt-1">
        Detailed student information and academic performance
      </p>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 print-table" ref={tableRef}>
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">County</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">Loading students...</td>
            </tr>
          ) : students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentAdmissionNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentGender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.program}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.county}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${student.studentCurrentStatus === 'Active' ? 'bg-green-100 text-green-800' : 
                      student.studentCurrentStatus === 'Graduated' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {student.studentCurrentStatus}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => pagination.setCurrentPage(Math.max(1, pagination.currentPage - 1))}
          disabled={pagination.currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => pagination.setCurrentPage(Math.min(pagination.totalPages, pagination.currentPage + 1))}
          disabled={pagination.currentPage === pagination.totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{pagination.totalItems > 0 ? pagination.indexOfFirstItem + 1 : 0}</span> to <span className="font-medium">{Math.min(pagination.indexOfLastItem, pagination.totalItems)}</span> of{' '}
            <span className="font-medium">{pagination.totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => pagination.setCurrentPage(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => pagination.setCurrentPage(Math.min(pagination.totalPages, pagination.currentPage + 1))}
              disabled={pagination.currentPage === pagination.totalPages || pagination.totalPages === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
      <div className="flex-1 flex justify-end space-x-2 no-print">
        <button 
          onClick={handlePrint}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Printer className="w-4 h-4 mr-1" /> Print
        </button>
     
      </div>
    </div>
  </div>
);

// Reusable components
const ReportSection = ({ icon, title, description, children }) => (
  <div className="bg-white rounded-lg shadow p-6 space-y-4">
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    {description && <p className="text-gray-600">{description}</p>}
    {children}
  </div>
);

const ReportCard = ({ icon, title, value, change }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div className="p-3 bg-blue-100 rounded-full">
        {React.cloneElement(icon, { className: 'w-6 h-6 text-blue-600' })}
      </div>
      <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  </div>
);

const ReportItem = ({ icon, title, description, onClick }) => (
  <div className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
    <div className="flex items-start gap-3">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
        {React.cloneElement(icon, { className: 'w-4 h-4' })}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

export default MoeReports;