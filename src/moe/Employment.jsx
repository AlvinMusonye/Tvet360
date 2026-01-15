import React from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Briefcase, GraduationCap, TrendingUp, CheckCircle, LineChart as LineChartIcon } from 'lucide-react';

// Mock data - replace with actual API calls
const employmentStatusData = [
  { name: 'Wage Employment', value: 45, color: '#8884d8' },
  { name: 'Self-Employed', value: 25, color: '#82ca9d' },
  { name: 'Further Studies', value: 15, color: '#ffc658' },
  { name: 'Seeking Employment', value: 15, color: '#ff8042' },
];

const programEmploymentData = [
  { 
    program: 'ICT', 
    employmentRate: 85,
    institutionA: 82,
    institutionB: 88,
    institutionC: 85
  },
  { 
    program: 'Engineering', 
    employmentRate: 78,
    institutionA: 75,
    institutionB: 82,
    institutionC: 77
  },
  { 
    program: 'Business', 
    employmentRate: 72,
    institutionA: 70,
    institutionB: 75,
    institutionC: 71
  },
];

const internshipData = [
  { year: '2020', completionRate: 85, employmentAfter: 75 },
  { year: '2021', completionRate: 88, employmentAfter: 78 },
  { year: '2022', completionRate: 90, employmentAfter: 82 },
  { year: '2023', completionRate: 92, employmentAfter: 85 },
];

const Employment = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="w-6 h-6" /> Employment & Outcomes 
        </h1>
        <p className="text-gray-600">
          Measuring graduate success for employability-focused policies and TVET program evaluation.
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Graduates Tracked</h3>
          <p className="text-3xl font-bold">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">National Employment Rate</h3>
          <p className="text-3xl font-bold text-green-600">78%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg. Internship Completion</h3>
          <p className="text-3xl font-bold text-blue-600">89%</p>
        </div>
      </div>

      {/* Employment Status Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" /> Employment Status Distribution
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={employmentStatusData}
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
                {employmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employment by Program */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5" /> Employment Rates by Program
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={programEmploymentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="program" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="employmentRate" name="National Avg" fill="#8884d8" />
              <Bar yAxisId="left" dataKey="institutionA" name="Institution A" fill="#82ca9d" />
              <Bar yAxisId="left" dataKey="institutionB" name="Institution B" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Internship & Employment Correlation */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Internship Completion & Employment
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={internshipData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="completionRate" name="Completion Rate (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="employmentAfter" name="Employed After (%)" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Policy Insights */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Policy Insights
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">Program Alignment</h3>
            <p className="text-sm text-gray-600">ICT programs show the highest employment rates. Consider expanding capacity in high-demand fields.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800">Internship Impact</h3>
            <p className="text-sm text-gray-600">Strong correlation between internship completion and employment outcomes. Maintain focus on industry partnerships.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-800">Regional Opportunities</h3>
            <p className="text-sm text-gray-600">Explore expanding programs with high employment rates to underserved regions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employment;