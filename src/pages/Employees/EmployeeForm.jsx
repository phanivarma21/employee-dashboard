import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  Typography,
  InputAdornment,
  Switch,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

// Constants
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const STATES = [
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Maharashtra",
  "Delhi",
  "Gujarat",
  "Rajasthan",
  "West Bengal",
  "Kerala",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Punjab",
  "Haryana",
  "Bihar",
  "Odisha",
  "Assam",
  "Jammu and Kashmir",
  "Uttarakhand",
  "Himachal Pradesh"
];

// Validation messages
const VALIDATION_MESSAGES = {
  fullName: "Full name is required (min 2 characters)",
  gender: "Please select gender",
  dob: "Date of birth is required (must be at least 18 years old)",
  state: "Please select state",
  image: "Please upload a profile image",
};

const EmployeeForm = ({ data, onSave, onClose, open }) => {
  // Form state
  const [form, setForm] = useState({
    id: "",
    fullName: "",
    gender: "",
    dob: "",
    state: "",
    isActive: true,
  });

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize form when data changes or dialog opens
  useEffect(() => {
    if (data) {
      setForm({
        id: data.id || Date.now().toString(),
        fullName: data.fullName || "",
        gender: data.gender || "",
        dob: data.dob || "",
        state: data.state || "",
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
      
      // Set image preview if data has image
      if (data.imageUrl) {
        setImagePreview(data.imageUrl);
      } else if (data.avatar) {
        setImagePreview(data.avatar);
      }
    } else {
      resetForm();
    }
  }, [data, open]);

  const resetForm = () => {
    setForm({
      id: Date.now().toString(),
      fullName: "",
      gender: "",
      dob: "",
      state: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setErrors({});
    setTouched({});
  };

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.trim().length >= 2 ? "" : VALIDATION_MESSAGES.fullName;
      case "gender":
        return value ? "" : VALIDATION_MESSAGES.gender;
      case "dob":
        if (!value) return VALIDATION_MESSAGES.dob;
        const dobDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
          return age - 1 < 18 ? "Must be at least 18 years old" : "";
        }
        return age < 18 ? "Must be at least 18 years old" : "";
      case "state":
        return value ? "" : VALIDATION_MESSAGES.state;
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(form).forEach(key => {
      if (key !== 'id' && key !== 'isActive') {
        const error = validateField(key, form[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Image validation (only for new employees)
    if (!data && !imageFile && !imagePreview) {
      newErrors.image = VALIDATION_MESSAGES.image;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle field blur (touch)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, form[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, image: "Please select an image file" }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
      return;
    }

    setImageFile(file);
    setErrors(prev => ({ ...prev, image: "" }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, image: "Failed to read image" }));
      setIsUploading(false);
    };
    
    setIsUploading(true);
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setErrors(prev => ({ ...prev, image: !data ? VALIDATION_MESSAGES.image : "" }));
  };

  // Format date for display
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "";
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle form submission
  const handleSubmit = () => {
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(form).forEach(key => {
      if (key !== 'id' && key !== 'isActive') {
        allTouched[key] = true;
      }
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare form data with image
    const formData = {
      ...form,
      imageUrl: imagePreview || data?.imageUrl || data?.avatar || "",
      dob: form.dob,
    };

    // Call onSave with form data
    onSave(formData);
    
    // Reset form and close
    resetForm();
    onClose();
  };

  // Check if form is valid for submit button
  const isFormValid = () => {
    return (
      form.fullName.trim().length >= 2 &&
      form.gender &&
      form.dob &&
      form.state &&
      (data || imagePreview)
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          maxWidth: 600
        }
      }}
    >
      <DialogTitle sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        pb: 1,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="primary" />
          <Typography variant="h6" fontWeight="600">
            {data?.id ? "Edit Employee" : "Add New Employee"}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{
            '&:hover': { backgroundColor: 'action.hover' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Profile Image Upload Section */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            gap: 2,
            mb: 2 
          }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={imagePreview}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  border: imagePreview ? '3px solid' : '2px dashed',
                  borderColor: imagePreview ? 'primary.main' : 'divider',
                  bgcolor: imagePreview ? 'transparent' : 'action.hover',
                }}
              >
                {!imagePreview && <PersonIcon sx={{ fontSize: 40, color: 'action.active' }} />}
              </Avatar>
              
              {/* Upload Progress */}
              {isUploading && (
                <CircularProgress 
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -12,
                    marginLeft: -12,
                  }}
                />
              )}
            </Box>

            {/* Upload Controls */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              
              {imagePreview && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveImage}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>

            {/* Image Validation Error */}
            {errors.image && (
              <Typography 
                variant="caption" 
                color="error"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5 
                }}
              >
                <ErrorIcon fontSize="small" />
                {errors.image}
              </Typography>
            )}

            {/* Image Upload Hint */}
            {!imagePreview && !errors.image && (
              <Typography variant="caption" color="text.secondary" align="center">
                Recommended: Square image, max 5MB
              </Typography>
            )}
          </Box>

          {/* Form Fields */}
          <TextField
            label="Full Name"
            name="fullName"
            fullWidth
            required
            value={form.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            variant="outlined"
            error={!!errors.fullName && touched.fullName}
            helperText={touched.fullName && errors.fullName}
            placeholder="Enter employee's full name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl component="fieldset" error={!!errors.gender && touched.gender}>
            <FormLabel component="legend" required>
              Gender
            </FormLabel>
            <RadioGroup
              row
              name="gender"
              value={form.gender}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {GENDERS.map((gender) => (
                <FormControlLabel
                  key={gender}
                  value={gender}
                  control={<Radio />}
                  label={gender}
                />
              ))}
            </RadioGroup>
            {touched.gender && errors.gender && (
              <Typography variant="caption" color="error">
                {errors.gender}
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            fullWidth
            required
            value={form.dob}
            onChange={handleChange}
            onBlur={handleBlur}
            variant="outlined"
            error={!!errors.dob && touched.dob}
            helperText={
              touched.dob && errors.dob 
                ? errors.dob 
                : form.dob 
                  ? `Age: ${calculateAge(form.dob)} years` 
                  : "Must be at least 18 years old"
            }
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="State"
            name="state"
            fullWidth
            required
            value={form.state}
            onChange={handleChange}
            onBlur={handleBlur}
            variant="outlined"
            error={!!errors.state && touched.state}
            helperText={touched.state && errors.state}
          >
            <MenuItem value="">
              <em>Select State</em>
            </MenuItem>
            {STATES.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>

          {/* Status Toggle */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 2,
            border: 1,
            borderColor: form.isActive ? 'success.light' : 'error.light',
            borderRadius: 1,
            bgcolor: form.isActive ? 'success.lighter' : 'error.lighter'
          }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="600">
                Employee Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {form.isActive 
                  ? "Employee is currently active" 
                  : "Employee is currently inactive"}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {form.isActive ? (
                <CheckCircleIcon color="success" />
              ) : (
                <ErrorIcon color="error" />
              )}
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isActive}
                    onChange={(e) => setForm(prev => ({ 
                      ...prev, 
                      isActive: e.target.checked 
                    }))}
                    color={form.isActive ? "success" : "error"}
                  />
                }
                label={form.isActive ? "Active" : "Inactive"}
              />
            </Box>
          </Box>

          {/* Form Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <Box sx={{ 
              p: 2, 
              border: 1, 
              borderColor: 'error.main', 
              borderRadius: 1,
              bgcolor: 'error.lighter'
            }}>
              <Typography variant="subtitle2" color="error" gutterBottom>
                Please fix the following errors:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {Object.entries(errors)
                  .filter(([_, error]) => error)
                  .map(([field, error]) => (
                    <li key={field}>
                      <Typography variant="caption" color="error">
                        {error}
                      </Typography>
                    </li>
                  ))}
              </ul>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1, borderTop: 1, borderColor: 'divider' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            minWidth: 100,
            borderRadius: 1
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid()}
          sx={{ 
            minWidth: 100,
            borderRadius: 1
          }}
        >
          {data?.id ? "Update Employee" : "Save Employee"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;