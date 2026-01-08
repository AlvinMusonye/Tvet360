// src/moe/MoeReports.jsx
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  BookOpen, Users, TrendingUp, FileText, 
  Shield, Briefcase, Handshake, BarChart2, AlertTriangle, CheckCircle 
} from 'lucide-react';

// Mock data - replace with API calls
const enrollmentData = [
  { program: 'ICT', enrollment: 2500, capacity: 3000, yoyChange: 12 },
  { program: 'Engineering', enrollment: 1800, capacity: 2000, yoyChange: 5 },
  { program: 'Business', enrollment: 1500, capacity: 1800, yoyChange: 8 },
];

const equityData = [
  { category: 'Gender (F)', value: 42, target: 50, color: '#8884d8' },
  { category: 'PWD', value: 5, target: 10, color: '#82ca9d' },
  { category: 'Minorities', value: 15, target: 20, color: '#ffc658' },
];

const employmentData = [
  { program: 'ICT', employmentRate: 85, nationalAvg: 78 },
  { program: 'Engineering', employmentRate: 78, nationalAvg: 72 },
  { program: 'Business', employmentRate: 72, nationalAvg: 68 },
];

const MoeReports = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6" /> MOE Reports Dashboard
        </h1>
        <p className="text-gray-600">
          National oversight, policy formulation, and strategic decision-making
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ReportCard 
          icon={<BookOpen />} 
          title="Total Enrollment" 
          value="45,678" 
          change="+8% YoY" 
        />
        <ReportCard 
          icon={<Users />} 
          title="Institutions" 
          value="248" 
          change="+12" 
        />
        <ReportCard 
          icon={<TrendingUp />} 
          title="Employment Rate" 
          value="78%" 
          change="+5%" 
        />
        <ReportCard 
          icon={<Shield />} 
          title="Compliance" 
          value="92%" 
          change="+3%" 
        />
      </div>

      {/* Enrollment & Capacity */}
      <ReportSection 
        icon={<BookOpen />}
        title="National Enrollment & Capacity"
        description="Aggregated enrollment and capacity analysis across all institutions"
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
              <Bar yAxisId="left" dataKey="enrollment" name="Enrollment" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="capacity" name="Capacity" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ReportSection>

      {/* Equity & Compliance */}
      <ReportSection 
        icon={<Users />}
        title="Equity & Social Impact"
        description="Diversity, inclusion, and compliance metrics"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={equityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {equityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ReportSection>

      {/* Employment Outcomes */}
      <ReportSection 
        icon={<Briefcase />}
        title="Employment & Outcomes"
        description="Graduate employment rates and outcomes"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={employmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="program" />
              <YAxis yAxisId="left" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="employmentRate" name="Employment Rate (%)" stroke="#8884d8" />
              <Line yAxisId="left" type="monotone" dataKey="nationalAvg" name="National Avg (%)" stroke="#82ca9d" />
            </LineChart>
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
        </div>
      </div>
    </div>
  );
};

// Reusable components
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

export default MoeReports;