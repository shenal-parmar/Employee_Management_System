import request from "supertest";
// SET NODE_ENV=test && npm test
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import  app  from "../server.js";
import User from "../models/UserModel.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Auth API Tests", () => {
  let testUser;
  let token;
  const VALID_TEST_ROLE = "admin"; 

  beforeAll(async () => {
    // Create a user in DB
    const hashedPassword = await bcrypt.hash("123456", 10);
    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      role: VALID_TEST_ROLE, 
    });

    token = jwt.sign(
      { id: testUser._id, role: testUser.role },
      process.env.JWT_SECRET || "testsecret",
      { expiresIn: "1h" }
    );
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "New User",
        email: "new@example.com",
        password: "123456",
        role: "admin", 
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user"); 
  });

  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: "test@example.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token"); 
  });

  it("should NOT login with wrong password", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: "test@example.com",
        password: "wrongpass",
      });

    expect(res.statusCode).toBe(401);
  });

  it("should verify user token", async () => {
    const res = await request(app)
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("role", VALID_TEST_ROLE); 
  });
});