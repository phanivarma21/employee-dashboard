import { 
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert,
  Avatar,
  Chip,
  useTheme,
  IconButton
} from "@mui/material";
import { useState, useEffect } from "react"; // Add useEffect
import Header from "../../components/layout/Header";
import SideNav from "../../components/layout/Sidebar";
import useEmployees from "../../hooks/useEmployees";
import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";

const EmployeeList = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [viewImageDialog, setViewImageDialog] = useState(null);
  
  const theme = useTheme();

  const HEADER_HEIGHT = 64;
  const FOOTER_HEIGHT = 80;

  // Add debug logging
  useEffect(() => {
    console.log("Employees data in EmployeeList:", employees);
    employees.forEach((emp, index) => {
      console.log(`Employee ${index}:`, {
        id: emp.id,
        name: emp.fullName,
        hasProfileImage: !!emp.profileImage,
        profileImage: emp.profileImage,
        profileImageType: typeof emp.profileImage
      });
    });
  }, [employees]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (employee) => {
    console.log("Editing employee:", employee);
    console.log("Employee profileImage:", employee.profileImage);
    setEditing(employee);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  // Function to handle image view
  const handleViewImage = (employee) => {
    console.log("Viewing image for employee:", employee);
    console.log("Profile image URL:", employee.profileImage);
    setViewImageDialog(employee);
  };

  // Helper function to get profile image URL
  const getProfileImageUrl = (employee) => {
    if (!employee?.imageUrl) return null;
    
    const imageUrl = employee.imageUrl;
    
    // If it's a base64 string
    if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
      return imageUrl;
    }
    
    // If it's a file object (from form)
    if (imageUrl instanceof File) {
      return URL.createObjectURL(imageUrl);
    }
    
    // If it's already a URL string
    if (typeof imageUrl === 'string') {
      // Check if it's a valid URL or base64
      if (imageUrl.startsWith('http') || imageUrl.startsWith('/') || imageUrl.startsWith('data:')) {
        return imageUrl;
      }
    }
    
    return null;
  };

  const columns = [
    {
      key: "id", 
      label: "ID",
      sortable: true,
    },
    { 
      key: "imageUrl", 
      label: "PROFILE",
      sortable: false,
      width: 120,
      render: (value, emp) => {
        const imageUrl = getProfileImageUrl(emp);
        console.log(`Rendering profile for ${emp.fullName}:`, imageUrl);
        
        return (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ position: "relative", width: 120, height: 50 }}>
              {imageUrl ? (
                <>
                  <Avatar
                    src={imageUrl}
                    sx={{ 
                      width: 50, 
                      height: 50,
                      border: `2px solid ${theme.palette.primary.main}`,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.9,
                        transform: "scale(1.05)",
                        transition: "all 0.2s ease-in-out"
                      }
                    }}
                    onClick={() => handleViewImage(emp)}
                    onError={(e) => {
                      console.error("Error loading image for:", emp.fullName, imageUrl);
                      e.target.style.display = 'none';
                    }}
                  />
                </>
              ) : (
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.grey[300], 
                    width: 50, 
                    height: 50,
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: theme.palette.grey[400],
                    }
                  }}
                  onClick={() => handleViewImage(emp)}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
              )}
            </Box>
          </Box>
        );
      }
    },
    { 
      key: "fullName", 
      label: "EMPLOYEE NAME",
      sortable: true,
      render: (value, emp) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.primary.main, 
              width: 36, 
              height: 36,
              fontSize: "0.95rem",
              fontWeight: 600,
              display: { xs: 'flex', md: 'none' }
            }}
          >
            {emp.fullName ? emp.fullName.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.25 }}>
              {emp.fullName || "N/A"}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      key: "gender", 
      label: "GENDER",
      sortable: true,
      render: (value) => (
        <Chip
          label={value || "N/A"}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 500,
            fontSize: "0.75rem",
            borderColor: value === "Male" ? theme.palette.info.main : theme.palette.secondary.main,
            color: value === "Male" ? theme.palette.info.main : theme.palette.secondary.main,
          }}
        />
      )
    },
    { 
      key: "state", 
      label: "LOCATION",
      sortable: true,
      render: (value) => (
        <Typography variant="body2" fontWeight="500">
          {value || "N/A"}
        </Typography>
      )
    },
    { 
      key: "dob", 
      label: "DATE OF BIRTH",
      sortable: true,
      render: (value) => (
        <Typography variant="body2" fontWeight="500">
          {value || "N/A"}
        </Typography>
      )
    },
    { 
      key: "isActive", 
      label: "STATUS",
      sortable: false,
      render: (value) => (
        <Chip
          label={value ? "Active" : "Inactive"}
          size="small"
          color={value ? "success" : "error"}
          sx={{ 
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 24,
          }}
        />
      )
    },
    { 
      key: "actions", 
      label: "ACTIONS",
      sortable: false,
      align: "center",
      width: 180,
    },
  ];

  const handleSave = (formData) => {
    try {
      console.log("Saving form data:", formData);
      console.log("Form data profileImage:", formData.profileImage);
      
      if (editing?.id) {
        updateEmployee({ ...formData, id: editing.id });
        showSnackbar("Employee updated successfully!");
      } else {
        addEmployee(formData);
        showSnackbar("Employee added successfully!");
      }
      handleCloseForm();
      
      // Force refresh
      setTimeout(() => {
        console.log("Employees after save:", employees);
      }, 500);
    } catch (error) {
      console.error("Error saving employee:", error);
      showSnackbar("Error saving employee: " + error.message, "error");
    }
  };

  const handleDeleteConfirm = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    setDeleteDialog(employee);
  };

  const handleDelete = () => {
    if (deleteDialog) {
      deleteEmployee(deleteDialog.id);
      setDeleteDialog(null);
      showSnackbar("Employee deleted successfully!");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* Fixed Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: HEADER_HEIGHT,
          zIndex: 1200,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Header />
      </Box>

      {/* Main container with Sidebar and Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          width: "100%",
          height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <Box
          component="nav"
          sx={{
            width: "240px",
            flexShrink: 0,
            height: "100%",
            borderRight: "1px solid #e0e0e0",
            backgroundColor: "#fff",
            overflowY: "auto",
          }}
        >
          <SideNav />
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100%",
            overflowY: "auto",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              minHeight: "100%",
              backgroundColor: "#f5f5f5",
              p: 3,
            }}
          >
            {/* Professional Title */}
            <Box
              sx={{
                mb: 4,
                pb: 2,
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600,
                  color: "#1a1a1a",
                  fontSize: "1.75rem",
                  letterSpacing: "-0.5px",
                  textAlign: "left",
                }}
              >
                Employee Management
              </Typography>
            </Box>

            {/* Employee Table */}
            <EmployeeTable
              data={employees}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
              onAddNew={handleAddNew}
            />
          </Paper>
        </Box>
      </Box>

      {/* Fixed Footer */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: "240px",
          width: "calc(100% - 240px)",
          height: FOOTER_HEIGHT,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          zIndex: 1200,
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            px: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: "white",
                fontSize: "1.125rem",
                mb: 0.5,
              }}
            >
              Welcome to Employee Management System
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "0.875rem",
              }}
            >
              Manage all employee records, track their status, and maintain organized workforce data efficiently. 
              <Box component="span" sx={{ ml: 2, fontWeight: 600 }}>
                Total Employees: <strong>{employees.length}</strong>
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Employee Form Dialog */}
      <EmployeeForm
        data={editing}
        onClose={handleCloseForm}
        onSave={handleSave}
        open={formOpen}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!deleteDialog} 
        onClose={() => setDeleteDialog(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteDialog?.fullName}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setDeleteDialog(null)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Image View Dialog */}
      <Dialog 
        open={!!viewImageDialog} 
        onClose={() => setViewImageDialog(null)}
        maxWidth="md"
        PaperProps={{
          sx: { 
            borderRadius: 3,
            overflow: "hidden",
            maxWidth: "90vw",
            maxHeight: "90vh"
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          backgroundColor: theme.palette.primary.main,
          color: "white"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar 
              src={getProfileImageUrl(viewImageDialog)}
              sx={{ 
                width: 40, 
                height: 40,
                border: "2px solid white"
              }}
            >
              <PersonIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {viewImageDialog?.fullName || "Employee"} - Profile Image
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {getProfileImageUrl(viewImageDialog) ? (
            <Box
              component="img"
              src={getProfileImageUrl(viewImageDialog)}
              alt={viewImageDialog?.fullName || "Employee"}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
              onError={(e) => {
                console.error("Error loading image in dialog:", getProfileImageUrl(viewImageDialog));
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <Box sx={{ textAlign: "center", py: 8, width: "100%" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: theme.palette.grey[300],
                  margin: "0 auto 20px",
                  fontSize: "3rem",
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                No Profile Image
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {viewImageDialog?.fullName || "This employee"} doesn't have a profile image uploaded yet.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button 
            onClick={() => setViewImageDialog(null)}
            variant="contained"
            sx={{ minWidth: 120 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EmployeeList;