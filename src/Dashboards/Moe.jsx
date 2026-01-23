import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { formatNumberAsCommaSeparatedNumberString } from './utils/NumberFormatUtls';
import { fetchInstituionTypeSummaries, fetchStudentCountData, fetchTotalProgramsOffered } from './service/MoeDashboardService';
import YearlyIntakeComparisonPieChart from '../moe/enrollment/YearlyIntakeComparisonPieChart';
import EnrollmentTrendLineGraph from '../moe/enrollment/EnrollmentTrendBarGraph';
import EnrollmentTrendBarGraph from '../moe/enrollment/EnrollmentTrendBarGraph';
import EnrollmentHistory from '../moe/EnrollmentHistory';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';


const InstitutionTypeSummaryCard = ({institutionType, totalInstitutions, totalStudentsEnrolled, totalStudentsActive}) => {
  useEffect(() => {
    console.log("======================================== Card Data ===========================================");
    console.log(institutionType);
    console.log(totalInstitutions);
    console.log(totalStudentsEnrolled);
    console.log(totalStudentsActive);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 ">
        <div className="flex items-center justify-start">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm font-bold text-start text-gray-500">{institutionType} </p>
        </div>
        <div className="w-full">
          <p className="mt-1 text-3xl w-full font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalInstitutions)}`}</p>
          <div className="bg-white grid grid-cols-2 gap-2">
            <div className="text-start shadow p-2 rounded border-1">
              <p className="col-12  text-lg text-semibold">
                {`${formatNumberAsCommaSeparatedNumberString(totalStudentsEnrolled)} Enrolled`} 
              </p>
            </div>
            <div className="text-end shadow p-2 rounded border-1">
              <p className="col-12 text-lg text-semibold">
                {`${formatNumberAsCommaSeparatedNumberString(totalStudentsActive)} Active`}
              </p>
              <p className="text-lg font-bold text-green-500">
                { totalStudentsEnrolled === 0 ? 0 : Math.trunc(totalStudentsActive / totalStudentsEnrolled * 100)}% 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Moe = () => {

  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalPrograms, setTotalPrograms] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalActiveStudents, setTotalActiveStudents] = useState(0);

  const [totalInstitutions, setTotalInstitutions] = useState(1231);

  const [institutionTypeSummaries, setInstitutionTypeSummaries] = useState([]);



  const instTypeTestData = [
    {institutionType: "National Polytechnic", totalInstitutions: 5, totalStudentsEnrolled: 82966, totalStudentsActive: 41353},
    {institutionType: "Technical Training Institutes", totalInstitutions: 3, totalStudentsEnrolled: 28029, totalStudentsActive: 14058},
    {institutionType: "Technical and Vocational Colleges", totalInstitutions: 0, totalStudentsEnrolled: 0, totalStudentsActive: 0},
    {institutionType: "Institutes of Technology", totalInstitutions: 0, totalStudentsEnrolled: 0, totalStudentsActive: 0},
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    (async () => {
      let resp = await fetchInstituionTypeSummaries(); 
      console.log(resp);
      console.log(resp.data);

      let instSummariesData = [];

      if(Array.isArray(resp.data))
      {
        resp.data.forEach(element => {
          if(element.institutionType === 'POLYTECHNIC')
          {
            instSummariesData.push({institutionType: "National Polytechnic", totalInstitutions: element.totalInstitutions, totalStudentsEnrolled: element.totalEnrolledStudents, totalStudentsActive: element.totalActiveStudents});
          }
          else if(element.institutionType === 'TECHNICAL_TRAINING_INSTITUTE')
          {
            instSummariesData.push({institutionType: "Technical Training Institutes", totalInstitutions: element.totalInstitutions, totalStudentsEnrolled: element.totalEnrolledStudents, totalStudentsActive: element.totalActiveStudents});
          }
          else if(element.institutionType === 'INSTITUTE_OF_TECHNOLOGY')
          {
            instSummariesData.push({institutionType: "Institutes of Technology", totalInstitutions: element.totalInstitutions, totalStudentsEnrolled: element.totalEnrolledStudents, totalStudentsActive: element.totalActiveStudents});
          }
          else if(element.institutionType === 'TECHNICAL_AND_VOCATIONAL_COLLEGE')
          {
            instSummariesData.push({institutionType: "Technical and Vocational Colleges", totalInstitutions: element.totalInstitutions, totalStudentsEnrolled: element.totalEnrolledStudents, totalStudentsActive: element.totalActiveStudents});
          }
        });

        let poly = instSummariesData.find(item => item.institutionType === "National Polytechnic");
        let tti = instSummariesData.find(item => item.institutionType === "Technical Training Institutes");
        let iot = instSummariesData.find(item => item.institutionType === "Institutes of Technology");
        let tvc = instSummariesData.find(item => item.institutionType === "Technical and Vocational Colleges");

        if(tvc === undefined)
        {
          instSummariesData.push({institutionType: "Technical and Vocational Colleges", totalInstitutions: 0, totalStudentsEnrolled: 0, totalStudentsActive: 0});
        }

        if(iot === undefined)
        {
          instSummariesData.push({institutionType: "Institutes of Technology", totalInstitutions: 0, totalStudentsEnrolled: 0, totalStudentsActive: 0});
        }

        if(tti === undefined)
        {
          instSummariesData.push({institutionType: "Technical Training Institutes", totalInstitutions: 0, totalStudentsEnrolled: 0, totalStudentsActive: 0});
        }

        if(poly === undefined)
        {
          instSummariesData.push({institutionType: "National Polytechnic", totalInstitutions: 0, totalStudentsEnrolled: 0, totalStudentsActive: 0});
        }
      }

      console.log("======================== summaries data =======================================");
      console.log(instSummariesData);
      setInstitutionTypeSummaries(instSummariesData);
    })();

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

  // useEffect(() => {
    // const fetchDashboardData = async () => {
    //   // Wait for user token
    //   if (!currentUser?.token) return;

    //   setLoading(true);
    //   setError(null);

    //   try {
    //     const headers = {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${currentUser.token}`
    //     };

    //     // Helper function for fetching
    //     const fetchData = async (endpoint) => {
    //       const response = await fetch(`${API_BASE_URL}/api/v1/institution/${endpoint}`, {
    //         headers
    //       });
          
    //       if (!response.ok) {
    //         throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    //       }
          
    //       return response.json();
    //     };

    //     // Fetch all endpoints in parallel
    //     const [
    //       totalRes,
    //       byTypeRes,
    //       byAccreditationRes,
    //       riskIndexRes,
    //       governanceScoreRes
    //     ] = await Promise.all([
    //       fetchData('total'),
    //       fetchData('total-by-type'),
    //       fetchData('total-by-accreditation'),
    //       fetchData('average-risk-index'),
    //       fetchData('average-governance-score')
    //     ]);

    //     // console.log('Dashboard Data Fetched:', {
    //     //   totalRes, byTypeRes, byAccreditationRes, riskIndexRes, governanceScoreRes
    //     // });

    //     setDashboardData({
    //       totalInstitutions: totalRes.data?.value ?? 0,
    //       institutionsByType: Array.isArray(byTypeRes.data) ? byTypeRes.data.map(item => ({
    //         type: item.institutionType,
    //         count: item.totalNumber
    //       })) : [],
    //       institutionsByAccreditation: Array.isArray(byAccreditationRes.data) ? byAccreditationRes.data : [],
    //       averageRiskIndex: riskIndexRes.data?.value ?? 0,
    //       averageGovernanceScore: governanceScoreRes.data?.value ?? 0
    //     });
    //     // console.log("================================ Received accreditation status data =================================");
    //     // console.log(byAccreditationRes);

    //     let instCountByType = byTypeRes?.data;

    //     if( Array.isArray(instCountByType) )
    //     {
    //       instCountByType.forEach(item => {
    //         if( item.institutionType.toUpperCase() === "TECHNICAL_TRAINING_INSTITUTE" )
    //         {
    //           setTotalVocationalAndTechnicalColleges(item.totalNumber);
    //         }

    //         if(item.institutionType.toUpperCase() === "POLYTECHNIC")
    //         {
    //           setTotalNationalPolytechnics(item.totalNumber);
    //         }

    //         if(item.institutionType.toUpperCase() === "VOCATIONAL_TRAINING_COLLEGE")
    //         {
    //           setTotalVocationalTrainingCenters(item.totalNumber);
    //         }

    //         if(item.institutionType.toUpperCase() === "INSTITUTE_OF_TECHNOLOGY")
    //         {
    //           setTotalTechnicalTrainerColleges(item.totalNumber);
    //         }
    //       });
    //     }

    //   } catch (err) {
    //     // console.error('Error fetching dashboard data:', err);
    //     setError('Failed to load dashboard data. Please check your connection.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchDashboardData();
  // }, [currentUser]);

  // Calculate accredited rate safely
  // const calculateAccreditedRate = () => {
  //   const { institutionsByAccreditation } = dashboardData;
  //   // console.log("============== calculating accreditation status =================");
  //   // console.log(institutionsByAccreditation);
  //   if (!institutionsByAccreditation || !institutionsByAccreditation.length) return 0;
    
  //   const total = institutionsByAccreditation.reduce(
  //     (sum, item) => sum + (item.totalNumber || 0), 0
  //   );
    
  //   if (total === 0) return 0;
    
  //   // Assuming the status might be 'ACCREDITED' or similar - adjust based on actual data if needed
  //   const accredited = institutionsByAccreditation.find(
  //     item => item.institutionAccreditationStatus?.toUpperCase() === 'ACCREDITED'
  //   )?.totalNumber || 0;
    
  //   return Math.round((accredited / total) * 100);
  // };

  // const accreditedRate = calculateAccreditedRate();
  // const {
  //   totalInstitutions,
  //   institutionsByType,
  //   institutionsByAccreditation,
  //   averageRiskIndex,
  //   averageGovernanceScore
  // } = dashboardData;

  // Mock data to populate the dashboard if API returns empty
  // const displayInstitutionTypes = institutionsByType.length > 0 ? institutionsByType : [
  //   { type: 'National Polytechnic', count: 12 },
  //   { type: 'Technical Vocational Center', count: 45 },
  //   { type: 'Institute of Technology', count: 28 },
  //   { type: 'Vocational Training Center', count: 15 }
  // ];

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
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-8">
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
      
      {/* Institution totals summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {
          institutionTypeSummaries.map((_, key) => <InstitutionTypeSummaryCard 
            key={key} 
            institutionType={institutionTypeSummaries[key].institutionType} 
            totalInstitutions={institutionTypeSummaries[key].totalInstitutions}
            totalStudentsEnrolled={institutionTypeSummaries[key].totalStudentsEnrolled}
            totalStudentsActive={institutionTypeSummaries[key].totalStudentsActive}
            />)
        }
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-start text-gray-500">National Polytechnics </p>
            </div>
            <div className="w-full">
              <p className="mt-1 text-3xl w-full font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalNationalPolytechnics)}`}</p>
              <div className="bg-white grid grid-cols-2 gap-2">
                <div className="text-start shadow p-2">
                  <p className="col-12  text-lg text-semibold">
                    {`${formatNumberAsCommaSeparatedNumberString(23000)} Enrolled`} 
                  </p>
                </div>
                <div className="text-end shadow p-2">
                  <p className="col-12 text-lg text-semibold">
                    {`${formatNumberAsCommaSeparatedNumberString(13000)} Active`}
                  </p>
                  <p className="text-lg font-bold text-green-500">
                    {60}% 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
        </div> */}
        
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-start text-gray-500">Technical Training Institutes </p>
            </div>
            <div>
              <p className="mt-1 text-3xl font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalTechnicalTrainerColleges)}`}</p>
              <p className="mt-1 text-sm text-gray-500 text-center">
                {totalInstitutions > 0 ? ((totalTechnicalTrainerColleges / totalInstitutions) * 100).toFixed(1) : 0}% of Total
              </p>
            </div>
          </div>
        </div> */}
        
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-start text-gray-500">Institutes of Technology </p>
            </div>
            <div>
              <p className="mt-1 text-3xl font-semibold text-center text-gray-900">{`${formatNumberAsCommaSeparatedNumberString(totalVocationalTrainingCenters)}`}</p>
              <p className="mt-1 text-sm text-gray-500 text-center">
                {totalInstitutions > 0 ? ((totalVocationalTrainingCenters / totalInstitutions) * 100).toFixed(1) : 0}% of Total
              </p>
            </div>
          </div>
        </div> */}

      </div>



      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 w-full my-2 bg-white p-6 rounded-lg shadow mb-8">
        {/* <div>
          <YearlyIntakeComparisonPieChart />
        </div> */}
        <div className=' w-full'>
          <EnrollmentHistory />
        </div>
      </div>

      {/* Charts Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"> */}
        {/* Institutions by Type */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
                    axisLine={true}
                    tickFormatter={(value) => value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ''}
                    label={true}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    formatter={(value) => [`${value} Institutions`, 'Count']}
                    labelFormatter={label => `Type: ${label}`}
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
        </div> */}

        {/* Institutions by Accreditation Status */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
                    allowDecimals={false}
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
        </div> */}

      {/* </div> */}
    </div>
  );
};

export default Moe;