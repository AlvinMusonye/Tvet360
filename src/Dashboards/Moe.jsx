import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const Moe = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for all data points initialized with defaults
  const [dashboardData, setDashboardData] = useState({
    totalInstitutions: 0,
    institutionsByType: [],
    institutionsByAccreditation: [],
    averageRiskIndex: 0,
    averageGovernanceScore: 0
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Wait for user token
      if (!currentUser?.token) return;

      setLoading(true);
      setError(null);

      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        };

        // Helper function for fetching
        const fetchData = async (endpoint) => {
          const response = await fetch(`${API_BASE_URL}/api/v1/institution/${endpoint}`, {
            headers
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
          }
          
          return response.json();
        };

        // Fetch all endpoints in parallel
        const [
          totalRes,
          byTypeRes,
          byAccreditationRes,
          riskIndexRes,
          governanceScoreRes
        ] = await Promise.all([
          fetchData('total'),
          fetchData('total-by-type'),
          fetchData('total-by-accreditation'),
          fetchData('average-risk-index'),
          fetchData('average-governance-score')
        ]);

        console.log('Dashboard Data Fetched:', {
          totalRes, byTypeRes, byAccreditationRes, riskIndexRes, governanceScoreRes
        });

        setDashboardData({
          totalInstitutions: totalRes.data?.value ?? 0,
          institutionsByType: Array.isArray(byTypeRes.data) ? byTypeRes.data : [],
          institutionsByAccreditation: Array.isArray(byAccreditationRes.data) ? byAccreditationRes.data : [],
          averageRiskIndex: riskIndexRes.data?.value ?? 0,
          averageGovernanceScore: governanceScoreRes.data?.value ?? 0
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Calculate accredited rate safely
  const calculateAccreditedRate = () => {
    const { institutionsByAccreditation } = dashboardData;
    if (!institutionsByAccreditation || !institutionsByAccreditation.length) return 0;
    
    const total = institutionsByAccreditation.reduce(
      (sum, item) => sum + (item.count || 0), 0
    );
    
    if (total === 0) return 0;
    
    // Assuming the status might be 'ACCREDITED' or similar - adjust based on actual data if needed
    const accredited = institutionsByAccreditation.find(
      item => item.status?.toUpperCase() === 'ACCREDITED'
    )?.count || 0;
    
    return Math.round((accredited / total) * 100);
  };

  const accreditedRate = calculateAccreditedRate();
  const {
    totalInstitutions,
    institutionsByType,
    institutionsByAccreditation,
    averageRiskIndex,
    averageGovernanceScore
  } = dashboardData;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-lg p-6 bg-white rounded-lg shadow-sm border border-red-100">
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Tvet360 Overview</h2>
        <p className="text-gray-600">Real-time monitoring across all TVET institutions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Institutions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Institutions</p>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
          ) : (
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {totalInstitutions.toLocaleString()}
            </h3>
          )}
        </div>

        {/* Average Governance Score */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Avg Governance Score</p>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
          ) : (
            <div className="flex items-center">
              <h3 className="text-2xl font-bold text-gray-800 mt-1 mr-2">
                {averageGovernanceScore.toFixed(1)}%
              </h3>
              <span className={`text-sm px-2 py-1 rounded-full ${
                averageGovernanceScore >= 70 ? 'bg-green-100 text-green-800' :
                averageGovernanceScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {averageGovernanceScore >= 70 ? 'Good' :
                 averageGovernanceScore >= 50 ? 'Average' : 'Needs Improvement'}
              </span>
            </div>
          )}
        </div>

        {/* Average Risk Index */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Average Risk Index</p>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
          ) : (
            <div className="flex items-center">
              <h3 className="text-2xl font-bold text-gray-800 mt-1 mr-2">
                {averageRiskIndex.toFixed(1)}
              </h3>
              <span className={`text-sm px-2 py-1 rounded-full ${
                averageRiskIndex < 3 ? 'bg-green-100 text-green-800' :
                averageRiskIndex < 7 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {averageRiskIndex < 3 ? 'Low' :
                 averageRiskIndex < 7 ? 'Medium' : 'High'} Risk
              </span>
            </div>
          )}
        </div>

        {/* Accredited Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Accredited Rate</p>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
          ) : (
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {accreditedRate}%
            </h3>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Institutions by Type */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Institutions by Type</h4>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading chart data...</div>
            </div>
          ) : institutionsByType.length > 0 ? (
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
                  <Tooltip formatter={(value) => [`${value} institutions`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded">
              No institution type data available
            </div>
          )}
        </div>

        {/* Institutions by Accreditation Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Accreditation Status</h4>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading chart data...</div>
            </div>
          ) : institutionsByAccreditation.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={institutionsByAccreditation}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="status" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ''}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} institutions`, 'Count']}
                    labelFormatter={(label) => `Status: ${label}`}
                  />
                  <Bar 
                    dataKey="count" 
                    name="Number of Institutions" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                  >
                    {institutionsByAccreditation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded">
              No accreditation data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Moe;