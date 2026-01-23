import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, Plus, X, BarChart as BarChartIcon, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { fetchInstitutionTotalsByType } from '../service/MoeInstitutionService';
import { formatNumberAsCommaSeparatedNumberString } from '../../Dashboards/utils/NumberFormatUtls';
import AverageGovernanceScoreTrend from '../AverageGovernanceScoreTrend';
import AverageCorruptionRiskIndexTrend from '../AverageCorruptionRiskIndexTrend';
import AddInstitutionModal from './AddInstituionModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const MoeInstitution = () => {
  const { currentUser } = useAuth();
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  const [accreditedInstitutions, setAccreditedInstitutions] = useState(0);
  const [notAccreditedInstitutions, setNotAccreditedInstitutions] = useState(0);

  const [averageGovernanceScore, setAverageGovernanceScore] = useState(0.0);
  const [averageCorruptionRiskIndex, setAverageCorruptionRiskIndex] = useState(0.0);
  const [showAddInstitutionModal, setShowAddInstitutionModal] = useState(false);


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [selectedAccreditation, setSelectedAccreditation] = useState('All');
  const [loading, setLoading] = useState(true);
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [selectedInstitutionForModal, setSelectedInstitutionForModal] = useState(null);
  const [programData, setProgramData] = useState([]);
  const [loadingProgramData, setLoadingProgramData] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [innovationIndexData, setInnovationIndexData] = useState([]);
  const [selectedCountyForDigitalLiteracy, setSelectedCountyForDigitalLiteracy] = useState('');
  const [digitalLiteracyData, setDigitalLiteracyData] = useState(null);
  const [loadingDigitalLiteracy, setLoadingDigitalLiteracy] = useState(false);
  const [availableCounties, setAvailableCounties] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    institutionRegistrationNumber: '',
    institutionName: '',
    principalName: '',
    principalContact: '',
    institutionPhoneNumber: '',
    institutionCounty: '',
    institutionType: 'INSTITUTE_OF_TECHNOLOGY',
    institutionAddress: '',
    institutionAccreditationStatus: 'ACCREDITED',
    institutionGovernanceScore: '',
    institutionCorruptionRiskIndex: '0.0',
    institutionStakeholderSatisfaction: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  // Mock data for display when API returns empty
  const institutionAccreditationData = [
    { institutionAccreditationStatus: 'ACCREDITED', institutionCount: 3 },
    { institutionAccreditationStatus: 'NOT ACCREDITED', institutionCount: 0 }
  ];

  const [institutionTypes, setInstitutionTypes] = useState([]);

  const [totalNationalPolytechnics, setTotalNationalPolytechnics] = useState(0);
  const [totalVocationalAndTechnicalColleges, setTotalVocationalAndTechnicalColleges] = useState(0);
  const [totalTechnicalTrainerColleges, setTotalTechnicalTrainerColleges] = useState(0);
  const [totalVocationalTrainingCenters, setTotalVocationalTrainingCenters] = useState(0);

  // Fetch total institutions on component mount and when token changes
  useEffect(() => {
    setAverageGovernanceScore(70.0);
    setAverageCorruptionRiskIndex(3.5);
    setAccreditedInstitutions(3);
    setNotAccreditedInstitutions(0);
    if (currentUser?.token) {
      fetchInstitutionsData();
    }

    
    (async () => {
      let byTypeRes = await fetchInstitutionTotalsByType(currentUser?.token);
      let instCountByType = byTypeRes?.data;

      if( Array.isArray(instCountByType) )
      {
        console.log(instCountByType);
        setInstitutionTypes(instCountByType);
        // instCountByType.forEach(item => {
          // if( item.institutionType.toUpperCase() === "TECHNICAL_TRAINING_COLLEGE" )
          // {
          //   setTotalVocationalAndTechnicalColleges(item.totalNumber);
          // }

          // if(item.institutionType.toUpperCase() === "POLYTECHNIC")
          // {
          //   setTotalNationalPolytechnics(item.totalNumber);
          // }

          // if(item.institutionType.toUpperCase() === "VOCATIONAL_TRAINING_CENTER")
          // {
          //   setTotalVocationalTrainingCenters(item.totalNumber);
          // }

          // if(item.institutionType.toUpperCase() === "TRAINER_COLLEGE")
          // {
          //   setTotalTechnicalTrainerColleges(item.totalNumber);
          // }
        // });
      }
    })();
  }, [currentUser?.token]);

  // useEffect(() => {
  //   if (allInstitutions.length > 0) {
  //       const counties = [...new Set(allInstitutions.map(inst => inst.institutionCounty).filter(Boolean))].sort();
  //       setAvailableCounties(counties);
  //   }
  // }, [allInstitutions]);

  useEffect(() => {
    const fetchDigitalLiteracyDataForCounty = async () => {
        if (!selectedCountyForDigitalLiteracy) {
            setDigitalLiteracyData(null);
            return;
        }
        setLoadingDigitalLiteracy(true);
        setDigitalLiteracyData(null); // Clear old data

        const institutionsInCounty = allInstitutions.filter(
            inst => inst.institutionCounty === selectedCountyForDigitalLiteracy
        );

        if (institutionsInCounty.length === 0) {
            setLoadingDigitalLiteracy(false);
            return;
        }

        try {
            const promises = institutionsInCounty.map(inst =>
                fetch(`${API_BASE_URL}/api/v1/program/get-prog-dgtl-lt-inst?institutionRegistrationNumber=${inst.institutionRegistrationNumber}`, {
                    headers: { 'Authorization': `Bearer ${currentUser?.token}` }
                }).then(res => res.json())
            );

            const results = await Promise.all(promises);

            const aggregatedData = results.reduce((acc, result) => {
                if (result.status === 200 && result.data) {
                    acc.programsWithDigitalLiteracy += result.data.programsWithDigitalLiteracy || 0;
                    acc.programsWithoutDigitalLiteracy += result.data.programsWithoutDigitalLiteracy || 0;
                }
                return acc;
            }, { programsWithDigitalLiteracy: 0, programsWithoutDigitalLiteracy: 0 });

            setDigitalLiteracyData(aggregatedData);

        } catch (error) {
            console.error("Error fetching digital literacy data for county:", error);
            setDigitalLiteracyData(null);
        } finally {
            setLoadingDigitalLiteracy(false);
        }
    };

    fetchDigitalLiteracyDataForCounty();
  }, [selectedCountyForDigitalLiteracy, allInstitutions, currentUser?.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.institutionRegistrationNumber.trim()) errors.institutionRegistrationNumber = 'Registration number is required';
    if (!formData.institutionName.trim()) errors.institutionName = 'Institution name is required';
    if (!formData.principalName.trim()) errors.principalName = 'Principal name is required';
    if (!formData.principalContact.trim()) errors.principalContact = 'Principal contact is required';
    if (!formData.institutionPhoneNumber.trim()) errors.institutionPhoneNumber = 'Institution phone number is required';
    if (!formData.institutionCounty.trim()) errors.institutionCounty = 'County is required';
    if (!formData.institutionAddress.trim()) errors.institutionAddress = 'Address is required';
    if (formData.institutionGovernanceScore === '' || isNaN(formData.institutionGovernanceScore) || formData.institutionGovernanceScore < 0 || formData.institutionGovernanceScore > 100) {
      errors.institutionGovernanceScore = 'Governance score must be between 0 and 100';
    }
    if (formData.institutionStakeholderSatisfaction === '' || isNaN(formData.institutionStakeholderSatisfaction) || formData.institutionStakeholderSatisfaction < 0 || formData.institutionStakeholderSatisfaction > 100) {
      errors.institutionStakeholderSatisfaction = 'Stakeholder satisfaction must be between 0 and 100';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setSubmitStatus({ success: false, message: '' });
      const endpoint = isEditing ? `${API_BASE_URL}/api/v1/institution/update` : `${API_BASE_URL}/api/v1/institution/create`;
      
      // Prepare the request body
      const requestBody = {
        ...formData,
        institutionGovernanceScore: parseFloat(formData.institutionGovernanceScore),
        institutionCorruptionRiskIndex: parseFloat(formData.institutionCorruptionRiskIndex || 0),
        institutionStakeholderSatisfaction: parseFloat(formData.institutionStakeholderSatisfaction)
      };

      console.log('Sending request to:', endpoint);
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        const errorMessage = data?.message || 
                           data?.error || 
                           `Server responded with status ${response.status}`;
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          response: data
        });
        throw new Error(errorMessage);
      }

      setSubmitStatus({ success: true, message: `Institution ${isEditing ? 'updated' : 'created'} successfully!` });
      // Reset form and refresh data
      setFormData({
        institutionRegistrationNumber: '',
        institutionName: '',
        principalName: '',
        principalContact: '',
        institutionPhoneNumber: '',
        institutionCounty: '',
        institutionType: 'INSTITUTE_OF_TECHNOLOGY',
        institutionAddress: '',
        institutionAccreditationStatus: 'ACCREDITED',
        institutionGovernanceScore: '',
        institutionCorruptionRiskIndex: '0.0',
        institutionStakeholderSatisfaction: ''
      });
      setShowCreateForm(false);
      setIsEditing(false);
      
      // Refresh the institutions data
      fetchInstitutionsData();
    } catch (err) {
      console.error('Error saving institution:', err);
      setSubmitStatus({ success: false, message: err.message || 'An error occurred while creating the institution' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e, institution) => {
    e.stopPropagation(); // Prevent row click
    setFormData({
      institutionRegistrationNumber: institution.institutionRegistrationNumber,
      institutionName: institution.institutionName,
      principalName: institution.principalName || '',
      principalContact: institution.principalContact || '',
      institutionPhoneNumber: institution.institutionPhoneNumber || '',
      institutionCounty: institution.institutionCounty || '',
      institutionType: institution.institutionType || 'INSTITUTE_OF_TECHNOLOGY',
      institutionAddress: institution.institutionAddress || '',
      institutionAccreditationStatus: institution.institutionAccreditationStatus || 'ACCREDITED',
      institutionGovernanceScore: institution.institutionGovernanceScore ?? '',
      institutionCorruptionRiskIndex: institution.institutionCorruptionRiskIndex ?? '0.0',
      institutionStakeholderSatisfaction: institution.institutionStakeholderSatisfaction ?? ''
    });
    setIsEditing(true);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInstitutionClick = async (institution) => {
    setSelectedInstitutionForModal(institution);
    setIsProgramModalOpen(true);
    setLoadingProgramData(true);
    setProgramData([]); // Clear previous data
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/program/get-std-ttl-prog-inst?institutionRegistrationNumber=${institution.institutionRegistrationNumber}`, {
            headers: {
                'Authorization': `Bearer ${currentUser?.token}`,
            }
        });
        const result = await response.json();
        if (result.status === 200 && Array.isArray(result.data)) {
            setProgramData(result.data);
        } else {
            console.error('Failed to fetch program data:', result.message);
            setProgramData([]);
        }
    } catch (error) {
        console.error("Error fetching program data for institution:", error);
        setProgramData([]);
    } finally {
        setLoadingProgramData(false);
    }
  };

  const fetchInstitutionsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const headers = {
        'Authorization': `Bearer ${currentUser?.token}`,
        'Content-Type': 'application/json'
      };

      const [totalRes, typesRes, allInstRes, innovationRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/institution/total`, { headers }),
        fetch(`${API_BASE_URL}/api/v1/institution/total-by-type`, { headers }),
        fetch(`${API_BASE_URL}/api/v1/institution/get`, { headers }),
        fetch(`${API_BASE_URL}/api/v1/program/get-avg-inn-idx-inst`, { headers })
      ]);

      if (!totalRes.ok || !typesRes.ok || !allInstRes.ok || !innovationRes.ok) {
        throw new Error('Failed to fetch institution data');
      }

      const totalData = await totalRes.json();
      const typesData = await typesRes.json();
      const allInstitutionsData = await allInstRes.json();
      const innovationData = await innovationRes.json();

      if (totalData.status === 200) {
        setTotalInstitutions(totalData.data.value);
      }

      if (typesData.status === 200 && Array.isArray(typesData.data)) {
        // Ensure the key is 'type' for consistency
        const formattedTypes = typesData.data.map(item => ({
          type: item.institutionType,
          count: item.totalNumber
        }));
        // setInstitutionTypes(formattedTypes);
      }

      if (allInstitutionsData.data && Array.isArray(allInstitutionsData.data)) {
        setAllInstitutions(allInstitutionsData.data);
      }

      if (innovationData.status === 200 && Array.isArray(innovationData.data)) {
        setInnovationIndexData(innovationData.data);
      }
    } catch (err) {
      console.error('Error fetching institution data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Filter institutions based on search and type
  const filteredInstitutions = allInstitutions.filter(inst => {
    const matchesSearch = inst.institutionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inst.institutionRegistrationNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || inst.institutionType === selectedType;
    const matchesCounty = selectedCounty === 'All' || inst.institutionCounty === selectedCounty;
    const matchesAccreditation = selectedAccreditation === 'All' || inst.institutionAccreditationStatus === selectedAccreditation;
    return matchesSearch && matchesType && matchesCounty && matchesAccreditation;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Institutions Overview</h2>
        <p className="text-gray-600">Manage and monitor all registered institutions</p>
      </div>

      <AddInstitutionModal show={showAddInstitutionModal} setShow={setShowAddInstitutionModal} />

      {/* Create Institution Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{isEditing ? 'Edit Institution' : 'Create New Institution'}</h3>
          {submitStatus.message && (
            <div className={`mb-4 p-3 rounded ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {submitStatus.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Registration Number */}
              <div>
                <label htmlFor="institutionRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  id="institutionRegistrationNumber"
                  name="institutionRegistrationNumber"
                  value={formData.institutionRegistrationNumber}
                  onChange={handleInputChange}
                  disabled={isEditing} // Often registration numbers are unique IDs and shouldn't change
                  className={`w-full px-3 py-2 border ${formErrors.institutionRegistrationNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionRegistrationNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionRegistrationNumber}</p>
                )}
              </div>

              {/* Institution Name */}
              <div>
                <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionName}</p>
                )}
              </div>

              {/* Principal Name */}
              <div>
                <label htmlFor="principalName" className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Name *
                </label>
                <input
                  type="text"
                  id="principalName"
                  name="principalName"
                  value={formData.principalName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.principalName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.principalName && <p className="mt-1 text-sm text-red-600">{formErrors.principalName}</p>}
              </div>

              {/* Principal Contact */}
              <div>
                <label htmlFor="principalContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Contact *
                </label>
                <input
                  type="text"
                  id="principalContact"
                  name="principalContact"
                  value={formData.principalContact}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.principalContact ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.principalContact && <p className="mt-1 text-sm text-red-600">{formErrors.principalContact}</p>}
              </div>

              {/* Institution Phone Number */}
              <div>
                <label htmlFor="institutionPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Phone Number *
                </label>
                <input
                  type="text"
                  id="institutionPhoneNumber"
                  name="institutionPhoneNumber"
                  value={formData.institutionPhoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionPhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionPhoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionPhoneNumber}</p>
                )}
              </div>

              {/* County */}
              <div>
                <label htmlFor="institutionCounty" className="block text-sm font-medium text-gray-700 mb-1">
                  County *
                </label>
                <input
                  type="text"
                  id="institutionCounty"
                  name="institutionCounty"
                  value={formData.institutionCounty}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionCounty ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionCounty && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionCounty}</p>
                )}
              </div>

              {/* Institution Type */}
              <div>
                <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Type
                </label>
                <select
                  id="institutionType"
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="INSTITUTE_OF_TECHNOLOGY">Institute of Technology</option>
                  <option value="NATIONAL_POLYTECHNIC">National Polytechnic</option>
                  <option value="TECHNICAL_VOCATIONAL_COLLEGE">Technical & Vocational College</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="institutionAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  id="institutionAddress"
                  name="institutionAddress"
                  value={formData.institutionAddress}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionAddress && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionAddress}</p>
                )}
              </div>

              {/* Accreditation Status */}
              <div>
                <label htmlFor="institutionAccreditationStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Accreditation Status
                </label>
                <select
                  id="institutionAccreditationStatus"
                  name="institutionAccreditationStatus"
                  value={formData.institutionAccreditationStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACCREDITED">Accredited</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="REVOKED">Revoked</option>
                </select>
              </div>

              {/* Governance Score */}
              {/* <div>
                <label htmlFor="institutionGovernanceScore" className="block text-sm font-medium text-gray-700 mb-1">
                  Governance Score (0-100) *
                </label>
                <input
                  type="number"
                  id="institutionGovernanceScore"
                  name="institutionGovernanceScore"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.institutionGovernanceScore}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionGovernanceScore ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionGovernanceScore && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionGovernanceScore}</p>
                )}
              </div> */}

              {/* Corruption Risk Index */}
              {/* <div>
                <label htmlFor="institutionCorruptionRiskIndex" className="block text-sm font-medium text-gray-700 mb-1">
                  Corruption Risk Index (0.0-1.0)
                </label>
                <input
                  type="number"
                  id="institutionCorruptionRiskIndex"
                  name="institutionCorruptionRiskIndex"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={formData.institutionCorruptionRiskIndex}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}

              {/* Stakeholder Satisfaction */}
              {/* <div>
                <label htmlFor="institutionStakeholderSatisfaction" className="block text-sm font-medium text-gray-700 mb-1">
                  Stakeholder Satisfaction (0-100) *
                </label>
                <input
                  type="number"
                  id="institutionStakeholderSatisfaction"
                  name="institutionStakeholderSatisfaction"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.institutionStakeholderSatisfaction}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.institutionStakeholderSatisfaction ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.institutionStakeholderSatisfaction && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.institutionStakeholderSatisfaction}</p>
                )}
              </div> */}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Institution' : 'Create Institution')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Total institutions, accredted and those not accredited */}
      <div className="p-0 mb-6 flex flex-col md:flex-row justify-between align-center gap-4 ">

        <div className="relative w-full md:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Institutions</p>
              <p className="text-2xl font-semibold text-gray-800">{totalInstitutions}</p>
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg> */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                {/* Building */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16M9 7h1m-1 4h1m4-4h1m-1 4h1m-6 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />

                {/* Check badge */}
                <circle cx="18" cy="6" r="5" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 6l1 1 2-2" stroke="bg-green-500"/>
              </svg>

            </div>
            <div>
              <p className="text-sm font-medium text-center text-gray-500">Institutions Accredited</p>
              <p className="text-2xl font-semibold text-center text-green-500">{accreditedInstitutions}</p>
              <p className="text-lg font-medium text-center text-gray-500">{`${accreditedInstitutions / totalInstitutions * 100}%`}</p>
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg> */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                {/* Building */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16M9 7h1m-1 4h1m4-4h1m-1 4h1m-6 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />

                {/* X badge */}
                <circle cx="18" cy="6" r="5" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 5l2 2m0-2l-2 2" />
              </svg>

            </div>
            <div>
              <p className="text-sm font-medium text-center text-gray-500">Institutions Not Accredited</p>
              <p className="text-2xl font-semibold text-center text-red-500">{notAccreditedInstitutions}</p>
              <p className="text-lg font-medium text-center text-gray-500">{`${notAccreditedInstitutions / totalInstitutions * 100}%`}</p>
            </div>
          </div>
        </div>

      </div>

      {/* average governance score and average corruption risk index */}
      <div className="p-0 mb-6 flex flex-col md:flex-row justify-between align-center gap-4 ">
        <div className="relative w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-row items-center">
            {/* <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div> */}
            <div className="w-full">
              <p className="text-2xl text-center font-semibold text-green-500">{`${averageGovernanceScore}%`}</p>
              <p className="text-sm w-full font-medium text-center text-gray-500">Average Governance Score</p>
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            {/* <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div> */}
            <div className='w-full'>
              <p className="text-2xl text-center font-semibold text-red-500">{averageCorruptionRiskIndex}</p>
              <p className="text-sm font-medium text-center text-gray-500">Average Corruption Risk Index</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Institutions</p>
              <p className="text-2xl font-semibold text-gray-800">{totalInstitutions}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Institution totals summaries */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      </div> */}

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 mb-8">
        <div className="my-2 bg-white p-6 rounded-lg shadow">
          <AverageGovernanceScoreTrend />
        </div>
        <div className="my-2 bg-white p-6 rounded-lg shadow">
          <AverageCorruptionRiskIndexTrend />
        </div>
      </div>

      {/* Institutions Table */}
      <div className='bg-white shadow-sm rounded-lg grid grid-cols-1 p-3 gap-4 mb-4'>
        {/* Action Bar */}
        <div className="flex flex-row w-full  justify-end">
          <button
            onClick={() => {
              setShowAddInstitutionModal(true);
              // setShowCreateForm(!showCreateForm);
              // if (!showCreateForm) {
              //   setIsEditing(false); // Reset editing state when opening fresh
              // }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {showCreateForm ? 'Cancel' : (isEditing ? 'Edit Institution' : 'Add New Institution')}
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className=" m-0 p-2 relative w-full flex flex-row items-center ">
            <div className="flex self-align-center flex-col md:flex-row md:items-center w-full gap-2">
              
              <div className="relative w-full flex-1 bg-gray-100 rounded-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search institutions..."
                  className="w-full pl-10 pr-4 py-2 border-none rounded-lg focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative w-full md:w-1/4">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border-1 rounded-sm bg-white"
                  value={selectedType}
                  onChange={(event) => {
                    let newVal = event.target?.value;
                    console.log(newVal);
                      setSelectedType(newVal);
                  }}
                >
                  {institutionTypes.map(type => (<option value={type.institutionType} >{type.institutionType}</option>))}
                  {/* <option value="All">All Types</option>
                  <option value="NATIONAL_POLYTECHNIC">Polytechnic</option>
                  <option value="INSTITUTE_OF_TECHNOLOGY">Institute of Technology</option>
                  <option value="TECHNICAL_VOCATIONAL_COLLEGE">TTI &amp; TVCs</option> */}
                </select>
              </div>

              <div className="relative w-full md:w-1/4">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-sm bg-white"
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                >
                  <option value="All">All Counties</option>
                  {availableCounties.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>

              <div className="relative w-full md:w-1/4">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border-1 rounded-sm bg-white"
                  value={selectedAccreditation}
                  onChange={(e) => setSelectedAccreditation(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="ACCREDITED">Accredited</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

            </div>
          </div>

          <div className=" overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institution Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration No.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      County
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accreditation
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInstitutions.length > 0 ? (
                    filteredInstitutions.map((inst) => (
                      <tr key={inst.institutionRegistrationNumber} onClick={() => handleInstitutionClick(inst)} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {inst.institutionName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {inst.institutionRegistrationNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {inst.institutionCounty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inst.institutionType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inst.institutionAccreditationStatus === 'ACCREDITED' ? 'bg-green-100 text-green-800' : inst.institutionAccreditationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {inst.institutionAccreditationStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button onClick={(e) => handleEdit(e, inst)} className="text-blue-600 hover:text-blue-900 mr-3" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No institutions found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"> */}
        {/* Institutions by Type */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Total institutions by type</h4>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={institutionTypes}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="institutionType" 
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
                    payload={institutionTypes.map((inst, index) => ({
                      id: inst.institutionType,
                      type: 'square',
                      value: inst.totalNumber,
                      color: COLORS[index % COLORS.length]
                    }))}
                  />
                  <Bar dataKey="totalNumber" name="Institutions" radius={[4, 4, 0, 0]}>
                    {institutionTypes.map((type, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div> */}

        


        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Institution Accreditation Statistics</h4>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={institutionAccreditationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="institutionAccreditationStatus" 
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
                    payload={institutionAccreditationData.map((item, index) => ({
                      id: item.institutionAccreditationStatus,
                      type: 'square',
                      value: item.institutionAccreditationStatus,
                      color: COLORS[index % COLORS.length]
                    }))}
                  />
                  <Bar dataKey="institutionCount" name="Institutions" radius={[4, 4, 0, 0]}>
                    {institutionAccreditationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div> */}
      {/* </div> */}

      {/* {isProgramModalOpen && selectedInstitutionForModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Student Enrollment for {selectedInstitutionForModal.institutionName}
                        </h3>
                        <button onClick={() => setIsProgramModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto">
                    {loadingProgramData ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading program data...</p>
                        </div>
                    ) : programData.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students Enrolled</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {programData.map((prog, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prog.programCode}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prog.totalStudentsEnrolled}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No program enrollment data found for this institution.
                        </div>
                    )}
                </div>
                <div className="p-4 bg-gray-50 border-t text-right">
                    <button
                        onClick={() => setIsProgramModalOpen(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )} */}

      {/* Digital Literacy Section */}
      {/* <div className="bg-white rounded-lg shadow-sm p-6 mt-8 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Digital Literacy Program Analysis by County</h3>
        <div className="mb-4">
          <label htmlFor="digital-literacy-county-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select County
          </label>
          <select
            id="digital-literacy-county-select"
            value={selectedCountyForDigitalLiteracy}
            onChange={(e) => setSelectedCountyForDigitalLiteracy(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select a County --</option>
            {availableCounties.map(county => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </div>

        {loadingDigitalLiteracy ? (
          <div className="text-center py-4">Loading data...</div>
        ) : digitalLiteracyData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-sm font-medium text-green-800">Programs WITH Digital Literacy</h4>
              <p className="text-2xl font-bold text-green-600">{digitalLiteracyData.programsWithDigitalLiteracy}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="text-sm font-medium text-red-800">Programs WITHOUT Digital Literacy</h4>
              <p className="text-2xl font-bold text-red-600">{digitalLiteracyData.programsWithoutDigitalLiteracy}</p>
            </div>
          </div>
        ) : selectedCountyForDigitalLiteracy ? (
          <div className="text-center py-4 text-gray-500">No data available for the selected county.</div>
        ) : (
          <div className="text-center py-4 text-gray-500">Please select a county to view digital literacy stats.</div>
        )}
      </div> */}


    </div>
  );
};

export default MoeInstitution;