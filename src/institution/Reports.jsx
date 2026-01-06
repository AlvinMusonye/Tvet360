import React, { useState } from 'react';
import { Download, FileText, BarChart2, Calendar, Filter } from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const reports = [
    { id: 'student-enrollment', name: 'Student Enrollment Report', description: 'Detailed report on student enrollments by program and demographics' },
    { id: 'attendance', name: 'Attendance Report', description: 'Student and staff attendance records' },
    { id: 'academic-performance', name: 'Academic Performance', description: 'Student grades and performance metrics' },
    { id: 'financial', name: 'Financial Summary', description: 'Tuition, fees, and other financial metrics' },
    { id: 'staff-performance', name: 'Staff Performance', description: 'Teaching and administrative staff metrics' },
    { id: 'program-effectiveness', name: 'Program Effectiveness', description: 'Completion rates and employment outcomes by program' }
  ];

  const handleGenerateReport = () => {
    if (!selectedReport) return;
    
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, this would trigger a download or open a preview
      alert(`Generating ${format.toUpperCase()} report: ${selectedReport}`);
    }, 1500);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and export reports in various formats</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Available Reports
          </h2>
          <div className="space-y-3">
            {reports.map((report) => (
              <div 
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedReport === report.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-medium">{report.name}</h3>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Report Parameters
            </h2>
            
            {!selectedReport ? (
              <div className="text-center py-8 text-gray-500">
                <BarChart2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Select a report to configure parameters</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      />
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                    >
                      <option value="pdf">PDF</option>
                      <option value="csv">CSV</option>
                      <option value="excel">Excel</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
                  >
                    {isGenerating ? (
                      'Generating...'
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Report Preview Section */}
          {selectedReport && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Preview</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <BarChart2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium text-gray-700">
                  {reports.find(r => r.id === selectedReport)?.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {reports.find(r => r.id === selectedReport)?.description}
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  Select parameters and click "Generate Report" to view the preview
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
