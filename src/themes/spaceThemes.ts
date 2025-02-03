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
}

export const spaceThemes: Record<string, SpaceTheme> = {
  none: {
    name: 'Default Theme',
    background: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
    },
    stars: {
      color: 'transparent',
      density: 0,
    },
    accent: {
      primary: 'rgba(0, 0, 0, 0.87)',  // Default black text
      secondary: '#1976d2',  // MUI primary blue for accents
    },
  },
//   deepSpace: {
//     name: 'Deep Space',
//     background: {
//       primary: '#0a0b1e',
//       secondary: '#16213e',
//     },
//     stars: {
//       color: '#ffffff',
//       density: 100,
//     },
//     accent: {
//       primary: '#7597de',
//       secondary: '#4e54c8',
//     },
//   },
//   cosmicPurple: {
//     name: 'Cosmic Purple',
//     background: {
//       primary: '#1a092c',
//       secondary: '#2d1b3d',
//     },
//     stars: {
//       color: '#e0d9ff',
//       density: 150,
//     },
//     accent: {
//       primary: '#b164ff',
//       secondary: '#7c3aed',
//     },
//   },
  nebula: {
    name: 'Nebula',
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
    },
    stars: {
      color: '#ffffff',
      density: 120,
    },
    accent: {
      primary: '#38bdf8',
      secondary: '#818cf8',
    },
  },
}; 