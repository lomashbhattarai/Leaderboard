import React, { createContext, useContext, useState } from "react";
import { spaceThemes, SpaceTheme } from "../themes/spaceThemes";

interface ThemeContextType {
  currentTheme: SpaceTheme;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<SpaceTheme>(
    spaceThemes.nebula
  );

  const setTheme = (themeName: string) => {
    const theme = Object.values(spaceThemes).find(
      (theme) => theme.name === themeName
    );
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        availableThemes: Object.values(spaceThemes).map((theme) => theme.name),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
