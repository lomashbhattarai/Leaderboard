import React from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';
import { 
  People as PeopleIcon, 
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  SwapHoriz as SwapHorizIcon 
} from '@mui/icons-material';
import { useAdminDashboardStats } from '../api/queries/useAdmin';

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box sx={{ 
          bgcolor: color, 
          borderRadius: '50%', 
          width: 48, 
          height: 48, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white'
        }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" component="div" fontWeight="bold" color={color}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        {title}
      </Typography>
    </CardContent>
  </Card>
);

export default function AdminStatsCards() {
  const { data: stats, isLoading, error } = useAdminDashboardStats();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">Failed to load dashboard statistics</Typography>
      </Box>
    );
  }

  if (!stats) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Active Users (30 days)"
          value={stats.activeUsers}
          icon={<PeopleIcon />}
          color="#4caf50"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Weekly Logins"
          value={stats.weeklyLogins}
          icon={<TrendingUpIcon />}
          color="#2196f3"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<PeopleIcon />}
          color="#ff9800"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Portfolios"
          value={stats.totalPortfolios}
          icon={<AccountBalanceIcon />}
          color="#9c27b0"
        />
      </Grid>
    </Grid>
  );
}
