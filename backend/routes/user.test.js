const request = require("supertest");
const express = require("express");
const router = require("./user.api"); // Fichier à tester

// Mock des modules
jest.mock("../database/models/user.model", () => ({
  findById: jest.fn(),
  findOneAndDelete: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteMany: jest.fn(),
}));

jest.mock("../database/models/todo.model", () => ({
  deleteMany: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const UserModel = require("../database/models/user.model");
const TodoModel = require("../database/models/todo.model");
const jsonwebtoken = require("jsonwebtoken");

// Créer une app pour les tests
const app = express();
app.use(express.json());
app.use(router);

describe("User API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    it("devrait retourner l'utilisateur actuel si le token est valide", async () => {
      jsonwebtoken.verify.mockReturnValue({ sub: "123" });
      UserModel.findById.mockResolvedValue({ name: "John Doe", email: "john@example.com" });

      const res = await request(app).get("/").set("Cookie", "token=valid-token");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ name: "John Doe", email: "john@example.com" });
      expect(UserModel.findById).toHaveBeenCalledWith("123");
    });

    it("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
      jsonwebtoken.verify.mockReturnValue({ sub: "123" });
      UserModel.findById.mockResolvedValue(null);

      const res = await request(app).get("/").set("Cookie", "token=valid-token");

      expect(res.status).toBe(404);
      expect(res.body).toBe(null);
    });

    it("devrait retourner 400 si le token est invalide", async () => {
      jsonwebtoken.verify.mockImplementation(() => { throw new Error("Invalid token"); });

      const res = await request(app).get("/").set("Cookie", "token=invalid-token");

      expect(res.status).toBe(400);
      expect(res.body).toBe(null);
    });
  });

  describe("POST /add", () => {
    it("devrait créer un nouvel utilisateur", async () => {
      const mockUser = {
        save: jest.fn().mockResolvedValue(),
        toObject: () => ({ name: "John", email: "john@example.com" }),
      };
      UserModel.mockImplementation(() => mockUser);

      const res = await request(app).post("/add").send({
        name: "John",
        email: "john@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ name: "John", email: "john@example.com" });
      expect(mockUser.save).toHaveBeenCalled();
    });

    it("devrait retourner une erreur si un utilisateur existe déjà", async () => {
      const mockError = { code: 11000 };
      const mockUser = {
        save: jest.fn().mockRejectedValue(mockError),
      };
      UserModel.mockImplementation(() => mockUser);

      const res = await request(app).post("/add").send({
        name: "John",
        email: "john@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toBe("Un compte avec cet email existe déjà!");
    });
  });

  describe("DELETE /delete", () => {
    it("devrait supprimer l'utilisateur et ses tâches", async () => {
      jsonwebtoken.verify.mockReturnValue({ sub: "123" });
      TodoModel.deleteMany.mockResolvedValue();
      UserModel.findOneAndDelete.mockResolvedValue();

      const res = await request(app).delete("/delete").set("Cookie", "token=valid-token");

      expect(res.status).toBe(200);
      expect(TodoModel.deleteMany).toHaveBeenCalledWith({ _id: "123" });
      expect(UserModel.findOneAndDelete).toHaveBeenCalledWith({ _id: "123" });
    });
  });
});
