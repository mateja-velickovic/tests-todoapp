const request = require("supertest");
const express = require("express");
const router = require("./todo.api");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jsonwebtoken = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(router);

let mongoServer;
let token;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a user and generate a token for authentication
    const user = { _id: new mongoose.Types.ObjectId(), email: "test@example.com" };
    token = jsonwebtoken.sign({}, "testkey", { subject: user._id.toString(), algorithm: "HS256" });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("POST /add - Create a new todo", () => {
    it("should create a new todo", async () => {
        const res = await request(app)
            .post("/add")
            .set("Cookie", `token=${token}`)
            .send({
                text: "New Todo"
            });

        expect(res.status).toBe(200);
        expect(res.body).toBeNull();
    });

    it("should return 400 if no token is provided", async () => {
        const res = await request(app)
            .post("/add")
            .send({
                text: "New Todo"
            });

        expect(res.status).toBe(400);
        expect(res.body).toBeNull();
    });
});

describe("PATCH /:id - Update a todo", () => {
    let todoId;

    beforeEach(async () => {
        const res = await request(app)
            .post("/add")
            .set("Cookie", `token=${token}`)
            .send({
                text: "Todo to update"
            });

        todoId = res.body._id;
    });

    it("should update the todo", async () => {
        const res = await request(app)
            .patch(`/${todoId}`)
            .send({
                completed: true
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("nModified", 1);
    });

    it("should return 400 if invalid id is provided", async () => {
        const res = await request(app)
            .patch(`/invalidId`)
            .send({
                completed: true
            });

        expect(res.status).toBe(400);
        expect(res.body).toBeNull();
    });
});

describe("POST /:id - Delete a todo", () => {
    let todoId;

    beforeEach(async () => {
        const res = await request(app)
            .post("/add")
            .set("Cookie", `token=${token}`)
            .send({
                text: "Todo to delete"
            });

        todoId = res.body._id;
    });

    it("should delete the todo", async () => {
        const res = await request(app)
            .post(`/${todoId}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeNull();
    });

    it("should return 400 if invalid id is provided", async () => {
        const res = await request(app)
            .post(`/invalidId`);

        expect(res.status).toBe(400);
        expect(res.body).toBeNull();
    });
});

describe("GET / - Get all todos of user", () => {
    it("should get all todos of the user", async () => {
        const res = await request(app)
            .get("/")
            .set("Cookie", `token=${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it("should return 400 if no token is provided", async () => {
        const res = await request(app)
            .get("/");

        expect(res.status).toBe(400);
        expect(res.body).toBeNull();
    });
});