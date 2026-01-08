// src/institution/InstitutionAudit.jsx
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Checkbox,
  FormControlLabel, IconButton, Chip
} from '@mui/material';
import { 
  Download, Print, Search, FilterList, 
  PictureAsPdf, Description, Receipt, Gavel, CheckCircle, Warning
} from '@mui/icons-material';

const InstitutionAudit = () => {
  const [auditType, setAuditType] = useState('financial');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls
  const auditData = [
    {
      id: 1,
      area: 'Financial Utilization',
      lastAudit: '2023-05-10',
      status: 'Compliant',
      score: 92,
      findings: 2,
      documents: ['Financial_Report_Q1.pdf', 'Expense_Report.pdf']
    },
    {
      id: 2,
      area: 'Asset Management',
      lastAudit: '2023-04-15',
      status: 'Non-Compliant',
      score: 65,
      findings: 5,
      documents: ['Asset_Register.xlsx', 'Maintenance_Logs.pdf']
    },
    // Add more mock data...
  ];

  const renderStatusChip = (status) => {
    switch (status) {
      case 'Compliant':
        return <Chip icon={<CheckCircle />} label="Compliant" color="success" size="small" />;
      case 'Non-Compliant':
        return <Chip icon={<Warning />} label="Non-Compliant" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Gavel className="mr-2" /> Institutional Audit & Compliance
          </h1>
          <p className="text-gray-600">Self-audit and compliance management</p>
        </div>
        <Button variant="contained" color="primary">
          Start Self-Audit
        </Button>
      </div>

      <TableContainer component={Paper} className="shadow">
        <div className="p-4 flex justify-between items-center bg-gray-50">
          <div className="flex items-center space-x-4">
            <FormControl variant="outlined" size="small" className="w-48">
              <InputLabel>Audit Area</InputLabel>
              <Select
                value={auditType}
                onChange={(e) => setAuditType(e.target.value)}
                label="Audit Area"
              >
                <MenuItem value="financial">Financial Utilization</MenuItem>
                <MenuItem value="assets">Asset Management</MenuItem>
                <MenuItem value="safety">Safety & Compliance</MenuItem>
                <MenuItem value="academic">Academic Standards</MenuItem>
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
              <TableCell>Audit Area</TableCell>
              <TableCell>Last Audit Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Compliance Score</TableCell>
              <TableCell>Findings</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditData.map((audit) => (
              <TableRow key={audit.id} hover>
                <TableCell className="font-medium">{audit.area}</TableCell>
                <TableCell>{audit.lastAudit}</TableCell>
                <TableCell>{renderStatusChip(audit.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div 
                      className={`w-8 h-2 rounded-full mr-2 ${
                        audit.score >= 80 ? 'bg-green-500' : 
                        audit.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                    {audit.score}%
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    audit.findings > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {audit.findings} {audit.findings === 1 ? 'Finding' : 'Findings'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {audit.documents.map((doc, idx) => (
                      <IconButton key={idx} size="small" title={doc}>
                        <Description className="text-blue-500" />
                      </IconButton>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<Receipt />}
                  >
                    View Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Self-Audit Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Self-Audit Form</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormControl fullWidth className="mb-4">
              <InputLabel>Audit Area</InputLabel>
              <Select label="Audit Area">
                <MenuItem value="financial">Financial Utilization</MenuItem>
                <MenuItem value="assets">Asset Management</MenuItem>
                <MenuItem value="safety">Safety & Compliance</MenuItem>
                <MenuItem value="academic">Academic Standards</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Audit Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              className="mb-4"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="All requirements met"
              className="mb-4"
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Findings"
              placeholder="Document any findings or observations..."
              className="mb-4"
            />

            <Button variant="contained" color="primary">
              Submit Self-Audit
            </Button>
          </div>
          <div>
            <h3 className="font-medium mb-2">Upload Supporting Documents</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-2">Drag & drop files here or</p>
              <Button variant="outlined" component="label">
                Select Files
                <input type="file" hidden multiple />
              </Button>
              <p className="text-xs text-gray-500 mt-2">Supports PDF, JPG, PNG (Max 10MB)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionAudit;