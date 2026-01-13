import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Typography,
  Box,
  Collapse,
  Divider,
  useTheme,
  alpha,
  Avatar,
  Chip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dashboard,
  People,
  Business,
  Assignment,
  AttachMoney,
  Analytics,
  Settings,
  ExpandLess,
  ExpandMore,
  Home,
  CalendarToday,
  Folder,
  Chat,
  Help,
  Star,
  Logout,
  BusinessCenter,
} from "@mui/icons-material";

const drawerWidth = 240;

const SideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [openMenus, setOpenMenus] = useState({});

  // Navigation items - only Dashboard and Employees as requested
  const navItems = [
    {
      title: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
    },
    {
      title: "Employees",
      icon: <People />,
      path: "/employees",
    },
  ];

  const handleMenuToggle = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Your logout logic here
    console.log("Logging out...");
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const renderNavItem = (item) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isItemActive = isActive(item.path);
    const isMenuOpen = openMenus[item.title];

    return (
      <React.Fragment key={item.title}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() =>
              hasSubItems ? handleMenuToggle(item.title) : handleNavigation(item.path)
            }
            sx={{
              py: 1.25,
              px: 2,
              borderRadius: 1,
              mx: 1,
              background: isItemActive
                ? alpha(theme.palette.primary.main, 0.1)
                : "transparent",
              borderLeft: isItemActive
                ? `3px solid ${theme.palette.primary.main}`
                : "3px solid transparent",
              "&:hover": {
                background: isItemActive
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.action.hover, 0.05),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: isItemActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isItemActive ? 600 : 400,
                    color: isItemActive
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                >
                  {item.title}
                </Typography>
              }
            />
            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                color={item.badge === "New" ? "primary" : "default"}
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                }}
              />
            )}
            {hasSubItems && (
              <Box sx={{ ml: 1 }}>
                {isMenuOpen ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </Box>
            )}
          </ListItemButton>
        </ListItem>

        {hasSubItems && (
          <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem) => (
                <ListItem key={subItem.title} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(subItem.path)}
                    sx={{
                      py: 1,
                      pl: 7,
                      pr: 2,
                      borderRadius: 1,
                      mx: 1,
                      "&:hover": {
                        background: alpha(theme.palette.action.hover, 0.05),
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: isActive(subItem.path)
                              ? theme.palette.primary.main
                              : theme.palette.text.secondary,
                            fontSize: "0.875rem",
                          }}
                        >
                          {subItem.title}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Toolbar />
      
      {/* User Info */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src="https://i.pravatar.cc/150?img=8"
            alt="Admin"
            sx={{
              width: 48,
              height: 48,
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Alex Johnson
            </Typography>
            <Typography variant="caption" color="text.secondary">
              HR Manager
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label="Premium"
            size="small"
            color="warning"
            variant="outlined"
            icon={<Star sx={{ fontSize: 14 }} />}
          />
          <Chip label="Admin" size="small" color="primary" variant="outlined" />
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        {navItems.map((item) => renderNavItem(item))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Logout Button Section */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 2,
            background: alpha(theme.palette.error.main, 0.05),
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            "&:hover": {
              background: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: theme.palette.error.main }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.error.main 
                }}
              >
                Logout
              </Typography>
            }
            secondary={
              <Typography variant="caption" color="text.secondary">
                Sign out of your account
              </Typography>
            }
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default SideNav;