import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
  Sync as RetryingIcon,
} from '@mui/icons-material';
import { useLatestNepseStatus, useNepseLogs, useTriggerNepseFetch } from '../api/queries/useAdmin';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const configs = {
    success: { icon: <SuccessIcon fontSize="small" />, color: 'success' as const, label: 'Success' },
    failed: { icon: <ErrorIcon fontSize="small" />, color: 'error' as const, label: 'Failed' },
    pending: { icon: <PendingIcon fontSize="small" />, color: 'warning' as const, label: 'Pending' },
    retrying: { icon: <RetryingIcon fontSize="small" />, color: 'info' as const, label: 'Retrying' },
  };

  const config = configs[status as keyof typeof configs] || configs.pending;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
    />
  );
};

export default function NepseFetchMonitor() {
  const { data: latestStatus, isLoading: latestLoading } = useLatestNepseStatus();
  const { data: logs, isLoading: logsLoading } = useNepseLogs(10);
  const triggerFetch = useTriggerNepseFetch();

  const handleTriggerFetch = async () => {
    try {
      await triggerFetch.mutateAsync();
      toast.success('NEPSE data fetch triggered successfully!');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to trigger NEPSE data fetch';
      toast.error(errorMsg);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              NEPSE Data Fetch Monitor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor and control NEPSE stock data fetching
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={triggerFetch.isPending ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
            onClick={handleTriggerFetch}
            disabled={triggerFetch.isPending || latestStatus?.status === 'pending' || latestStatus?.status === 'retrying'}
          >
            {triggerFetch.isPending ? 'Triggering...' : 'Manual Trigger'}
          </Button>
        </Box>

        {/* Latest Status */}
        {latestLoading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={30} />
          </Box>
        ) : latestStatus && latestStatus.startedAt ? (
          <Box mb={3}>
            <Alert 
              severity={
                latestStatus.status === 'success' ? 'success' : 
                latestStatus.status === 'failed' ? 'error' : 
                'info'
              }
              icon={false}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Latest Fetch Status
                  </Typography>
                  <Typography variant="body2">
                    Date: {latestStatus.fetchDate} • 
                    Started: {formatDistanceToNow(new Date(latestStatus.startedAt), { addSuffix: true })}
                    {latestStatus.duration && ` • Duration: ${formatDuration(latestStatus.duration)}`}
                  </Typography>
                  {latestStatus.triggeredBy && (
                    <Typography variant="caption">
                      Triggered by: {latestStatus.triggeredBy.email}
                    </Typography>
                  )}
                  {latestStatus.errorMessage && (
                    <Typography variant="body2" color="error" mt={1}>
                      Error: {latestStatus.errorMessage}
                    </Typography>
                  )}
                </Box>
                <StatusChip status={latestStatus.status} />
              </Box>
            </Alert>
          </Box>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            No fetch logs available yet
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Recent Logs Table */}
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Recent Fetch History
        </Typography>
        
        {logsLoading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Attempts</strong></TableCell>
                  <TableCell><strong>Duration</strong></TableCell>
                  <TableCell><strong>Started</strong></TableCell>
                  <TableCell><strong>Triggered By</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs && logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.fetchDate || '-'}</TableCell>
                      <TableCell>
                        <StatusChip status={log.status} />
                      </TableCell>
                      <TableCell>{log.attemptNumber}</TableCell>
                      <TableCell>{formatDuration(log.duration)}</TableCell>
                      <TableCell>
                        {log.startedAt ? format(new Date(log.startedAt), 'MMM dd, HH:mm') : '-'}
                      </TableCell>
                      <TableCell>
                        {log.triggeredBy ? (
                          <Chip 
                            label={log.triggeredBy.email} 
                            size="small" 
                            variant="outlined"
                          />
                        ) : (
                          <Chip label="Automated" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">No fetch logs found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
