import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { DollarSign, TrendingUp, BarChart2, PieChart as PieIcon } from 'lucide-react';

// Mock data - replace with actual API calls
const fundingSources = [
  { name: 'Capitation', value: 45 },
  { name: 'HELB', value: 30 },
  { name: 'CDF', value: 15 },
  { name: 'County', value: 10 },
];

const revenueExpenseData = [
  { month: 'Jan', revenue: 4000, expense: 2400 },
  { month: 'Feb', revenue: 3000, expense: 1398 },
  { month: 'Mar', revenue: 2000, expense: 9800 },
  { month: 'Apr', revenue: 2780, expense: 3908 },
  { month: 'May', revenue: 1890, expense: 4800 },
  { month: 'Jun', revenue: 2390, expense: 3800 },
];

const costPerStudentData = [
  { year: '2020', cost: 400 },
  { year: '2021', cost: 420 },
  { year: '2022', cost: 450 },
  { year: '2023', cost: 480 },
  { year: '2024', cost: 500 },
];

const yearlyComparisonData = [
  { 
    year: '2024',
    capitation: 4000,
    helb: 3000,
    cdf: 2000,
    county: 1000
  },
  { 
    year: '2023',
    capitation: 3500,
    helb: 2800,
    cdf: 1800,
    county: 900
  },
  { 
    year: '2022',
    capitation: 3000,
    helb: 2500,
    cdf: 1500,
    county: 800
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FinancialManagement = () => {
  const [forecastYears, setForecastYears] = useState(3);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <DollarSign className="w-6 h-6" /> Financial Management
      </h1>

      {/* Funding Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5" /> Funding Sources
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fundingSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {fundingSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Contribution']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs Expense */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5" /> Revenue vs. Expenditure
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueExpenseData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cost per Student */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Cost per Student Trend
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={costPerStudentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cost" stroke="#8884d8" name="Cost per Student (KSH)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Yearly Comparison */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Yearly Funding Comparison</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={yearlyComparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="capitation" stroke="#0088FE" name="Capitation" />
              <Line type="monotone" dataKey="helb" stroke="#00C49F" name="HELB" />
              <Line type="monotone" dataKey="cdf" stroke="#FFBB28" name="CDF" />
              <Line type="monotone" dataKey="county" stroke="#FF8042" name="County" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Financial Projections (Next {forecastYears} Years)</h2>
          <select
            className="border rounded px-3 py-1 text-sm"
            value={forecastYears}
            onChange={(e) => setForecastYears(Number(e.target.value))}
          >
            <option value={1}>1 Year</option>
            <option value={3}>3 Years</option>
            <option value={5}>5 Years</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={Array.from({ length: forecastYears }, (_, i) => ({
                year: new Date().getFullYear() + i + 1,
                projection: 1000000 * (1 + i * 0.15) // Sample projection logic
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => [`KSH ${value.toLocaleString()}`, 'Projection']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="projection"
                stroke="#8884d8"
                name="Projected Revenue"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;