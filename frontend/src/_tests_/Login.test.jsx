import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, test, expect, beforeEach } from "vitest";
import { userContext } from "../../context/AuthContext";
import Login from "../../pages/Login.jsx";
import api from "../../src/api/api.js"; 

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const MockAuthProvider = ({ children }) => (
  <userContext.Provider value={{ login: mockLogin }}>
    {children}
  </userContext.Provider>
);

beforeEach(() => {
  mockLogin.mockReset();
  mockNavigate.mockReset();

  vi.spyOn(api, "post").mockResolvedValue({
    data: {
      success: true,
      token: "fake-token",
      user: { role: "admin", name: "Tester" },
    },
  });

  vi.spyOn(window, "alert").mockImplementation(() => {});
});

test("login form submits and calls login() and navigates", async () => {
  render(
    <MemoryRouter>
      <MockAuthProvider>
        <Login />
      </MockAuthProvider>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { value: "test@example.com" },
  });

  fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
    target: { value: "test@123" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => {
    expect(api.post).toHaveBeenCalledWith("/users/login", {
      email: "test@example.com",
      password: "test@123",
    });
    expect(mockLogin).toHaveBeenCalledWith({ role: "admin", name: "Tester" });
  });

  expect(window.alert).toHaveBeenCalledWith("Successfully login");
  expect(mockNavigate).toHaveBeenCalledWith("/admin-dashboard");
});
