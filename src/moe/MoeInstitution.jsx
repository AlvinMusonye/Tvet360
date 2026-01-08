import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building2, School, Award, ShieldAlert, BarChart4, PieChart as PieChartIcon, Search, Filter } from 'lucide-react';

// Mock data for institutions - replace with actual API call
const mockInstitutions = [
  { id: 1, name: 'Nairobi Technical Institute', type: 'Polytechnic', accreditation: 'Accredited', governanceScore: 85, corruptionRisk: 25 },
  { id: 2, name: 'Mombasa TVC', type: 'TVC', accreditation: 'Accredited', governanceScore: 78, corruptionRisk: 30 },
  { id: 3, name: 'Kisumu Technical Institute', type: 'TTI', accreditation: 'Not Accredited', governanceScore: 65, corruptionRisk: 45 },
  { id: 4, name: 'Eldoret Polytechnic', type: 'Polytechnic', accreditation: 'Accredited', governanceScore: 90, corruptionRisk: 20 },
  { id: 5, name: 'Nakuru TVC', type: 'TVC', accreditation: 'Not Accredited', governanceScore: 58, corruptionRisk: 60 },
  { id: 6, name: 'Kisii Technical Institute', type: 'TTI', accreditation: 'Accredited', governanceScore: 82, corruptionRisk: 28 },
];

const MoeInstitution = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setInstitutions(mockInstitutions);
      setFilteredInstitutions(mockInstitutions);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filter institutions based on search term and type
    const filtered = institutions.filter(
      (institution) =>
        institution.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedType === 'All' || institution.type === selectedType)
    );
    setFilteredInstitutions(filtered);
  }, [searchTerm, selectedType, institutions]);

  // Get unique institution types for filter dropdown
  const institutionTypes = ['All', ...new Set(mockInstitutions.map(inst => inst.type))];

  // Calculate summary statistics
  const totalInstitutions = institutions.length;
  const accreditedCount = institutions.filter(i => i.accreditation === 'Accredited').length;
  const averageGovernanceScore = institutions.reduce((acc, curr) => acc + curr.governanceScore, 0) / institutions.length;
  const averageCorruptionRisk = institutions.reduce((acc, curr) => acc + curr.corruptionRisk, 0) / institutions.length;

  // Data for charts
  const typeData = Object.entries(
    institutions.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const accreditationData = [
    { name: 'Accredited', value: accreditedCount, fill: '#10b981' },
    { name: 'Not Accredited', value: institutions.length - accreditedCount, fill: '#ef4444' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Building2 className="w-6 h-6" /> Institutions Management
      </h1>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search institutions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {institutionTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Institutions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">Institutions ({filteredInstitutions.length})</h2>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {filteredInstitutions.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredInstitutions.map((institution) => (
                    <li
                      key={institution.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedInstitution?.id === institution.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedInstitution(institution)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{institution.name}</h3>
                          <p className="text-sm text-gray-500">{institution.type}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            institution.accreditation === 'Accredited'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {institution.accreditation}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">No institutions found</div>
              )}
            </div>
          </div>
        </div>

        {/* Institution Details */}
        <div className="lg:col-span-2">
          {selectedInstitution ? (
            <div className="space-y-6">
              {/* Institution Header */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedInstitution.name}</h2>
                    <div className="flex items-center mt-1 text-gray-600">
                      <Building2 className="w-4 h-4 mr-1" />
                      <span>{selectedInstitution.type}</span>
                      <span className="mx-2">•</span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          selectedInstitution.accreditation === 'Accredited'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {selectedInstitution.accreditation}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Full Profile
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-gray-700 mb-4">Governance Score</h3>
                  <div className="flex items-center">
                    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {selectedInstitution.governanceScore}%
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full ${
                            selectedInstitution.governanceScore >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${selectedInstitution.governanceScore}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedInstitution.governanceScore >= 70
                          ? 'Good governance standards'
                          : 'Needs improvement'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-gray-700 mb-4">Corruption Risk Index</h3>
                  <div className="flex items-center">
                    <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-red-600">
                        {selectedInstitution.corruptionRisk}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full ${
                            selectedInstitution.corruptionRisk > 50 ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${selectedInstitution.corruptionRisk}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedInstitution.corruptionRisk > 50 ? 'High risk' : 'Moderate risk'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Charts */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-700 mb-4">Institution Type Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {typeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} institutions`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Institution Selected</h3>
              <p className="text-gray-500">
                Select an institution from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoeInstitution;