// components/layout/MainLayout.jsx
import React from "react";
import { Box } from "@mui/material";
import SideNav from "../SideNav/SideNav";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SideNav />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: "#f8fafc",
            mt: 8, // Account for header height
            ml: { md: "240px" }, // Account for sidebar width
            width: { md: `calc(100% - 240px)` },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;