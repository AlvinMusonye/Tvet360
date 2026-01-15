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
  const [auditType, setAuditType] = useState('financial');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewAuditOpen, setIsNewAuditOpen] = useState(false);
  const [viewingAudit, setViewingAudit] = useState(null); // For viewing remarks

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
      remarks: 'All financial statements are in order.',
      queriesResolved: 92.5,
      documents: ['Financial_Statement.pdf', 'Procurement_Records.pdf']
    },
    {
      id: 2,
      programCode: 'ENG/2023/005',
      auditDate: '2023-07-20',
      inspectionScore: 75,
      feedback: 'Significant issues in asset verification.',
      riskFlag: true,
      financialYear: '2022/2023',
      auditOpinion: 'Qualified',
      remarks: 'Asset register does not match physical assets. Recommend immediate reconciliation.',
      queriesResolved: 60,
      documents: ['Asset_Verification.pdf']
    },
    {
      id: 3,
      programCode: 'HOS/2023/002',
      auditDate: '2023-08-01',
      inspectionScore: 45,
      feedback: 'Major gaps in financial reporting and internal controls.',
      riskFlag: true,
      financialYear: '2022/2023',
      auditOpinion: 'Adverse',
      remarks: 'Financial statements do not present a true and fair view. Widespread material misstatements found.',
      queriesResolved: 25,
      documents: ['Internal_Control_Review.pdf']
    },
    {
      id: 4,
      programCode: 'BUS/2023/009',
      auditDate: '2023-08-10',
      inspectionScore: 55,
      feedback: 'Unable to obtain sufficient appropriate audit evidence.',
      riskFlag: true,
      financialYear: '2022/2023',
      auditOpinion: 'Disclaimer',
      remarks: 'Scope limitation due to missing records for major transactions. Cannot form an opinion.',
      queriesResolved: 40,
      documents: []
    },
  ];

  const performanceAudits = [
    { id: 1, programCode: 'ICT/2023/001', auditDate: '2023-09-01', efficiencyScore: 82, effectiveness: 'High', recommendations: 'Streamline student onboarding process.' },
  ];

  const complianceAudits = [
    { id: 1, programCode: 'N/A', auditDate: '2023-09-05', regulation: 'Safety and Health Act', status: 'Compliant', notes: 'All safety measures are in place.' },
  ];

  const [audits, setAudits] = useState({
    financial: financialAudits,
    performance: performanceAudits,
    compliance: complianceAudits,
  });

  const [newAudit, setNewAudit] = useState({
    financialYear: '2023/2024',
    auditOpinion: 'Unqualified',
    remarks: ''
  });

  const handleOpenNewAudit = () => {
    setNewAudit({
      programCode: '',
      auditDate: new Date().toISOString().split('T')[0],
      financialYear: '2023/2024',
      auditOpinion: 'Unqualified',
      remarks: '',
      inspectionScore: 80,
      feedback: '',
      riskFlag: false,
      queriesResolved: 100,
    });
    setIsNewAuditOpen(true);
  };

  const handleCloseNewAudit = () => setIsNewAuditOpen(false);

  const handleViewRemarks = (audit) => setViewingAudit(audit);
  const handleCloseRemarks = () => setViewingAudit(null);

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
            <Button variant="outlined" startIcon={<Print />}>Print</Button>
          </div>
        </div>

        {auditType === 'financial' && (
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
            {audits.financial.filter(audit => 
              audit.programCode.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((audit) => (
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
                  {(() => {
                    switch (audit.auditOpinion) {
                      case 'Unqualified':
                        return <Chip label={audit.auditOpinion} color="success" size="small" />;
                      case 'Qualified':
                        return <Chip label={audit.auditOpinion} color="warning" size="small" />;
                      case 'Adverse':
                        return <Chip label={audit.auditOpinion} color="error" size="small" />;
                      case 'Disclaimer':
                        return <Chip label={audit.auditOpinion} color="default" size="small" />;
                      default:
                        return <Chip label={audit.auditOpinion} size="small" />;
                    }
                  })()}
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
                  {['Qualified', 'Adverse', 'Disclaimer'].includes(audit.auditOpinion) && (
                    <IconButton size="small" title="View Remarks" onClick={() => handleViewRemarks(audit)}>
                      <Visibility className="text-gray-600" />
                    </IconButton>
                  )}
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
        )}
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
                <TableCell>Regulation Area</TableCell>
                <TableCell>Audit Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {audits.compliance.map((audit) => (
                <TableRow key={audit.id} hover>
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
        <DialogTitle>Initiate New Financial Audit</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <TextField
            label="Program Code"
            name="programCode"
            value={newAudit.programCode}
            onChange={handleNewAuditChange}
            fullWidth
            required
          />
          <TextField
            label="Financial Year"
            name="financialYear"
            value={newAudit.financialYear}
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
          <FormControl fullWidth>
            <InputLabel>Audit Opinion</InputLabel>
            <Select
              name="auditOpinion"
              value={newAudit.auditOpinion}
              onChange={handleNewAuditChange}
              label="Audit Opinion"
            >
              <MenuItem value="Unqualified">Unqualified</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Adverse">Adverse</MenuItem>
              <MenuItem value="Disclaimer">Disclaimer</MenuItem>
            </Select>
          </FormControl>
          {['Qualified', 'Adverse', 'Disclaimer'].includes(newAudit.auditOpinion) && (
            <TextField
              label="Remarks"
              name="remarks"
              value={newAudit.remarks}
              onChange={handleNewAuditChange}
              fullWidth
              multiline
              rows={3}
              required
              placeholder="Provide remarks for the selected opinion."
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewAudit}>Cancel</Button>
          <Button type="submit" variant="contained">Create Audit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );

  const renderRemarksModal = () => (
    <Dialog open={!!viewingAudit} onClose={handleCloseRemarks} maxWidth="sm" fullWidth>
      <DialogTitle>Audit Remarks for {viewingAudit?.programCode}</DialogTitle>
      <DialogContent>
        <div className="space-y-2">
          <p><strong>Opinion:</strong> <Chip label={viewingAudit?.auditOpinion} size="small" /></p>
          <p><strong>Feedback:</strong> {viewingAudit?.feedback}</p>
          <p className="font-semibold mt-2">Remarks:</p>
          <p className="p-2 bg-gray-100 rounded border">{viewingAudit?.remarks}</p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseRemarks}>Close</Button>
      </DialogActions>
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
      {renderRemarksModal()}
    </div>
  );
};

export default MoeAudit;