// src/moe/MoeAudit.jsx
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Checkbox,
  FormControlLabel, IconButton
} from '@mui/material';
import { 
  Download, Print, Search, FilterList, 
  PictureAsPdf, Description, Receipt, Gavel
} from '@mui/icons-material';

const MoeAudit = () => {
  const [auditType, setAuditType] = useState('financial');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls
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
      queriesResolved: 92.5,
      documents: ['Financial_Statement.pdf', 'Procurement_Records.pdf']
    },
    // Add more mock data...
  ];

  const renderAuditTable = () => {
    return (
      <TableContainer component={Paper} className="shadow">
        <div className="p-4 flex justify-between items-center bg-gray-50">
          <div className="flex items-center space-x-4">
            <FormControl variant="outlined" size="small" className="w-48">
              <InputLabel>Audit Type</InputLabel>
              <Select
                value={auditType}
                onChange={(e) => setAuditType(e.target.value)}
                label="Audit Type"
              >
                <MenuItem value="financial">Financial Audit</MenuItem>
                <MenuItem value="performance">Performance Audit</MenuItem>
                <MenuItem value="compliance">Compliance Audit</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              placeholder="Search audits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search className="text-gray-400 mr-2" />,
              }}
            />
          </div>
          <div className="space-x-2">
            <Button variant="outlined" startIcon={<Download />}>Export</Button>
            <Button variant="outlined" startIcon={<Print />}>Print</Button>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell>Program Code</TableCell>
              <TableCell>Audit Date</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Financial Year</TableCell>
              <TableCell>Audit Opinion</TableCell>
              <TableCell>Queries Resolved</TableCell>
              <TableCell>Risk</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {financialAudits.map((audit) => (
              <TableRow key={audit.id} hover>
                <TableCell>{audit.programCode}</TableCell>
                <TableCell>{audit.auditDate}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div 
                      className={`w-8 h-2 rounded-full mr-2 ${
                        audit.inspectionScore >= 80 ? 'bg-green-500' : 
                        audit.inspectionScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                    {audit.inspectionScore}%
                  </div>
                </TableCell>
                <TableCell>{audit.financialYear}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    audit.auditOpinion === 'Unqualified' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {audit.auditOpinion}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${audit.queriesResolved}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{audit.queriesResolved}%</span>
                </TableCell>
                <TableCell>
                  {audit.riskFlag ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">High Risk</span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Low Risk</span>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton size="small" title="View Documents">
                    <Description className="text-blue-500" />
                  </IconButton>
                  <IconButton size="small" title="Download Report">
                    <PictureAsPdf className="text-red-500" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Gavel className="mr-2" /> MOE Audit & Compliance
          </h1>
          <p className="text-gray-600">Comprehensive audit trails and compliance monitoring</p>
        </div>
        <Button variant="contained" color="primary">
          Initiate New Audit
        </Button>
      </div>

      {renderAuditTable()}

      {/* Audit Feedback Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Audit Feedback & Response</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Audit Findings</h3>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter audit findings and observations..."
            />
          </div>
          <div>
            <h3 className="font-medium mb-2">Management Response</h3>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter management response and action plan..."
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outlined">Save Draft</Button>
          <Button variant="contained" color="primary">Submit Response</Button>
        </div>
      </div>
    </div>
  );
};

export default MoeAudit;