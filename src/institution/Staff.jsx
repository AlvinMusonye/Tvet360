import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, Award, Clock, UserCheck, UserPlus } from 'lucide-react';

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
  { name: 'Wed', value: 6 },
  { name: 'Thu', value: 7 },
  { name: 'Fri', value: 6 },
];

const COLORS = ['#1F3C88', '#2EAD4F', '#F7931E', '#00A8B5', '#F9C74F'];

const StaffDashboard = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Staff & Trainer Management</h1>
        <p className="text-[var(--color-text-muted)]">Monitor workforce capacity and development for hiring and training strategies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Total Staff</p>
              <p className="text-3xl font-bold">142</p>
            </div>
            <div className="p-3 rounded-full bg-[var(--color-primary-light)] bg-opacity-10">
              <Users className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Avg. Evaluation</p>
              <p className="text-3xl font-bold">4.2/5</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Avg. Workload</p>
              <p className="text-3xl font-bold">32h/wk</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">PD Uptake</p>
              <p className="text-3xl font-bold text-[var(--color-secondary)]">68%</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <UserCheck className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Qualification Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="heading-3 mb-4">Qualification Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {qualificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Specialization Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="heading-3 mb-4">Specialization Areas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={specializationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {specializationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employment Terms */}
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h3 className="heading-3 mb-4">Employment Terms</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {employmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Workload and PD Uptake */}
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
