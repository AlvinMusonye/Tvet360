// src/moe/MoeAudit.jsx
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Chip
} from '@mui/material';
import { 
  Download, Print, Search, PictureAsPdf, 
  Description, Gavel, Visibility
} from '@mui/icons-material';

const MoeAudit = () => {
  const [auditType, setAuditType] = useState('performance');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewAuditOpen, setIsNewAuditOpen] = useState(false);

  const performanceAudits = [
    { id: 1, programCode: 'ICT/2023/001', auditDate: '2023-09-01', efficiencyScore: 82, effectiveness: 'High', recommendations: 'Streamline student onboarding process.' },
  ];

  const complianceAudits = [
    { id: 1, programCode: 'ICT/2024/001', auditDate: '2023-09-05', regulation: 'Safety and Health Act', status: 'Compliant', notes: 'All safety measures are in place.' },
  ];

  const [audits, setAudits] = useState({
    performance: performanceAudits,
    compliance: complianceAudits,
  });

  const [newAudit, setNewAudit] = useState({
    type: 'performance',
    programCode: '',
    auditDate: '',
    efficiencyScore: '',
    effectiveness: '',
    recommendations: '',
    regulation: '',
    status: '',
    notes: ''
  });

  const handleOpenNewAudit = () => {
    setNewAudit({
      type: 'performance',
      programCode: '',
      auditDate: new Date().toISOString().split('T')[0],
      efficiencyScore: '',
      effectiveness: 'High',
      recommendations: '',
      regulation: '',
      status: 'Compliant',
      notes: ''
    });
    setIsNewAuditOpen(true);
  };

  const handleCloseNewAudit = () => setIsNewAuditOpen(false);

  const handleNewAuditChange = (e) => {
    const { name, value } = e.target;
    setNewAudit(prev => ({ ...prev, [name]: value }));
  };

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
            <Button variant="outlined" startIcon={<Print />}>Print</Button>
          </div>
        </div>

        {auditType === 'performance' && (
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>Program Code</TableCell>
                <TableCell>Audit Date</TableCell>
                <TableCell>Efficiency Score</TableCell>
                <TableCell>Effectiveness</TableCell>
                <TableCell>Recommendations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {audits.performance.map((audit) => (
                <TableRow key={audit.id} hover>
                  <TableCell>{audit.programCode}</TableCell>
                  <TableCell>{audit.auditDate}</TableCell>
                  <TableCell>{audit.efficiencyScore}%</TableCell>
                  <TableCell>{audit.effectiveness}</TableCell>
                  <TableCell>{audit.recommendations}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {auditType === 'compliance' && (
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>Program Code</TableCell>
                <TableCell>Regulation Area</TableCell>
                <TableCell>Audit Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {audits.compliance.map((audit) => (
                <TableRow key={audit.id} hover>
                  <TableCell>{audit.programCode}</TableCell>
                  <TableCell>{audit.regulation}</TableCell>
                  <TableCell>{audit.auditDate}</TableCell>
                  <TableCell>{audit.status}</TableCell>
                  <TableCell>{audit.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    );
  };

  const renderNewAuditForm = () => (
    <Dialog open={isNewAuditOpen} onClose={handleCloseNewAudit} maxWidth="sm" fullWidth>
      <form onSubmit={(e) => { e.preventDefault(); /* Logic to add audit */ handleCloseNewAudit(); }}>
        <DialogTitle>Initiate New Program Audit</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <FormControl fullWidth>
            <InputLabel>Audit Type</InputLabel>
            <Select
              name="type"
              value={newAudit.type}
              onChange={handleNewAuditChange}
              label="Audit Type"
            >
              <MenuItem value="performance">Performance Audit</MenuItem>
              <MenuItem value="compliance">Compliance Audit</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Program Code"
            name="programCode"
            value={newAudit.programCode}
            onChange={handleNewAuditChange}
            fullWidth
            required
          />
          <TextField
            label="Audit Date"
            name="auditDate"
            type="date"
            value={newAudit.auditDate}
            onChange={handleNewAuditChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          {newAudit.type === 'performance' && (
            <>
              <TextField
                label="Efficiency Score (0-100)"
                name="efficiencyScore"
                type="number"
                value={newAudit.efficiencyScore}
                onChange={handleNewAuditChange}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Effectiveness</InputLabel>
                <Select
                  name="effectiveness"
                  value={newAudit.effectiveness}
                  onChange={handleNewAuditChange}
                  label="Effectiveness"
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Recommendations"
                name="recommendations"
                value={newAudit.recommendations}
                onChange={handleNewAuditChange}
                fullWidth
                multiline
                rows={3}
              />
            </>
          )}

          {newAudit.type === 'compliance' && (
            <>
              <TextField
                label="Regulation Area"
                name="regulation"
                value={newAudit.regulation}
                onChange={handleNewAuditChange}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newAudit.status}
                  onChange={handleNewAuditChange}
                  label="Status"
                >
                  <MenuItem value="Compliant">Compliant</MenuItem>
                  <MenuItem value="Non-Compliant">Non-Compliant</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Notes"
                name="notes"
                value={newAudit.notes}
                onChange={handleNewAuditChange}
                fullWidth
                multiline
                rows={3}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewAudit}>Cancel</Button>
          <Button type="submit" variant="contained">Create Audit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Gavel className="mr-2" /> MOE Audit & Compliance
          </h1>
          <p className="text-gray-600">Comprehensive audit trails and compliance monitoring for OAG Reports</p>
        </div>
        <Button variant="contained" color="primary" onClick={handleOpenNewAudit}>
          Initiate New Audit
        </Button>
      </div>

      {renderAuditTable()}
      {renderNewAuditForm()}
    </div>
  );
};

export default MoeAudit;