import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import  app  from "../server.js";
import Employee from "../models/EmployeeModel.js";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

// Helper function to create a valid employee object
// This ensures all required fields (like date_of_joining) are present
const createValidEmployeeData = (overrides = {}) => ({
  name: "Default User",
  email: `default${Date.now()}@example.com`,
  password: "123456",
  date_of_joining: new Date().toISOString(), // This is the crucial missing field in your original 'Update' and 'Delete' setup blocks
  gender: "Male",
  marital_status: "Single",
  ...overrides,
});

describe("Employee CRUD Tests", () => {
  it("Create employee", async () => {
    // This test case already passed, using the required fields.
    const res = await request(app)
      .post("/api/employees")
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        date_of_joining: new Date().toISOString(),
        gender: "Male",
        marital_status: "Single",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.employee).toHaveProperty("_id");
    expect(res.body.employee.name).toBe("John Doe");
  });

  it("Get all employees", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Update employee", async () => {
    // FIX: Provide all required fields for creation before updating
    const emp = await Employee.create(
      createValidEmployeeData({ 
        name: "Temp User", 
        email: "temp@example.com" 
      })
    );

    const res = await request(app)
      .put(`/api/employees/${emp._id}`)
      .send({ name: "Updated User" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name || res.body.employee.name).toBe("Updated User");
  });

  it("Delete employee", async () => {
    // FIX: Provide all required fields for creation before deleting
    const emp = await Employee.create(
      createValidEmployeeData({ 
        name: "Delete User", 
        email: "delete@example.com" 
      })
    );

    const res = await request(app).delete(`/api/employees/${emp._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});