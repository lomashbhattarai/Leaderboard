import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import AdminStatsCards from '../components/AdminStatsCards';
import TopUsersTable from '../components/TopUsersTable';
import NepseFetchMonitor from '../components/NepseFetchMonitor';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';

export default function AdminDashboard() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <AdminIcon fontSize="large" color="primary" />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Admin Dashboard
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Monitor user activity, system health, and manage NEPSE data fetching
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12}>
          <AdminStatsCards />
        </Grid>

        {/* NEPSE Fetch Monitor */}
        <Grid item xs={12}>
          <NepseFetchMonitor />
        </Grid>

        {/* Top Users Table */}
        <Grid item xs={12}>
          <TopUsersTable />
        </Grid>
      </Grid>
    </Container>
  );
}
