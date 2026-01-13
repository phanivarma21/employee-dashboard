import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import SideNav from "../../components/layout/Sidebar";
import {
  People,
  PersonAdd,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newHires: 0,
  });

  // Load employees from localStorage directly
  useEffect(() => {
    const loadEmployees = () => {
      try {
        const saved = localStorage.getItem("employees");
        if (saved) {
          const parsed = JSON.parse(saved);
          setEmployees(parsed);
        }
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };

    // Load immediately
    loadEmployees();

    // Listen for storage events (when data changes in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "employees") {
        loadEmployees();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically (optional, for same-tab updates)
    const interval = setInterval(loadEmployees, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Calculate stats whenever employees change
  useEffect(() => {
    console.log("Dashboard: Calculating stats for", employees.length, "employees");
    
    const total = employees.length;
    const active = employees.filter(emp => emp.isActive === true).length;
    const inactive = employees.filter(emp => emp.isActive === false).length;
    
    const newHires = employees.filter(emp => {
      if (!emp.hireDate) return false;
      const hireDate = new Date(emp.hireDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return hireDate > thirtyDaysAgo;
    }).length;

    setStats({
      total,
      active,
      inactive,
      newHires,
    });
  }, [employees]);

  const statCards = [
    {
      title: "Total Employees",
      value: stats.total,
      icon: <People sx={{ fontSize: 32 }} />,
      color: "#1976d2",
      bgColor: "#e3f2fd",
    },
    {
      title: "Active Employees",
      value: stats.active,
      icon: <CheckCircle sx={{ fontSize: 32 }} />,
      color: "#2e7d32",
      bgColor: "#e8f5e9",
    },
    {
      title: "Inactive Employees",
      value: stats.inactive,
      icon: <Cancel sx={{ fontSize: 32 }} />,
      color: "#d32f2f",
      bgColor: "#ffebee",
    },
    {
      title: "New Hires (30 days)",
      value: stats.newHires,
      icon: <PersonAdd sx={{ fontSize: 32 }} />,
      color: "#ed6c02",
      bgColor: "#fff3e0",
    },
  ];

  const HEADER_HEIGHT = 64;
  const FOOTER_HEIGHT = 80;

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
          overflowX: "auto",
          scrollBehavior:"smooth"
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
            {/* Professional Dashboard Title */}
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
                }}
              >
                Dashboard Overview
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#666",
                  mt: 0.5,
                  fontSize: "0.875rem",
                }}
              >
                Real-time insights and employee statistics
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {statCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      width: "100%",
                      minHeight: "180px",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        mb: 2
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              fontSize: "0.75rem",
                              mb: 1
                            }}
                          >
                            {card.title}
                          </Typography>
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              fontWeight: 800,
                              color: card.color,
                              lineHeight: 1
                            }}
                          >
                            {card.value}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          bgcolor: card.bgColor,
                          color: card.color,
                          p: 1.2, 
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          ml: 2,
                          flexShrink: 0
                        }}>
                          {card.icon}
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: "text.secondary",
                          fontSize: "0.7rem",
                          display: "block",
                          mt: 1
                        }}
                      >
                        {employees.length > 0 ? "Updated just now" : "No data"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
                fontWeight: 700,
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
                Total: <strong>{stats.total}</strong> • Active: <strong>{stats.active}</strong> • Inactive: <strong>{stats.inactive}</strong>
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
