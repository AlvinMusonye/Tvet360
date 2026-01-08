import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell , 
} from 'recharts';
import { Wrench, Wifi, BatteryCharging, Layout } from 'lucide-react';


// Mock data - replace with actual API calls
const facilityData = [
  { name: 'Classrooms', good: 45, bad: 5 },
  { name: 'Labs', good: 30, bad: 10 },
  { name: 'Libraries', good: 25, bad: 5 },
  { name: 'Dormitories', good: 35, bad: 15 },
  { name: 'Dining Halls', good: 20, bad: 10 },
];

const downtimeData = [
  { name: 'Jan', downtime: 2, efficiency: 75 },
  { name: 'Feb', downtime: 1, efficiency: 80 },
  { name: 'Mar', downtime: 3, efficiency: 70 },
  { name: 'Apr', downtime: 2, efficiency: 82 },
  { name: 'May', downtime: 1, efficiency: 85 },
  { name: 'Jun', downtime: 0, efficiency: 90 },
];

const ictData = [
  { name: 'Computers', value: 85 },
  { name: 'Projectors', value: 70 },
  { name: 'Smart Boards', value: 45 },
  { name: 'Printers', value: 60 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Infrastructure = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Layout className="w-6 h-6" /> Infrastructure and Facilities
      </h1>
      
      {/* Facility Utilization and Condition */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5" /> Facility Utilization and Condition
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={facilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="good" fill="#10b981" name="Good Condition" />
              <Bar dataKey="bad" fill="#ef4444" name="Needs Maintenance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downtime and Efficiency */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BatteryCharging className="w-5 h-5" /> Downtime and Energy Efficiency
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={downtimeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="downtime" stroke="#8884d8" name="Downtime (days)" />
                <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#82ca9d" name="Efficiency Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ICT Infrastructure */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wifi className="w-5 h-5" /> ICT Infrastructure Coverage
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ictData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {ictData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Coverage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;