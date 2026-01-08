// src/institution/InstitutionReports.jsx
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  BookOpen, Users, TrendingUp, FileText, 
  Shield, Briefcase, Award, ClipboardCheck 
} from 'lucide-react';

// Mock data - replace with API calls
const enrollmentData = [
  { program: 'ICT', enrolled: 250, capacity: 300, completion: 85 },
  { program: 'Engineering', enrolled: 180, capacity: 200, completion: 78 },
  { program: 'Business', enrolled: 150, capacity: 200, completion: 82 },
];

const employmentData = [
  { year: '2020', rate: 75, nationalAvg: 70 },
  { year: '2021', rate: 78, nationalAvg: 72 },
  { year: '2022', rate: 82, nationalAvg: 75 },
  { year: '2023', rate: 85, nationalAvg: 78 },
];

const complianceData = [
  { area: 'Safety', score: 92, target: 95, color: '#8884d8' },
  { area: 'Facilities', score: 85, target: 90, color: '#82ca9d' },
  { area: 'Staffing', score: 88, target: 90, color: '#ffc658' },
];

const InstitutionReports = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6" /> Institution Reports
        </h1>
        <p className="text-gray-600">
          Operational insights and performance metrics for institutional management
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ReportCard 
          icon={<BookOpen />} 
          title="Total Students" 
          value="1,245" 
          change="+5% YoY" 
        />
        <ReportCard 
          icon={<Users />} 
          title="Graduation Rate" 
          value="88%" 
          change="+3%" 
        />
        <ReportCard 
          icon={<Briefcase />} 
          title="Employment Rate" 
          value="82%" 
          change="+4%" 
        />
        <ReportCard 
          icon={<Shield />} 
          title="Compliance" 
          value="89%" 
          change="+2%" 
        />
      </div>

      {/* Enrollment & Performance */}
      <ReportSection 
        icon={<BookOpen />}
        title="Enrollment & Academic Performance"
        description="Student enrollment and program completion metrics"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="program" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="enrolled" name="Enrolled" fill="#8884d8" />
              <Bar yAxisId="left" dataKey="capacity" name="Capacity" fill="#82ca9d" />
              <Line yAxisId="right" type="monotone" dataKey="completion" name="Completion %" stroke="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ReportSection>

      {/* Graduate Outcomes */}
      <ReportSection 
        icon={<Briefcase />}
        title="Graduate Outcomes"
        description="Employment and career progression of graduates"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={employmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="rate" name="Institution Rate" stroke="#8884d8" />
              <Line yAxisId="left" type="monotone" dataKey="nationalAvg" name="National Avg" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ReportSection>

      {/* Compliance Status */}
      <ReportSection 
        icon={<Shield />}
        title="Compliance & Standards"
        description="Institutional compliance with regulatory standards"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="score"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {complianceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ReportSection>

      {/* Reports List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" /> Available Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReportItem 
            icon={<FileText />}
            title="Institution Executive Summary"
            description="Performance snapshot and key metrics"
          />
          <ReportItem 
            icon={<BookOpen />}
            title="Enrollment & Performance"
            description="Student enrollment and academic outcomes"
          />
          <ReportItem 
            icon={<Briefcase />}
            title="Graduate Outcomes"
            description="Employment and career progression"
          />
          <ReportItem 
            icon={<Shield />}
            title="Compliance Report"
            description="Regulatory and standards compliance"
          />
        </div>
      </div>
    </div>
  );
};

// Reuse the same component definitions from MoeReports.jsx
const ReportSection = ({ icon, title, description, children }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const ReportCard = ({ icon, title, value, change }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <span className={`text-sm font-medium ${
        change.startsWith('+') ? 'text-green-600' : 'text-red-600'
      }`}>
        {change}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const ReportItem = ({ icon, title, description }) => (
  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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

export default InstitutionReports;