import { Dialog } from "@headlessui/react";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const AddInstitutionModal = ({show, setShow}) => {

    const [loading, setLoading] = useState(false);
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
    //   fetchInstitutionsData();
    } catch (err) {
      console.error('Error saving institution:', err);
      setSubmitStatus({ success: false, message: err.message || 'An error occurred while creating the institution' });
    } finally {
      setLoading(false);
    }
  };

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

    
    return (<>
    <Dialog open={show} onClose={() => setShow(false)} className="relative z-50 h-100">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Centered modal */}
      <div className=" fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" maxWidth="sm" fullWidth>
          <Dialog.Title className="text-lg font-semibold">
            {"Here is the modal title"}
          </Dialog.Title>

          <div className="mt-4 overflow-y-scroll h-100 ">
            <div className="bg-white rounded-lg w-full shadow-sm p-6 mb-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{isEditing ? 'Edit Institution' : 'Create New Institution'}</h3>
                {submitStatus.message && (
                    <div className={`mb-4 p-3 rounded ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {submitStatus.message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                    {/* Registration Number */}
                    <div className="w-full">
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
                    <div className="w-full">
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
                    <div className="w-full">
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
                    <div className="w-full">
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
                    <div className="w-full">
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
                    <div className="w-full">
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
                    <div className="w-full">
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
                    <div className="w-full">
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
                    
                    {/* </div> */}

                    <div className="flex flex-row justify-between space-x-3 pt-4 gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            setShowCreateForm(false);
                            setShow(false);
                        }}
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
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
    </>);
};

export default AddInstitutionModal;