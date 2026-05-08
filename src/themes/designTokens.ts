import { alpha, createTheme } from "@mui/material/styles";
import type { CSSProperties } from "react";
import { SpaceTheme } from "./spaceThemes";

export const cssVariablesFromTheme = (theme: SpaceTheme) =>
  ({
    "--app-bg": theme.surface.canvas,
    "--app-bg-soft": theme.background.secondary,
    "--app-bg-gradient": theme.background.gradient,
    "--app-surface": theme.surface.paper,
    "--app-surface-raised": theme.surface.raised,
    "--app-surface-inset": theme.surface.inset,
    "--app-surface-nav": theme.surface.nav,
    "--app-overlay": theme.surface.overlay,
    "--app-border-subtle": theme.border.subtle,
    "--app-border": theme.border.default,
    "--app-border-strong": theme.border.strong,
    "--app-text": theme.text.primary,
    "--app-text-muted": theme.text.secondary,
    "--app-text-faint": theme.text.tertiary,
    "--app-text-inverse": theme.text.inverse,
    "--app-accent": theme.accent.primary,
    "--app-accent-2": theme.accent.secondary,
    "--app-accent-3": theme.accent.tertiary,
    "--app-accent-soft": theme.accent.soft,
    "--app-positive": theme.status.positive,
    "--app-negative": theme.status.negative,
    "--app-warning": theme.status.warning,
    "--app-info": theme.status.info,
    "--app-shadow-sm": theme.shadow.sm,
    "--app-shadow-md": theme.shadow.md,
    "--app-shadow-lg": theme.shadow.lg,
    "--app-radius": `${theme.shape.borderRadius}px`,
    "--app-motion-fast": theme.motion.fast,
    "--app-motion-base": theme.motion.base,
    "--app-motion-slow": theme.motion.slow,
    "--app-motion-easing": theme.motion.easing,
  } as CSSProperties);

export const buildMuiTheme = (theme: SpaceTheme) =>
  createTheme({
    palette: {
      mode: theme.name.includes("Dark") ? "dark" : "light",
      primary: {
        main: theme.accent.primary,
        light: theme.accent.soft,
        dark: theme.accent.primary,
        contrastText: theme.text.inverse,
      },
      secondary: {
        main: theme.accent.secondary,
        contrastText: theme.text.inverse,
      },
      success: {
        main: theme.status.positive,
      },
      error: {
        main: theme.status.negative,
      },
      warning: {
        main: theme.status.warning,
      },
      info: {
        main: theme.status.info,
      },
      background: {
        default: theme.surface.canvas,
        paper: theme.surface.paper,
      },
      text: {
        primary: theme.text.primary,
        secondary: theme.text.secondary,
      },
      divider: theme.border.default,
    },
    typography: {
      fontFamily: theme.typography.fontFamily,
      h1: { fontWeight: theme.typography.fontWeights.heading },
      h2: { fontWeight: theme.typography.fontWeights.heading },
      h3: { fontWeight: theme.typography.fontWeights.heading },
      h4: { fontWeight: theme.typography.fontWeights.subheading },
      h5: { fontWeight: theme.typography.fontWeights.subheading },
      h6: { fontWeight: theme.typography.fontWeights.subheading },
      button: {
        fontWeight: theme.typography.fontWeights.button,
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: theme.shape.borderRadius,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: theme.background.gradient,
            color: theme.text.primary,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: theme.shape.borderRadius,
            boxShadow: "none",
            transition: `background-color ${theme.motion.base} ${theme.motion.easing}, border-color ${theme.motion.base} ${theme.motion.easing}, transform ${theme.motion.fast} ${theme.motion.easing}, box-shadow ${theme.motion.base} ${theme.motion.easing}`,
            "&:active": {
              transform: "scale(0.98)",
            },
          },
          contained: {
            boxShadow: `0 12px 28px ${alpha(theme.accent.primary, 0.22)}`,
            "&:hover": {
              boxShadow: `0 16px 34px ${alpha(theme.accent.primary, 0.28)}`,
            },
          },
          outlined: {
            borderColor: theme.border.strong,
            backgroundColor: alpha(theme.surface.paper, 0.46),
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.border.subtle}`,
            boxShadow: theme.shadow.sm,
            backgroundImage: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          elevation1: {
            boxShadow: theme.shadow.sm,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.surface.paper,
            transition: `box-shadow ${theme.motion.base} ${theme.motion.easing}, border-color ${theme.motion.base} ${theme.motion.easing}`,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.border.strong,
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 4px ${alpha(theme.accent.primary, 0.12)}`,
            },
          },
          notchedOutline: {
            borderColor: theme.border.default,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottomColor: theme.border.subtle,
          },
          head: {
            color: theme.text.secondary,
            fontWeight: theme.typography.fontWeights.subheading,
            backgroundColor: theme.surface.inset,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: theme.shape.borderRadius,
          },
        },
      },
    },
  });
