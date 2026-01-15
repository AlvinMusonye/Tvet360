import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const staffData = [
  { name: 'PhD', value: 5 },
  { name: 'Masters', value: 15 },
  { name: 'Bachelors', value: 45 },
  { name: 'Diploma', value: 35 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Institution = () => {
  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Institution Dashboard</h2>
        <p className="text-gray-600">Manage your institution's programs and students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Staffing Overview */}
        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-medium">
          <h4 className="heading-3 mb-6">Staff Distribution & Workload</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="caption">Avg Workload</p>
              <p className="body-large font-bold">18 Hrs/Week</p>
            </div>
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="caption">PD Uptake</p>
              <p className="body-large font-bold text-success">65%</p>
            </div>
          </div>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={staffData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {staffData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facilities Status */}
        <div className="bg-white p-8 rounded-lg shadow-medium">
          <h4 className="heading-3 mb-4">Infrastructure Health</h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="body-small">Utilization Rate</span>
                <span className="body-small font-bold">82%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-[82%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="body-small">ICT Coverage</span>
                <span className="body-small font-bold">95%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-tech h-2 rounded-full w-[95%]"></div>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="caption mb-2">Facility Downtime</p>
              <p className="heading-2 text-accent">3.2 Days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Institution;