import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { DollarSign, TrendingUp, BarChart2, PieChart as PieIcon, Send, X } from 'lucide-react';

// Mock data for MOE level - replace with actual API calls
const overviewStats = {
  totalBudget: 'Ksh 50.2B',
  totalDisbursed: 'Ksh 41.5B',
  availableBalance: 'Ksh 8.7B',
  utilizationRate: '82.7%',
};

const nationalFundingAllocation = [
  { name: 'Capitation Grants', value: 45, color: '#0088FE' },
  { name: 'Infrastructure Dev.', value: 30, color: '#00C49F' },
  { name: 'Student Loans & Bursaries', value: 15, color: '#FFBB28' },
  { name: 'Special Programs', value: 10, color: '#FF8042' },
];

const expenditureTrend = [
  { month: 'Jan', amount: 3.2 },
  { month: 'Feb', amount: 2.8 },
  { month: 'Mar', amount: 4.5 },
  { month: 'Apr', amount: 3.9 },
  { month: 'May', amount: 5.1 },
  { month: 'Jun', amount: 4.2 },
];

const expenditureByInstType = [
  { type: 'National Polytechnics', amount: 15.5 },
  { type: 'Institutes of Technology', amount: 12.3 },
  { type: 'TVCs & TTIs', amount: 13.7 },
];

const recentDisbursements = [
    { id: 1, recipient: 'Nairobi County Institutions', amount: 'Ksh 1.2B', date: '2023-10-15', type: 'Capitation' },
    { id: 2, recipient: 'National Polytechnics Group', amount: 'Ksh 800M', date: '2023-10-10', type: 'Infrastructure' },
    { id: 3, recipient: 'Rift Valley Region', amount: 'Ksh 950M', date: '2023-10-05', type: 'Capitation' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [disbursementData, setDisbursementData] = useState({
    amount: '',
    recipient: '',
    votehead: ''
  });

  const handleDisburseFunds = (e) => {
    e.preventDefault();
    // Handle fund disbursement logic
    console.log('Disbursing funds:', disbursementData);
    setShowDisburseModal(false);
    setDisbursementData({ amount: '', recipient: '', votehead: '' });
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Total National Budget</p>
            <h3 className="text-2xl font-semibold">{overviewStats.totalBudget}</h3>
            <p className="text-green-500 text-sm">+10% from last FY</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Total Disbursed</p>
            <h3 className="text-2xl font-semibold">{overviewStats.totalDisbursed}</h3>
            <p className="text-green-500 text-sm">+5% from last month</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <BarChart2 className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Available Funds</p>
            <h3 className="text-2xl font-semibold">{overviewStats.availableBalance}</h3>
            <p className="text-red-500 text-sm">-2% from last month</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <PieIcon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Budget Utilization</p>
            <h3 className="text-2xl font-semibold">{overviewStats.utilizationRate}</h3>
            <p className="text-green-500 text-sm">+3% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFunding = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">National Funding Allocation & Disbursement</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-md font-medium mb-4">Allocation by Votehead</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nationalFundingAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {nationalFundingAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h4 className="text-md font-medium mb-4">Recent Major Disbursements</h4>
          <div className="space-y-4">
            {recentDisbursements.map((item) => (
              <div key={item.id} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.recipient}</p>
                    <p className="text-sm text-gray-500">{item.date} - {item.type}</p>
                  </div>
                  <span className="text-blue-600 font-semibold">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowDisburseModal(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Disburse Funds
          </button>
        </div>
      </div>
    </div>
  );

  const renderExpenditure = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-8 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">National Expenditure Trend (in Billions Ksh)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={expenditureTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `Ksh ${value}B`} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Monthly Expenditure" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Expenditure by Institution Type (in Billions Ksh)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenditureByInstType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value) => `Ksh ${value}B`} />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" name="Total Expenditure" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">MOE Financial Management</h2>
      <p className="text-gray-600 mb-6">National-level financial oversight, budget allocation, and expenditure tracking.</p>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('funding')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'funding'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Funding & Disbursement
          </button>
          <button
            onClick={() => setActiveTab('expenditure')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'expenditure'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Expenditure Analysis
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'funding' && renderFunding()}
        {activeTab === 'expenditure' && renderExpenditure()}
      </div>

      {/* Disburse Funds Modal */}
      {showDisburseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Disburse Funds</h3>
              <button onClick={() => setShowDisburseModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleDisburseFunds}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient (County/Institution)</label>
                  <input
                    type="text"
                    value={disbursementData.recipient}
                    onChange={(e) => setDisbursementData({...disbursementData, recipient: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Nairobi County, National Polytechnics"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Ksh)</label>
                  <input
                    type="number"
                    value={disbursementData.amount}
                    onChange={(e) => setDisbursementData({...disbursementData, amount: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funding Votehead</label>
                  <select
                    value={disbursementData.votehead}
                    onChange={(e) => setDisbursementData({...disbursementData, votehead: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select votehead</option>
                    <option value="capitation">Capitation</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="scholarships">Scholarships</option>
                    <option value="research">Research</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDisburseModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;
