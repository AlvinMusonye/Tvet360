import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { DollarSign, TrendingUp, BarChart2, PieChart as PieIcon, X, Calendar, Eye, Download } from 'lucide-react';

// Mock data for MOE level - replace with actual API calls
const overviewStats = {
  financialYear: '2023/2024',
  totalAllocated: 'Ksh 50.2B',
  totalDisbursed: 'Ksh 41.5B',
  unallocated: 'Ksh 8.7B',
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

const expenditureByCounty = [
  { name: 'Nairobi', amount: 12.5 },
  { name: 'Kiambu', amount: 8.2 },
  { name: 'Mombasa', amount: 7.5 },
  { name: 'Nakuru', amount: 6.8 },
  { name: 'Uasin Gishu', amount: 5.4 },
];

const recentDisbursements = [
    { id: 1, recipient: 'Nairobi County Institutions', amount: 'Ksh 1.2B', date: '2023-10-15', type: 'Capitation' },
    { id: 2, recipient: 'National Polytechnics Group', amount: 'Ksh 800M', date: '2023-10-10', type: 'Infrastructure' },
    { id: 3, recipient: 'Rift Valley Region', amount: 'Ksh 950M', date: '2023-10-05', type: 'Capitation' },
];

const financialAudits = [
  {
    id: 1,
    programCode: 'ICT/2023/001',
    auditDate: '2023-06-15',
    inspectionScore: 88,
    feedback: 'Minor discrepancies in procurement records',
    riskFlag: false,
    financialYear: '2022/2023',
    auditOpinion: 'Unqualified',
    remarks: 'All financial statements are in order.',
    queriesResolved: 92.5,
    documents: ['Financial_Statement.pdf', 'Procurement_Records.pdf']
  },
  {
    id: 2,
    programCode: 'ENG/2023/005',
    auditDate: '2023-07-20',
    inspectionScore: 75,
    feedback: 'Significant issues in asset verification.',
    riskFlag: true,
    financialYear: '2022/2023',
    auditOpinion: 'Qualified',
    remarks: 'Asset register does not match physical assets. Recommend immediate reconciliation.',
    queriesResolved: 60,
    documents: ['Asset_Verification.pdf']
  },
  {
    id: 3,
    programCode: 'HOS/2023/002',
    auditDate: '2023-08-01',
    inspectionScore: 45,
    feedback: 'Major gaps in financial reporting and internal controls.',
    riskFlag: true,
    financialYear: '2022/2023',
    auditOpinion: 'Adverse',
    remarks: 'Financial statements do not present a true and fair view. Widespread material misstatements found.',
    queriesResolved: 25,
    documents: ['Internal_Control_Review.pdf']
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
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

  const handleViewRemarks = (audit) => {
    setSelectedAudit(audit);
    setShowRemarksModal(true);
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Financial Year</p>
            <h3 className="text-2xl font-semibold">{overviewStats.financialYear}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Total Allocated</p>
            <h3 className="text-2xl font-semibold">{overviewStats.totalAllocated}</h3>
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
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <BarChart2 className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Unallocated</p>
            <h3 className="text-2xl font-semibold">{overviewStats.unallocated}</h3>
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
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Expenditure by County (in Billions Ksh)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenditureByCounty}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `Ksh ${value}B`} />
              <Legend />
              <Bar dataKey="amount" fill="#FF8042" name="Total Expenditure" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderAuditReports = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">OAG Audit Reports</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FY</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opinion</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {financialAudits.map((audit) => (
              <tr key={audit.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{audit.programCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audit.auditDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      audit.inspectionScore >= 80 ? 'bg-green-100 text-green-800' : 
                      audit.inspectionScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {audit.inspectionScore}%
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audit.financialYear}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audit.auditOpinion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {audit.riskFlag ? (
                        <span className="text-red-600 font-medium">High</span>
                    ) : (
                        <span className="text-green-600 font-medium">Low</span>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleViewRemarks(audit)} className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            OAG Audit Reports
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'funding' && renderFunding()}
        {activeTab === 'expenditure' && renderExpenditure()}
        {activeTab === 'audit' && renderAuditReports()}
      </div>

      {/* Disburse Funds Modal */}
      {showDisburseModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
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

      {/* Remarks Modal */}
      {showRemarksModal && selectedAudit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Audit Remarks: {selectedAudit.programCode}</h3>
              <button onClick={() => setShowRemarksModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Opinion</p>
                <p className="text-gray-900">{selectedAudit.auditOpinion}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Feedback</p>
                <p className="text-gray-900">{selectedAudit.feedback}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Remarks</p>
                <p className="p-3 bg-gray-50 rounded border text-gray-700">{selectedAudit.remarks}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRemarksModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;
