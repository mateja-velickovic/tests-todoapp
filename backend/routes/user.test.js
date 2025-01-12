const request = require("supertest");
const express = require("express");
const router = require("./user.api");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = express();
app.use(express.json());
app.use(router);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /add - Create a new user", () => {
  it("should create a new user", async () => {
    const res = await request(app)
      .post("/add")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "Test User");
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  it("should not create a user with an existing email", async () => {
    await request(app)
      .post("/add")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/add")
      .send({
        name: "Another User",
        email: "test@example.com",
        password: "password123",
      });

    expect(res.status).toBe(400);
    expect(res.body).toBe("Un compte avec cet email existe déjà!");
  });
});

describe("DELETE /delete - Delete current user", () => {
  let token;

  beforeEach(async () => {
    const res = await request(app)
      .post("/add")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    token = res.body.token;
  });

  it("should delete the current user", async () => {
    const res = await request(app)
      .delete("/delete")
      .set("Cookie", `token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });

  it("should return 400 if no token is provided", async () => {
    const res = await request(app).delete("/delete");

    expect(res.status).toBe(400);
    expect(res.body).toBeNull();
  });
});

describe("PATCH /edit - Update current user", () => {
  let token;

  beforeEach(async () => {
    const res = await request(app)
      .post("/add")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    token = res.body.token;
  });

  it("should update the current user", async () => {
    const res = await request(app)
      .patch("/edit")
      .set("Cookie", `token=${token}`)
      .send({
        name: "Updated User",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "Updated User");
  });

  it("should return 400 if no token is provided", async () => {
    const res = await request(app).patch("/edit").send({
      name: "Updated User",
    });

    expect(res.status).toBe(400);
    expect(res.body).toBeNull();
  });
});

describe("GET / - Get current user", () => {
  let token;

  beforeEach(async () => {
    const res = await request(app)
      .post("/add")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    token = res.body.token;
  });

  it("should get the current user", async () => {
    const res = await request(app)
      .get("/")
      .set("Cookie", `token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "Test User");
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  it("should return 400 if no token is provided", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(400);
    expect(res.body).toBeNull();
  });
});