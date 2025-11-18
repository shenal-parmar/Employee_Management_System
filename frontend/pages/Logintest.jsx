import { describe, it, expect } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { submitLogin } from "./Login";

const mock = new MockAdapter(axios);

describe("submitLogin", () => {
  it("returns data on successful login", async () => {
    const loginData = { email: "test@test.com", password: "123456" };
    mock.onPost("http://localhost:3000/api/auth/login").reply(200, {
      success: true,
      token: "abc123",
      user: { name: "employee" },
    });

    const res = await submitLogin(loginData);
    expect(res.success).toBe(true);
    expect(res.user.name).toBe("employee");
  });

  it("throws error on failed login", async () => {
    const loginData = { email: "test@test.com", password: "wrong" };
    mock.onPost("http://localhost:3000/api/auth/login").reply(400, {
      error: "Invalid credentials",
    });

    await expect(submitLogin(loginData)).rejects.toThrow("Invalid credentials");
  });
});
