export interface SpaceTheme {
  name: string;
  background: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  surface: {
    canvas: string;
    paper: string;
    raised: string;
    inset: string;
    nav: string;
    overlay: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
  };
  stars: {
    color: string;
    density: number;
  };
  accent: {
    primary: string;
    secondary: string;
    tertiary: string;
    soft: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  status: {
    positive: string;
    negative: string;
    warning: string;
    info: string;
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
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
  motion: {
    fast: string;
    base: string;
    slow: string;
    easing: string;
  };
  chart: {
    palette: string[];
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
    name: 'Family Light',
    background: {
      primary: '#FBFAF9',
      secondary: '#F6F4EF',
      gradient:
        'radial-gradient(circle at 18% 12%, rgba(216, 236, 252, 0.85), transparent 28%), linear-gradient(180deg, #FFFFFF 0%, #FBFAF9 38%, #F6F4EF 100%)',
    },
    surface: {
      canvas: '#FBFAF9',
      paper: '#FFFFFF',
      raised: '#FFFFFF',
      inset: '#F6F4EF',
      nav: 'rgba(255, 255, 255, 0.82)',
      overlay: 'rgba(255, 255, 255, 0.9)',
    },
    border: {
      subtle: 'rgba(23, 23, 23, 0.06)',
      default: 'rgba(23, 23, 23, 0.1)',
      strong: 'rgba(23, 23, 23, 0.18)',
    },
    stars: {
      color: 'transparent',
      density: 0,
    },
    accent: {
      primary: '#008CFF',
      secondary: '#34C759',
      tertiary: '#F966AC',
      soft: '#D8ECFC',
    },
    text: {
      primary: '#171717',
      secondary: '#747484',
      tertiary: '#B2A79A',
      inverse: '#FFFFFF',
    },
    status: {
      positive: '#00C454',
      negative: '#FF4E4E',
      warning: '#FFBE4C',
      info: '#1A88F8',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontWeights: {
        heading: 750,
        subheading: 650,
        button: 650,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadow: {
      sm: '0 1px 2px rgba(23, 23, 23, 0.05)',
      md: '0 10px 30px rgba(23, 23, 23, 0.08)',
      lg: '0 24px 70px rgba(23, 23, 23, 0.12)',
    },
    motion: {
      fast: '140ms',
      base: '220ms',
      slow: '360ms',
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    },
    chart: {
      palette: ['#008CFF', '#34C759', '#F966AC', '#FFBE4C', '#5F5DE7', '#FF5310'],
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px",
          },
          contained: {
            boxShadow: "0 10px 24px rgba(0, 140, 255, 0.22)",
            backgroundColor: "#008CFF",
            "&:hover": {
              boxShadow: "0 14px 30px rgba(0, 140, 255, 0.28)",
            },

          },
        },
      },
      card: {
        shadow: '0 10px 30px rgba(23, 23, 23, 0.08)',
        borderRadius: 8,
      },
      table: {
        headerBg: '#F6F4EF',
        padding: '16px',
        headerFontWeight: 650,
      },
    },
  },
  nebula: {
    name: 'Family Dark',
    background: {
      primary: '#121212',
      secondary: '#171717',
      gradient:
        'radial-gradient(circle at 16% 8%, rgba(0, 140, 255, 0.18), transparent 30%), linear-gradient(180deg, #121212 0%, #171717 100%)',
    },
    surface: {
      canvas: '#121212',
      paper: '#171717',
      raised: '#222222',
      inset: '#111111',
      nav: 'rgba(18, 18, 18, 0.82)',
      overlay: 'rgba(23, 23, 23, 0.9)',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      default: 'rgba(255, 255, 255, 0.12)',
      strong: 'rgba(255, 255, 255, 0.2)',
    },
    stars: {
      color: 'transparent',
      density: 0,
    },
    accent: {
      primary: '#7DC4FF',
      secondary: '#52CB58',
      tertiary: '#F966AC',
      soft: '#2B2F43',
    },
    text: {
      primary: '#FEFEFD',
      secondary: '#C1CAD2',
      tertiary: '#848281',
      inverse: '#121212',
    },
    status: {
      positive: '#52CB58',
      negative: '#FF4E4E',
      warning: '#FEBE44',
      info: '#7DC4FF',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontWeights: {
        heading: 700,
        subheading: 600,
        button: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
      md: '0 10px 30px rgba(0, 0, 0, 0.26)',
      lg: '0 24px 70px rgba(0, 0, 0, 0.34)',
    },
    motion: {
      fast: '140ms',
      base: '220ms',
      slow: '360ms',
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    },
    chart: {
      palette: ['#7DC4FF', '#52CB58', '#F966AC', '#FEBE44', '#5F5DE7', '#FF5310'],
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
        shadow: 'none', // '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        borderRadius: 0,
      },
      table: {
        headerBg: '#1e1e1e',
        padding: '16px',
        headerFontWeight: 600,
      },
    },
  },
}; 
