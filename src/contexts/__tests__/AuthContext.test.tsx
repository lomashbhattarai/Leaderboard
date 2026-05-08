import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuthContext } from "../AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { renderWithProviders } from "../../test-utils/render";
import { mockAdminUser, mockUser } from "../../test-utils/mockData";

const AuthProbe = () => {
  const { login, logout, user, isAuthenticated } = useAuthContext();
  const location = useLocation();

  return (
    <div>
      <p>auth:{String(isAuthenticated)}</p>
      <p>user:{user?.email || "none"}</p>
      <p>path:{location.pathname}</p>
      <button onClick={() => login({ token: "new-token" } as any, mockUser)}>
        login user
      </button>
      <button onClick={logout}>logout user</button>
    </div>
  );
};

describe("AuthContext and protected routes", () => {
  it("login stores token and user", async () => {
    renderWithProviders(<AuthProbe />);

    await userEvent.click(screen.getByRole("button", { name: /login user/i }));

    expect(localStorage.getItem("token")).toBe(JSON.stringify({ token: "new-token" }));
    expect(JSON.parse(localStorage.getItem("user") || "{}")).toMatchObject({
      email: mockUser.email,
    });
    expect(screen.getByText("auth:true")).toBeInTheDocument();
  });

  it("logout clears token and user and returns to login", async () => {
    renderWithProviders(<AuthProbe />, { authState: "authenticated" });

    await userEvent.click(screen.getByRole("button", { name: /logout user/i }));

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(screen.getByText("auth:false")).toBeInTheDocument();
    expect(await screen.findByText("path:/login")).toBeInTheDocument();
  });

  it("restores authenticated state from localStorage", () => {
    renderWithProviders(<AuthProbe />, { authState: "authenticated" });

    expect(screen.getByText("auth:true")).toBeInTheDocument();
    expect(screen.getByText(`user:${mockUser.email}`)).toBeInTheDocument();
  });

  it("blocks unauthenticated protected route users", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/wealth-tracker"
          element={
            <ProtectedRoute>
              <p>private wealth page</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>login page</p>} />
      </Routes>,
      { route: "/wealth-tracker" }
    );

    expect(screen.getByText("login page")).toBeInTheDocument();
    expect(screen.queryByText("private wealth page")).not.toBeInTheDocument();
  });

  it("requires admin role for admin routes", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <p>admin dashboard</p>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { route: "/admin/dashboard", authState: "authenticated" }
    );

    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it("allows admin users into admin routes", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <p>admin dashboard</p>
            </ProtectedRoute>
          }
        />
      </Routes>,
      {
        route: "/admin/dashboard",
        authState: { user: mockAdminUser, token: "admin-token" },
      }
    );

    expect(screen.getByText("admin dashboard")).toBeInTheDocument();
  });
});
