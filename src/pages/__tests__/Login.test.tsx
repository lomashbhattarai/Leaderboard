import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { login } from "../../api/auth";
import { showToast } from "../../utils/toast";
import { renderWithProviders } from "../../test-utils/render";
import { mockUser } from "../../test-utils/mockData";

jest.mock("../../api/auth");
jest.mock("../../utils/toast", () => ({
  showToast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedLogin = jest.mocked(login);

describe("Login page", () => {
  it("renders email/password fields and submit button", () => {
    renderWithProviders(<Login />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toBeInTheDocument();
  });

  it("calls login API and stores auth data on success", async () => {
    mockedLogin.mockResolvedValue({
      token: { token: "login-token" },
      user: mockUser,
    });
    renderWithProviders(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), mockUser.email);
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() =>
      expect(mockedLogin).toHaveBeenCalledWith({
        email: mockUser.email,
        password: "password123",
      })
    );
    expect(localStorage.getItem("token")).toBe(
      JSON.stringify({ token: "login-token" })
    );
    expect(JSON.parse(localStorage.getItem("user") || "{}")).toMatchObject({
      email: mockUser.email,
    });
    expect(showToast.success).toHaveBeenCalledWith("Successfully logged in!");
  });

  it("shows failure feedback on invalid login", async () => {
    mockedLogin.mockRejectedValue(new Error("Invalid credentials"));
    renderWithProviders(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), mockUser.email);
    await userEvent.type(screen.getByLabelText(/password/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() =>
      expect(showToast.error).toHaveBeenCalledWith(
        "Login failed. Please check your credentials."
      )
    );
  });
});
