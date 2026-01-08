import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Users, ShieldCheck, HeartPulse, Users2, BarChart2, TrendingUp } from 'lucide-react';

// Mock data - replace with actual API calls
const diversityData = [
  { name: 'Gender', value: 75, color: 'bg-blue-500' },
  { name: 'Disability', value: 60, color: 'bg-green-500' },
  { name: 'Minority', value: 80, color: 'bg-yellow-500' },
];

const complianceData = [
  { month: 'Jan', incidents: 12, compliance: 85 },
  { month: 'Feb', incidents: 8, compliance: 88 },
  { month: 'Mar', incidents: 5, compliance: 92 },
  { month: 'Apr', incidents: 7, compliance: 90 },
  { month: 'May', incidents: 3, compliance: 95 },
  { month: 'Jun', incidents: 4, compliance: 93 },
];

const vulnerabilitySupport = {
  totalBeneficiaries: 1245,
  supportPrograms: 8,
  satisfactionScore: 4.2,
  communityProjects: 15
};

const communityEngagement = {
  meetingsHeld: 24,
  participationRate: 78,
  issuesResolved: 42,
  satisfactionScore: 4.5
};

const renderProgressBar = (data) => (
  <div key={data.name} className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{data.name}</span>
      <span className="font-medium">{data.value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full ${data.color}`} 
        style={{ width: `${data.value}%` }}
      ></div>
    </div>
  </div>
);

const Equity = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Users2 className="w-6 h-6" /> Equity, Compliance, and Impact
      </h1>
      <p className="text-gray-600">
        Ensuring inclusivity and regulatory adherence for social policy decisions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Diversity Index */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" /> Diversity Index
          </h2>
          <div className="space-y-4">
            {diversityData.map((item) => renderProgressBar(item))}
          </div>
        </div>

        {/* Affirmative Action Uptake */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Affirmative Action
          </h2>
          <div className="h-40 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">78%</div>
              <div className="text-sm text-gray-500">Uptake Rate</div>
            </div>
          </div>
        </div>

        {/* Health & Safety Compliance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Compliance Status
          </h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="incidents" stroke="#8884d8" name="Incidents" />
                <Line yAxisId="right" type="monotone" dataKey="compliance" stroke="#82ca9d" name="Compliance %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Vulnerability Support */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HeartPulse className="w-5 h-5" /> Vulnerability Support
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Beneficiaries:</span>
              <span className="font-medium">{vulnerabilitySupport.totalBeneficiaries.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Support Programs:</span>
              <span className="font-medium">{vulnerabilitySupport.supportPrograms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Satisfaction Score:</span>
              <span className="font-medium">{vulnerabilitySupport.satisfactionScore}/5.0</span>
            </div>
          </div>
        </div>

        {/* Community Engagement */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users2 className="w-5 h-5" /> Community Engagement
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Meetings Held:</span>
              <span className="font-medium">{communityEngagement.meetingsHeld}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Participation Rate:</span>
              <span className="font-medium">{communityEngagement.participationRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Issues Resolved:</span>
              <span className="font-medium">{communityEngagement.issuesResolved}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equity;