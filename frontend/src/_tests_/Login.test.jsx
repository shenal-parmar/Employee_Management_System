import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/Login";
import { vi } from "vitest";
import * as api from "../api/userApi";

vi.spyOn(api, "loginUser").mockResolvedValue({
  token: "fake-token",
  user: { name: "Test User" }
});

test("login form submits correctly", async () => {
  render(<Login />);

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: "test@example.com" }
  });

  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: "123456" }
  });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(api.loginUser).toHaveBeenCalled();
});
