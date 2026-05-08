import { SpaceTheme } from './spaceThemes';
import { alpha } from '@mui/material/styles';

export const getCommonStyles = (theme: SpaceTheme) => ({
  paper: {
    background: theme.surface.paper,
    color: theme.text.primary,
    border: `1px solid ${theme.border.subtle}`,
    boxShadow: theme.shadow.sm,
    transition: `transform ${theme.motion.base} ${theme.motion.easing}, box-shadow ${theme.motion.base} ${theme.motion.easing}, border-color ${theme.motion.base} ${theme.motion.easing}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      borderColor: theme.border.default,
      boxShadow: theme.shadow.md,
    },
  },
  table: {
    container: {
      background: theme.surface.paper,
      border: `1px solid ${theme.border.subtle}`,
      boxShadow: theme.shadow.sm,
      borderRadius: `${theme.shape.borderRadius}px`,
      overflow: 'hidden',
    },
    header: {
      background: theme.surface.inset,
      color: theme.text.secondary,
      fontWeight: theme.typography.fontWeights.subheading,
      fontSize: '0.95rem',
      borderBottom: `1px solid ${theme.border.default}`,
    },
    row: {
      background: 'transparent',
      borderBottom: `1px solid ${theme.border.subtle}`,
      transition: `background-color ${theme.motion.base} ${theme.motion.easing}`,
      '&:hover': {
        background: alpha(theme.accent.primary, 0.06),
      },
      '&:last-child': {
        borderBottom: 'none',
      },
    },
    cell: {
      color: theme.text.primary,
      padding: '12px 16px',
      fontSize: '0.9rem',
      lineHeight: 1.5,
    },
    footer: {
      background: theme.surface.inset,
      borderTop: `1px solid ${theme.border.default}`,
      fontWeight: 500,
    },
  },
  tooltip: {
    background: theme.surface.overlay,
    color: theme.text.primary,
    border: `1px solid ${theme.border.default}`,
    boxShadow: theme.shadow.md,
    fontSize: '0.85rem',
    padding: '8px 12px',
    maxWidth: '250px',
    lineHeight: 1.4,
  },
  // Add specific styles for interactive elements
  interactive: {
    button: {
      background: alpha(theme.accent.primary, 0.1),
      color: theme.accent.primary,
      transition: `all ${theme.motion.base} ${theme.motion.easing}`,
      '&:hover': {
        background: alpha(theme.accent.primary, 0.16),
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },
    icon: {
      color: alpha(theme.accent.primary, 0.7),
      transition: `color ${theme.motion.base} ${theme.motion.easing}`,
      '&:hover': {
        color: theme.accent.primary,
    },
    },
  },
  // Add styles for content grouping
  contentGroup: {
    background: theme.surface.inset,
    borderRadius: `${theme.shape.borderRadius}px`,
    padding: '16px',
    margin: '8px 0',
    border: `1px solid ${theme.border.subtle}`,
  },
}); 
