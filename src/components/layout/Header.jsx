import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  IconButton,
  useTheme,
  alpha,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/storage";
import {
  Logout,
  Settings,
  AccountCircle,
  Notifications,
  ArrowDropDown,
  Dashboard,
} from "@mui/icons-material";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@company.com",
    role: "HR Manager",
    avatar: "https://i.pravatar.cc/150?img=8",
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: "New employee registration", time: "5 min ago", read: false },
    { id: 2, text: "Salary review pending", time: "1 hour ago", read: false },
    { id: 3, text: "Leave request approved", time: "2 hours ago", read: true },
  ];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleProfileMenuClose();
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
        width: { md: `calc(100% - 240px)` },
        ml: { md: "240px" },
      }}
    >
      <Toolbar sx={{ 
        minHeight: 70, 
        px: { xs: 2, md: 3 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {/* Left Section - Logo/Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              letterSpacing: "-0.5px",
              position: "relative",
              right:"200px"
            }}
          >
            BookXpert
          </Typography>

        </Box>

        {/* Right Section - User Info & Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Notifications */}
          <IconButton
            onClick={handleNotificationsOpen}
            sx={{
              color: theme.palette.text.secondary,
              background: alpha(theme.palette.action.hover, 0.1),
              "&:hover": {
                background: alpha(theme.palette.action.hover, 0.2),
              },
              width: 40,
              height: 40,
              borderRadius: 2,
            }}
          >
            <Badge
              badgeContent={unreadNotifications}
              color="error"
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: 10,
                  height: 18,
                  minWidth: 18,
                },
              }}
            >
              <Notifications fontSize="small" />
            </Badge>
          </IconButton>

          {/* User Profile */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              p: 1,
              borderRadius: 2,
              "&:hover": {
                background: alpha(theme.palette.action.hover, 0.1),
              },
            }}
            onClick={handleProfileMenuOpen}
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                width: 36,
                height: 36,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            />
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "text.primary", fontWeight: 600, lineHeight: 1.2 }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.7rem",
                }}
              >
                {user.role}
              </Typography>
            </Box>
            <ArrowDropDown sx={{ color: theme.palette.text.secondary }} />
          </Box>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationsAnchor}
            open={Boolean(notificationsAnchor)}
            onClose={handleNotificationsClose}
            PaperProps={{
              elevation: 3,
              sx: {
                width: 320,
                maxHeight: 400,
                mt: 1,
                borderRadius: 2,
                overflow: "hidden",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {unreadNotifications} unread messages
              </Typography>
            </Box>
            <Box sx={{ maxHeight: 300, overflow: "auto" }}>
              {notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderLeft: notification.read
                      ? "none"
                      : `3px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {notification.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {notification.time}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Box>
            <Divider />
            <MenuItem sx={{ justifyContent: "center", py: 1.5 }}>
              <Typography variant="body2" color="primary">
                View All Notifications
              </Typography>
            </MenuItem>
          </Menu>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                width: 260,
                mt: 1,
                borderRadius: 2,
                overflow: "hidden",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* Profile Header */}
            <Box sx={{ p: 2, background: alpha(theme.palette.primary.main, 0.05) }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Menu Items */}
            <MenuItem onClick={() => navigate("/dashboard")}>
              <ListItemIcon>
                <Dashboard fontSize="small" />
              </ListItemIcon>
              Dashboard
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "error.main",
                "&:hover": {
                  background: alpha(theme.palette.error.main, 0.1),
                },
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;