import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider as SpaceThemeProvider } from "../contexts/ThemeContext";
import { WatchListProvider } from "../contexts/WatchListContext";
import { ShowAmountsProvider } from "../contexts/ShowAmountsContext";
import { mockUser } from "./mockData";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

type AuthState = "authenticated" | "unauthenticated" | { user: any; token?: string };

type RenderWithProvidersOptions = RenderOptions & {
  route?: string;
  routerProps?: MemoryRouterProps;
  queryClient?: QueryClient;
  authState?: AuthState;
};

export const setAuthenticatedLocalStorage = (
  user = mockUser,
  token = "test-token"
) => {
  localStorage.setItem("token", JSON.stringify({ token }));
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const applyAuthState = (authState: AuthState = "unauthenticated") => {
  clearAuthLocalStorage();
  if (authState === "authenticated") {
    setAuthenticatedLocalStorage();
    return;
  }
  if (typeof authState === "object") {
    setAuthenticatedLocalStorage(authState.user, authState.token || "test-token");
  }
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = "/",
    routerProps,
    queryClient = createTestQueryClient(),
    authState = "unauthenticated",
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  applyAuthState(authState);

  const theme = createTheme();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]} {...routerProps}>
        <AuthProvider>
          <SpaceThemeProvider>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <WatchListProvider>
                  <ShowAmountsProvider>{children}</ShowAmountsProvider>
                </WatchListProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </SpaceThemeProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
