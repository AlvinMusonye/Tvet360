import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { formatNumberAsCommaSeparatedNumberString } from './utils/NumberFormatUtls';
import { fetchStudentCountData, fetchTotalProgramsOffered } from './service/MoeDashboardService';
import YearlyIntakeComparisonPieChart from './YearlyIntakeComparisonPieChart';
import EnrollmentTrendLineGraph from './EnrollmentTrendLineGraph';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const Moe = () => {
  const [totalNationalPolytechnics, setTotalNationalPolytechnics] = useState(0);
  const [totalVocationalAndTechnicalColleges, setTotalVocationalAndTechnicalColleges] = useState(0);
  const [totalTechnicalTrainerColleges, setTotalTechnicalTrainerColleges] = useState(0);
  const [totalVocationalTrainingCenters, setTotalVocationalTrainingCenters] = useState(0);

  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalPrograms, setTotalPrograms] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalActiveStudents, setTotalActiveStudents] = useState(0);
  
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
    (async () => {
      let resp = await fetchTotalProgramsOffered(); 
      console.log(resp);
      console.log(resp.data);
      setTotalPrograms(resp.data.totalProgramCount);
    })();
    ( async () => {
      let resp = await fetchStudentCountData(); 
      console.log(resp); 
      console.log(resp.data);
      setTotalStudents(resp.data.totalStudentCount);
      setTotalActiveStudents(resp.data.activeStudentCount);
    })();
  }, []);

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

        // console.log('Dashboard Data Fetched:', {
        //   totalRes, byTypeRes, byAccreditationRes, riskIndexRes, governanceScoreRes
        // });

        setDashboardData({
          totalInstitutions: totalRes.data?.value ?? 0,
          institutionsByType: Array.isArray(byTypeRes.data) ? byTypeRes.data.map(item => ({
            type: item.institutionType,
            count: item.totalNumber
          })) : [],
          institutionsByAccreditation: Array.isArray(byAccreditationRes.data) ? byAccreditationRes.data : [],
          averageRiskIndex: riskIndexRes.data?.value ?? 0,
          averageGovernanceScore: governanceScoreRes.data?.value ?? 0
        });
        // console.log("================================ Received accreditation status data =================================");
        // console.log(byAccreditationRes);

        let instCountByType = byTypeRes?.data;

        if( Array.isArray(instCountByType) )
        {
          instCountByType.forEach(item => {
            if( item.institutionType.toUpperCase() === "TECHNICAL_TRAINING_COLLEGE" )
            {
              setTotalVocationalAndTechnicalColleges(item.totalNumber);
            }

            if(item.institutionType.toUpperCase() === "POLYTECHNIC")
            {
              setTotalNationalPolytechnics(item.totalNumber);
            }

            if(item.institutionType.toUpperCase() === "VOCATIONAL_TRAINING_CENTER")
            {
              setTotalVocationalTrainingCenters(item.totalNumber);
            }

            if(item.institutionType.toUpperCase() === "TRAINER_COLLEGE")
            {
              setTotalTechnicalTrainerColleges(item.totalNumber);
            }
          });
        }

      } catch (err) {
        // console.error('Error fetching dashboard data:', err);
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
    // console.log("============== calculating accreditation status =================");
    // console.log(institutionsByAccreditation);
    if (!institutionsByAccreditation || !institutionsByAccreditation.length) return 0;
    
    const total = institutionsByAccreditation.reduce(
      (sum, item) => sum + (item.totalNumber || 0), 0
    );
    
    if (total === 0) return 0;
    
    // Assuming the status might be 'ACCREDITED' or similar - adjust based on actual data if needed
    const accredited = institutionsByAccreditation.find(
      item => item.institutionAccreditationStatus?.toUpperCase() === 'ACCREDITED'
    )?.totalNumber || 0;
    
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

  // Mock data to populate the dashboard if API returns empty
  const displayInstitutionTypes = institutionsByType.length > 0 ? institutionsByType : [
    { type: 'National Polytechnic', count: 12 },
    { type: 'Technical Vocational Center', count: 45 },
    { type: 'Institute of Technology', count: 28 },
    { type: 'Vocational Training Center', count: 15 }
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-start text-gray-500">Total Institutions </p>
            </div>
            <div>
              <p className="mt-1 text-3xl font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalInstitutions)}`}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h10M4 18h10M16 14l2 2 4-4"
                  />
                </svg>

              </div>
              <p className="text-sm font-bold text-start text-gray-500">Total programs offered</p>
            </div>
            <div>
              <p className="mt-1 text-3xl font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalPrograms)}`}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14c3.314 0 6 1.686 6 4v2H6v-2c0-2.314 2.686-4 6-4zm0-2a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>

              </div>
              <p className="text-sm font-bold text-start text-gray-500">Total students enrolled</p>
            </div>
            <div>
              <p className="mt-1 text-3xl font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalStudents)}`}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14c3.314 0 6 1.686 6 4v2H6v-2c0-2.314 2.686-4 6-4zm0-2a4 4 0 100-8 4 4 0 000 8zm6 1l2 2 4-4"
                  />
                </svg>

              </div>
              <p className="text-sm font-bold text-start text-gray-500">Total active students</p>
            </div>
            <div>
              <p className="mt-1 text-3xl font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalActiveStudents)}`}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"> */}
        {/* Total Institutions */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Institutions</p>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
          ) : (
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {totalInstitutions.toLocaleString()}
            </h3>
          )}
        </div> */}

        {/* Average Governance Score */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
        </div> */}

        {/* Average Risk Index */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
        </div> */}

        {/* Accredited Rate */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Accredited Rate</p>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
          ) : (
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {accreditedRate}%
            </h3>
          )}
        </div> */}
      {/* </div> */}


      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 my-2 bg-white p-6 rounded-lg shadow mb-8">
        <div>
          <YearlyIntakeComparisonPieChart />
        </div>
        <div>
          <EnrollmentTrendLineGraph />
        </div>
      </div>


      {/* Institution totals summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-start text-gray-500">National Polytechnics </p>
            </div>
            <div>
              <p className="mt-1 text-3xl font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalNationalPolytechnics)}`}</p>
              <p className="mt-1 text-sm text-gray-500 text-center">
                {totalInstitutions > 0 ? ((totalNationalPolytechnics / totalInstitutions) * 100).toFixed(1) : 0}% of Total
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-start text-gray-500">Technical and Vocational Colleges </p>
            </div>
            <div>
              <p className="mt-1 text-3xl font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalVocationalAndTechnicalColleges)}`}</p>
              <p className="mt-1 text-sm text-gray-500 text-center">
                {totalInstitutions > 0 ? ((totalVocationalAndTechnicalColleges / totalInstitutions) * 100).toFixed(1) : 0}% of Total
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-start text-gray-500">Technical Trainer Colleges </p>
            </div>
            <div>
              <p className="mt-1 text-3xl font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalTechnicalTrainerColleges)}`}</p>
              <p className="mt-1 text-sm text-gray-500 text-center">
                {totalInstitutions > 0 ? ((totalTechnicalTrainerColleges / totalInstitutions) * 100).toFixed(1) : 0}% of Total
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-start text-gray-500">Vocational Training centers </p>
            </div>
            <div>
              <p className="mt-1 text-3xl font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalVocationalTrainingCenters)}`}</p>
              <p className="mt-1 text-sm text-gray-500 text-center">
                {totalInstitutions > 0 ? ((totalVocationalTrainingCenters / totalInstitutions) * 100).toFixed(1) : 0}% of Total
              </p>
            </div>
          </div>
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
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={displayInstitutionTypes}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="type" 
                    tick={false}
                    height={10}
                    axisLine={false}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    formatter={(value) => [`${value} Institutions`, 'Count']}
                  />
                  <Legend 
                    payload={displayInstitutionTypes.map((item, index) => ({
                      id: item.type,
                      type: 'square',
                      value: item.type,
                      color: COLORS[index % COLORS.length]
                    }))}
                  />
                  <Bar dataKey="count" name="Institutions" radius={[4, 4, 0, 0]}>
                    {displayInstitutionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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
                    dataKey="institutionAccreditationStatus" 
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
                    dataKey="totalNumber" 
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