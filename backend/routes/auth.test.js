const request = require("supertest");
const express = require("express");
const router = require("./auth.api");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(router);

let mongoServer;
let token;
let userId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a user and generate a token for authentication
    const user = new mongoose.models.UserModel({
        email: "test@example.com",
        password: bcrypt.hashSync("password123", 8),
    });
    await user.save();
    userId = user._id;
    token = jsonwebtoken.sign({}, "testkey", { subject: userId.toString(), algorithm: "HS256" });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("POST / - Login user", () => {
    it("should login the user", async () => {
        const res = await request(app)
            .post("/")
            .send({
                email: "test@example.com",
                password: "password123",
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("email", "test@example.com");
    });

    it("should return 400 for wrong password", async () => {
        const res = await request(app)
            .post("/")
            .send({
                email: "test@example.com",
                password: "wrongpassword",
            });

        expect(res.status).toBe(400);
        expect(res.body).toBe("Mauvais email ou mot de passe!");
    });

    it("should return 400 for non-existent user", async () => {
        const res = await request(app)
            .post("/")
            .send({
                email: "nonexistent@example.com",
                password: "password123",
            });

        expect(res.status).toBe(400);
        expect(res.body).toBe("Utilisateur non trouvé");
    });
});

describe("DELETE / - Logout user", () => {
    it("should logout the user", async () => {
        const res = await request(app)
            .delete("/")
            .set("Cookie", `token=${token}`);

        expect(res.status).toBe(200);
    });
});