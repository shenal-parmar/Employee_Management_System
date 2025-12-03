import { render, screen } from "@testing-library/react";
import DepartmentManagement from "../../pages/DepartmentManagement";
import api from "../api/api.js";
import { vi } from "vitest";

vi.spyOn(api, "get").mockResolvedValue({
  data: [{ name: "IT" }, { name: "HR" }]
});

test("department page loads departments", async () => {
  render(<DepartmentManagement />);

  const items = await screen.findAllByText(/IT|HR/i);
  expect(items.length).toBeGreaterThan(0);
});
