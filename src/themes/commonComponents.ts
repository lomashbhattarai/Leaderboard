import { SpaceTheme } from './spaceThemes';
import { alpha } from '@mui/material/styles';

export const getCommonStyles = (theme: SpaceTheme) => ({
  paper: {
    ...(theme.name === 'Default Theme' ? {
      background: '#ffffff',
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
    } : {
      background: alpha(theme.background.secondary, 0.85),
      color: theme.accent.primary,
      backdropFilter: 'blur(8px)',
      boxShadow: `0 4px 20px ${alpha(theme.background.primary, 0.3)}`,
    }),
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.name === 'Default Theme' 
        ? '0 4px 6px rgba(0, 0, 0, 0.15)'
        : `0 6px 25px ${alpha(theme.background.primary, 0.4)}`,
    },
  },
  table: {
    container: {
      ...(theme.name === 'Default Theme' ? {
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
      } : {
        background: alpha(theme.background.secondary, 0.85),
        backdropFilter: 'blur(8px)',
        boxShadow: `0 4px 20px ${alpha(theme.background.primary, 0.2)}`,
      }),
      borderRadius: '12px',
      overflow: 'hidden',
    },
    header: {
      ...(theme.name === 'Default Theme' ? {
        background: '#f5f5f5',
        color: 'rgba(0, 0, 0, 0.87)',
      } : {
        background: alpha(theme.background.primary, 0.95),
        color: theme.accent.secondary,
      }),
      fontWeight: 600,
      fontSize: '0.95rem',
      borderBottom: theme.name === 'Default Theme'
        ? '1px solid rgba(0, 0, 0, 0.12)'
        : `2px solid ${alpha(theme.accent.secondary, 0.2)}`,
    },
    row: {
      background: 'transparent',
      borderBottom: `1px solid ${alpha(theme.background.primary, 0.1)}`,
      transition: 'background-color 0.2s ease',
      '&:hover': {
        background: alpha(theme.background.primary, 0.15),
      },
      '&:last-child': {
        borderBottom: 'none',
      },
    },
    cell: {
      ...(theme.name === 'Default Theme' ? {
        color: 'rgba(0, 0, 0, 0.87)',
      } : {
        color: theme.accent.primary,
      }),
      padding: '12px 16px',
      fontSize: '0.9rem',
      lineHeight: 1.5,
    },
    footer: {
      background: alpha(theme.background.primary, 0.05),
      borderTop: `2px solid ${alpha(theme.accent.secondary, 0.1)}`,
      fontWeight: 500,
    },
  },
  tooltip: {
    background: alpha(theme.background.primary, 0.98),
    color: theme.accent.primary,
    border: `1px solid ${alpha(theme.accent.secondary, 0.15)}`,
    boxShadow: `0 4px 15px ${alpha(theme.background.primary, 0.3)}`,
    fontSize: '0.85rem',
    padding: '8px 12px',
    maxWidth: '250px',
    lineHeight: 1.4,
  },
  // Add specific styles for interactive elements
  interactive: {
    button: {
      background: alpha(theme.accent.primary, 0.15),
      color: theme.accent.primary,
      transition: 'all 0.2s ease',
      '&:hover': {
        background: alpha(theme.accent.primary, 0.25),
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },
    icon: {
      color: alpha(theme.accent.primary, 0.7),
      transition: 'color 0.2s ease',
      '&:hover': {
        color: theme.accent.primary,
    },
    },
  },
  // Add styles for content grouping
  contentGroup: {
    background: alpha(theme.background.secondary, 0.4),
    borderRadius: '8px',
    padding: '16px',
    margin: '8px 0',
    border: `1px solid ${alpha(theme.accent.secondary, 0.1)}`,
  },
}); 