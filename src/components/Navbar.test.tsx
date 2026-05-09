import React from "react";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";
import { renderWithProviders } from "../test-utils/render";
import { mockAdminUser, mockUser } from "../test-utils/mockData";

jest.mock("../api/queries/useUserSettings", () => ({
  useUserSettings: () => ({ data: { isAnonymous: false } }),
  useToggleAnonymous: () => ({ mutateAsync: jest.fn() }),
}));

const setMobileViewport = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe("Navbar and protected navigation links", () => {
  beforeEach(() => {
    setMobileViewport(false);
  });

  it("shows public links and login action when logged out", () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByRole("link", { name: /stocks/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /leaderboard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows authenticated menu and logs out", async () => {
    renderWithProviders(<Navbar />, {
      authState: { user: mockUser, token: "user-token" },
    });

    await userEvent.click(screen.getByRole("button", { name: /account settings/i }));
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/logout/i));

    expect(localStorage.getItem("token")).toBeNull();
  });

  it("shows admin link only for admin users", () => {
    renderWithProviders(<Navbar />, {
      authState: { user: mockUser, token: "user-token" },
    });

    expect(screen.queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();

    cleanup();

    renderWithProviders(<Navbar />, {
      authState: { user: mockAdminUser, token: "admin-token" },
    });

    expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
  });

  it("keeps wealth tracker visible in the mobile bottom navigation", async () => {
    setMobileViewport(true);

    renderWithProviders(<Navbar />);

    expect(screen.getByRole("link", { name: /wealth/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /stocks/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /more/i }));

    expect(screen.getByRole("menuitem", { name: /leaderboard/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /journals/i })).toBeInTheDocument();
  });
});
