import { alpha } from '@mui/material/styles';

export interface SpaceTheme {
  name: string;
  background: {
    primary: string;
    secondary: string;
  };
  stars: {
    color: string;
    density: number;
  };
  accent: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  typography: {
    fontFamily: string;
    fontWeights: {
      heading: number;
      subheading: number;
      button: number;
    };
  };
  shape: {
    borderRadius: number;
  };
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: number,
          padding: string,
        },
        contained: {
          boxShadow: string,
          backgroundColor: string,
          "&:hover": {
            boxShadow: string,
          },
        },
      },
    },
    card: {
      shadow: string;
      borderRadius: number;
    },
    table: {
      headerBg: string;
      padding: string;
      headerFontWeight: number;
    },
  };
}

export const spaceThemes: Record<string, SpaceTheme> = {
  none: {
    name: 'Default Theme',
    background: {
      primary: '#f8fafc',  // slate-50 (matches theme.palette.background.default)
      secondary: '#ffffff', // matches theme.palette.background.paper
    },
    stars: {
      color: 'transparent',
      density: 0,
    },
    accent: {
      primary: '#10b981',  // emerald-500 (matches theme.palette.primary.main)
      secondary: '#34d399', // emerald-400 (matches theme.palette.primary.light)
    },
    text: {
      primary: '#0f172a',  // slate-900 (matches theme.palette.text.primary)
      secondary: '#64748b', // slate-500 (matches theme.palette.text.secondary)
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeights: {
        heading: 700,      // h1, h2
        subheading: 600,   // h3-h6
        button: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px",
          },
          contained: {
            boxShadow: "none",
            backgroundColor: "#38bdf8",
            "&:hover": {
              boxShadow: "none",
            },

          },
        },
      },
      card: {
        shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        borderRadius: 12,
      },
      table: {
        headerBg: '#f8fafc',  // slate-50
        padding: '16px',
        headerFontWeight: 600,
      },
    },
  },
  nebula: {
    name: 'Dark Theme',
    background: {
      primary: '#121212',  // Material UI dark theme background
      secondary: '#1e1e1e', // Slightly lighter dark background
    },
    stars: {
      color: 'transparent',
      density: 0,
    },
    accent: {
      primary: '#90caf9',  // Light blue for primary actions
      secondary: '#64b5f6', // Slightly darker blue for secondary actions
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeights: {
        heading: 700,
        subheading: 600,
        button: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px",
          },
          contained: {
            boxShadow: "none",
            backgroundColor: "#90caf9",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      card: {
        shadow: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        borderRadius: 12,
      },
      table: {
        headerBg: '#1e1e1e',
        padding: '16px',
        headerFontWeight: 600,
      },
    },
  },
}; 