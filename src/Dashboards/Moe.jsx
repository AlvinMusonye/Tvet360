import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Moe = () => {
  // State for total institutions
  const [totalInstitutions, setTotalInstitutions] = useState(null);
  const [institutionsByType, setInstitutionsByType] = useState([]);
  const [institutionsByAccreditation, setInstitutionsByAccreditation] = useState([]);
  const [averageRiskIndex, setAverageRiskIndex] = useState(null);
  const [loading, setLoading] = useState({
    total: true,
    byType: true,
    byAccreditation: true,
    riskIndex: true
  });
  const [error, setError] = useState(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Fetch total institutions
  const fetchTotalInstitutions = async () => {
    try {
      const response = await fetch('/api/v1/institution/total');
      if (!response.ok) throw new Error('Failed to fetch total institutions');
      const data = await response.json();
      setTotalInstitutions(data.total);
    } catch (err) {
      console.error('Error fetching total institutions:', err);
      setError(prev => ({ ...prev, total: 'Failed to load total institutions' }));
    } finally {
      setLoading(prev => ({ ...prev, total: false }));
    }
  };

  // Fetch institutions by type
  const fetchInstitutionsByType = async () => {
    try {
      const response = await fetch('/api/v1/institution/total-by-type');
      if (!response.ok) throw new Error('Failed to fetch institutions by type');
      const data = await response.json();
      setInstitutionsByType(data);
    } catch (err) {
      console.error('Error fetching institutions by type:', err);
      setError(prev => ({ ...prev, byType: 'Failed to load institutions by type' }));
    } finally {
      setLoading(prev => ({ ...prev, byType: false }));
    }
  };

  // Fetch institutions by accreditation
  const fetchInstitutionsByAccreditation = async () => {
    try {
      const response = await fetch('/api/v1/institution/total-by-accreditation');
      if (!response.ok) throw new Error('Failed to fetch institutions by accreditation');
      const data = await response.json();
      setInstitutionsByAccreditation(data);
    } catch (err) {
      console.error('Error fetching institutions by accreditation:', err);
      setError(prev => ({ ...prev, byAccreditation: 'Failed to load accreditation data' }));
    } finally {
      setLoading(prev => ({ ...prev, byAccreditation: false }));
    }
  };

  // Fetch average risk index
  const fetchAverageRiskIndex = async () => {
    try {
      const response = await fetch('/api/v1/institution/average-risk-index');
      if (!response.ok) throw new Error('Failed to fetch average risk index');
      const data = await response.json();
      setAverageRiskIndex(data.averageRiskIndex);
    } catch (err) {
      console.error('Error fetching average risk index:', err);
      setError(prev => ({ ...prev, riskIndex: 'Failed to load risk index' }));
    } finally {
      setLoading(prev => ({ ...prev, riskIndex: false }));
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchTotalInstitutions();
    fetchInstitutionsByType();
    fetchInstitutionsByAccreditation();
    fetchAverageRiskIndex();
  }, []);
  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="mb-10">
        <div>
          <h2 className="text-2xl font-bold">MoE National Overview</h2>
          <p className="text-gray-600">Real-time monitoring across all TVET institutions</p>
        </div>
      </div>

      {/* Institutional Health & Risk Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-soft border-l-4 border-primary">
          <p className="caption">Total Institutions</p>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
          ) : error ? (
            <p className="text-red-500 text-sm mt-2">Error loading data</p>
          ) : (
            <h3 className="heading-3 mt-2">{totalInstitutions?.toLocaleString() || 'N/A'}</h3>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-soft border-l-4 border-secondary">
          <p className="caption">Avg Governance Score</p>
          <h3 className="heading-3 mt-2">78%</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-soft border-l-4 border-accent">
          <p className="caption">Average Risk Index</p>
          {loading.riskIndex ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
          ) : error?.riskIndex ? (
            <p className="text-red-500 text-sm mt-2">{error.riskIndex}</p>
          ) : (
            <h3 className="heading-3 mt-2">
              {averageRiskIndex !== null ? (
                <span className={averageRiskIndex < 0.3 ? 'text-green-500' : 
                               averageRiskIndex < 0.7 ? 'text-yellow-500' : 'text-red-500'}>
                  {averageRiskIndex < 0.3 ? 'Low' : 
                   averageRiskIndex < 0.7 ? 'Medium' : 'High'} ({averageRiskIndex.toFixed(2)})
                </span>
              ) : 'N/A'}
            </h3>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-soft border-l-4 border-tech">
          <p className="caption">Accredited Rate</p>
          <h3 className="heading-3 mt-2">92%</h3>
        </div>
      </div>

      {/* Institution Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Institutions by Type */}
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h4 className="heading-3 mb-4">Institutions by Type</h4>
          {loading.byType ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse">Loading data...</div>
            </div>
          ) : error?.byType ? (
            <div className="text-red-500 text-center p-4">{error.byType}</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={institutionsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="type"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {institutionsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Institutions by Accreditation Status */}
        <div className="bg-white p-6 rounded-lg shadow-medium">
          <h4 className="heading-3 mb-4">Accreditation Status</h4>
          {loading.byAccreditation ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse">Loading data...</div>
            </div>
          ) : error?.byAccreditation ? (
            <div className="text-red-500 text-center p-4">{error.byAccreditation}</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={institutionsByAccreditation}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Institutions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Risk Analysis Section */}
      <div className="bg-white p-6 rounded-lg shadow-medium mb-8">
        <h4 className="heading-3 mb-6">Risk Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-700 mb-4">Average Risk Index</h5>
            {loading.riskIndex ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2"></div>
            ) : error?.riskIndex ? (
              <p className="text-red-500">{error.riskIndex}</p>
            ) : (
              <div className="flex items-center">
                <div className="text-3xl font-bold mr-4">
                  {averageRiskIndex?.toFixed(2) || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                  {averageRiskIndex && (
                    <span className={`px-2 py-1 rounded-full ${
                      averageRiskIndex < 0.3 ? 'bg-green-100 text-green-800' :
                      averageRiskIndex < 0.7 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {averageRiskIndex < 0.3 ? 'Low Risk' :
                       averageRiskIndex < 0.7 ? 'Medium Risk' : 'High Risk'}
                    </span>
                  )}
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Lower values indicate lower risk (0-1 scale)
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-4">Risk Distribution</h5>
            <div className="h-40 bg-gray-50 rounded-md flex items-center justify-center">
              <p className="text-gray-400">Risk distribution chart coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Moe;