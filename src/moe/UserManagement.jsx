// src/moe/UserManagement.jsx
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, FormControlLabel
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

// Mock data - replace with API calls
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', permissions: ['dashboard', 'reports', 'users'] },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'analyst', permissions: ['dashboard', 'reports'] },
];

const availablePermissions = [
  { id: 'dashboard', label: 'View Dashboard' },
  { id: 'reports', label: 'View Reports' },
  { id: 'audit', label: 'View Audit' },
  { id: 'institutions', label: 'Manage Institutions' },
  { id: 'users', label: 'Manage Users' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: '',
    email: '',
    role: 'viewer',
    permissions: []
  });

  const handleOpen = (user = null) => {
    if (user) {
      setCurrentUser({ ...user });
    } else {
      setCurrentUser({
        id: null,
        name: '',
        email: '',
        role: 'viewer',
        permissions: []
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser.id) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
    } else {
      // Add new user
      const newUser = {
        ...currentUser,
        id: Math.max(0, ...users.map(u => u.id)) + 1
      };
      setUsers([...users, newUser]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handlePermissionChange = (permission, checked) => {
    setCurrentUser(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add User
        </Button>
      </div>

      <TableContainer component={Paper} className="shadow">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.map(perm => (
                      <span key={perm} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {perm}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleOpen(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(user.id)}
                  >
                    Close
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {currentUser.id ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent className="space-y-4">
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              fullWidth
              value={currentUser.name}
              onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={currentUser.email}
              onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                value={currentUser.role}
                label="Role"
                onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
              >
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="analyst">Analyst</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Permissions</h4>
              <FormGroup>
                {availablePermissions.map((permission) => (
                  <FormControlLabel
                    key={permission.id}
                    control={
                      <Checkbox
                        checked={currentUser.permissions.includes(permission.id)}
                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                      />
                    }
                    label={permission.label}
                  />
                ))}
              </FormGroup>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {currentUser.id ? 'Update' : 'Create'} User
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default UserManagement;