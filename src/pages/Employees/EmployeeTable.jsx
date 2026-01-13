import React, { useState, useMemo, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  Box,
  TablePagination,
  IconButton,
  InputAdornment,
  Tooltip,
  Chip,
  Avatar,
  Typography,
  Button,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import PrintIcon from "@mui/icons-material/Print";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ShareIcon from "@mui/icons-material/Share";

// Print Component - Fixed with proper component structure
const PrintEmployee = React.forwardRef(({ employee }, ref) => {
  if (!employee) return null;
  
  return (
    <div ref={ref} style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 700, marginBottom: '16px', color: '#1a1a1a' }}>
        Employee Details
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4, pb: 3, borderBottom: "2px solid #e0e0e0" }}>
            <Avatar 
              sx={{ 
                bgcolor: "#1976d2", 
                width: 100, 
                height: 100,
                fontSize: "2.5rem",
                fontWeight: 600
              }}
            >
              {employee.fullName ? employee.fullName.charAt(0).toUpperCase() : "E"}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {employee.fullName || "N/A"}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>
                Employee ID: {employee.id || "N/A"}
              </Typography>
              <Chip
                label={employee.isActive ? "Active" : "Inactive"}
                color={employee.isActive ? "success" : "error"}
                sx={{ fontWeight: 600, fontSize: "0.9rem", height: 32 }}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              Personal Information
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Gender:</strong> {employee.gender || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Location:</strong> {employee.state || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              Employment Details
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Position:</strong> {employee.position || "Not specified"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Hire Date:</strong> {employee.hireDate || "Not specified"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              Additional Information
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Status:</strong> {employee.isActive ? "Currently Active" : "Currently Inactive"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Report Date:</strong> {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, pt: 3, borderTop: "2px solid #e0e0e0", textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Employee Management System • Confidential Document
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Printed on: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </div>
  );
});

PrintEmployee.displayName = 'PrintEmployee';

const EmployeeTable = ({ data, onEdit, onDelete, onAddNew ,columns}) => {
  const theme = useTheme();
  const printRef = useRef();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState("fullName");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((emp) =>
        Object.values(emp).some((value) =>
          String(value).toLowerCase().includes(lowercasedQuery)
        )
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[orderBy] || "";
      const bValue = b[orderBy] || "";
      
      if (order === "asc") {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });
  }, [data, searchQuery, orderBy, order]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Action Menu handlers
  const handleActionClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const handlePrint = () => {
    setPrintDialogOpen(true);
    handleActionClose();
  };

  const handlePrintClose = () => {
    setPrintDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleEditClick = () => {
    if (selectedEmployee) {
      onEdit(selectedEmployee);
      handleActionClose();
    }
  };

  const handleDeleteClick = () => {
    if (selectedEmployee) {
      onDelete(selectedEmployee.id);
      handleActionClose();
    }
  };

  // Simple print function without react-to-print
  const handleSimplePrint = () => {
    if (!selectedEmployee) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print');
      return;
    }
    
    const content = `
      <html>
        <head>
          <title>Employee Details - ${selectedEmployee.fullName || 'Unknown'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #1a1a1a; border-bottom: 2px solid #1976d2; padding-bottom: 10px; }
            .header { display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #e0e0e0; }
            .avatar { 
              width: 100px; 
              height: 100px; 
              background-color: #1976d2; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-size: 2.5rem; 
              font-weight: bold;
              margin-right: 20px;
            }
            .info-section { margin-bottom: 20px; }
            .info-section h2 { color: #1976d2; margin-bottom: 10px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #666; font-size: 0.9rem; }
            @media print {
              @page { margin: 20mm; }
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>Employee Details</h1>
          
          <div class="header">
            <div class="avatar">
              ${selectedEmployee.fullName ? selectedEmployee.fullName.charAt(0).toUpperCase() : 'E'}
            </div>
            <div>
              <h2>${selectedEmployee.fullName || 'N/A'}</h2>
              <p><strong>Employee ID:</strong> ${selectedEmployee.id || 'N/A'}</p>
              <p><strong>Status:</strong> 
                <span style="
                  color: ${selectedEmployee.isActive ? 'green' : 'red'};
                  font-weight: bold;
                  padding: 2px 8px;
                  border: 1px solid ${selectedEmployee.isActive ? 'green' : 'red'};
                  border-radius: 12px;
                  font-size: 0.9rem;
                ">
                  ${selectedEmployee.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="info-section">
              <h2>Personal Information</h2>
              <p><strong>DOB:</strong> ${selectedEmployee.dob || 'N/A'}</p>
              <p><strong>Gender:</strong> ${selectedEmployee.gender || 'N/A'}</p>
              <p><strong>Location:</strong> ${selectedEmployee.state || 'N/A'}</p>
            </div>
            
            
            <div class="info-section">
              <h2>Employment Details</h2>
              <p><strong>Position:</strong> ${selectedEmployee.position || 'Not specified'}</p>
              <p><strong>Hire Date:</strong> ${selectedEmployee.hireDate || 'Not specified'}</p>
            </div>
            
            <div class="info-section">
              <h2>Additional Information</h2>
              <p><strong>Status:</strong> ${selectedEmployee.isActive ? 'Currently Active' : 'Currently Inactive'}</p>
              <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Employee Management System • Confidential Document</p>
            <p>Printed on: ${new Date().toLocaleString()}</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header with Add Button */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        mb: 3,
        p: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      }}>
        <Box>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
            Employee Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredAndSortedData.length} of {data.length} employees
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddNew}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          Add Employee
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="medium"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search employees by name, location, gender, or status..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  onClick={clearSearch}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 2 }
          }}
        />
      </Paper>

      {/* Table */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.align || "left"}
                    sx={{
                      backgroundColor: theme.palette.grey[100],
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      py: 2,
                      px: 2,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      color: theme.palette.text.secondary,
                      ...(column.width && { width: column.width }),
                    }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.key}
                        direction={orderBy === column.key ? order : "asc"}
                        onClick={() => handleSort(column.key)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((emp) => (
                  <TableRow 
                    key={emp.id} 
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={`${emp.id}-${column.key}`}
                        align={column.align || "left"}
                        sx={{ py: 2, px: 2 }}
                      >
                        {column.key === "actions" ? (
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                            {/* Edit Button */}
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => onEdit(emp)}
                                sx={{
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                  "&:hover": {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* Print Button */}
                            <Tooltip title="Print">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedEmployee(emp);
                                  setPrintDialogOpen(true);
                                }}
                                sx={{
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  color: theme.palette.info.main,
                                  "&:hover": {
                                    bgcolor: alpha(theme.palette.info.main, 0.2),
                                  },
                                }}
                              >
                                <PrintIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* Delete Button */}
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => onDelete(emp.id)}
                                sx={{
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  color: theme.palette.error.main,
                                  "&:hover": {
                                    bgcolor: alpha(theme.palette.error.main, 0.2),
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* Action Menu (Alternative with dropdown) */}
                            <Tooltip title="More actions">
                              <IconButton
                                size="small"
                                onClick={(e) => handleActionClick(e, emp)}
                                sx={{
                                  bgcolor: alpha(theme.palette.grey[500], 0.1),
                                  color: theme.palette.grey[700],
                                  "&:hover": {
                                    bgcolor: alpha(theme.palette.grey[500], 0.2),
                                  },
                                }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : column.render ? (
                          column.render(emp[column.key], emp)
                        ) : (
                          <Typography variant="body2">
                            {emp[column.key] || "-"}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                    <PersonIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {searchQuery ? "No matching employees found" : "No employees yet"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {searchQuery ? "Try adjusting your search" : "Add your first employee to get started"}
                    </Typography>
                    {!searchQuery && onAddNew && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAddNew}
                      >
                        Add Employee
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredAndSortedData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        />
      </Paper>

      {/* Print Dialog - Simplified version */}
      <Dialog 
        open={printDialogOpen} 
        onClose={handlePrintClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          pb: 1
        }}>
          <Typography variant="h6" fontWeight="600">
            Print Employee Details
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          {selectedEmployee && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Are you ready to print details for <strong>{selectedEmployee.fullName}</strong>?
                </Typography>
              </Box>
              
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 3,
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Preview
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {selectedEmployee.fullName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>ID:</strong> {selectedEmployee.id}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>DOB:</strong> {selectedEmployee.dob}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Status:</strong> {selectedEmployee.isActive ? 'Active' : 'Inactive'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Gender:</strong> {selectedEmployee.gender || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Location:</strong> {selectedEmployee.state || 'N/A'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button 
            onClick={handlePrintClose}
            variant="outlined"
          >
            Cancel
          </Button>
          
          <Button 
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handleSimplePrint}
            sx={{
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Print Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
          }
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Employee</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handlePrint}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print Details</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => {
          // Export functionality
          alert("Export feature would be implemented here");
          handleActionClose();
        }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => {
          // Share functionality
          alert("Share feature would be implemented here");
          handleActionClose();
        }}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        
        <Box sx={{ my: 1, borderTop: 1, borderColor: 'divider' }} />
        
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Employee</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EmployeeTable;