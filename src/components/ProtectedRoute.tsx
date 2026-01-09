import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { Box, Typography, Paper } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if admin access is required
  if (requireAdmin) {
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
    
    if (!isAdmin) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
          p={3}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              maxWidth: 500, 
              textAlign: 'center',
              bgcolor: 'background.paper'
            }}
          >
            <LockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You don't have permission to access this page. Admin privileges are required.
            </Typography>
          </Paper>
        </Box>
      );
    }
  }

  return <>{children}</>;
}
