const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('../database/models/user.model');
const TodoModel = require('../database/models/todo.model');
const userRouter = require('../routes/user.api');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use('/user', userRouter);

jest.mock('../database/models/user.model');
jest.mock('../database/models/todo.model');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('User API', () => {
    let token;
    let userId;

    beforeEach(() => {
        userId = new mongoose.Types.ObjectId();
        token = jsonwebtoken.sign({ sub: userId }, 'testKey');
        jsonwebtoken.verify.mockReturnValue({ sub: userId });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /user/add', () => {
        it('should create a new user', async (done) => {
            const user = { name: 'John', email: 'john@example.com', password: 'password123' };
            bcrypt.hash.mockResolvedValue('hashedPassword');
            UserModel.prototype.save.mockResolvedValue({ ...user, _id: userId });

            const res = await request(app).post('/user/add').send(user);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ name: 'John', email: 'john@example.com', _id: userId.toString() });
            done();
        });

        it('should return error if email already exists', async (done) => {
            const user = { name: 'John', email: 'john@example.com', password: 'password123' };
            bcrypt.hash.mockResolvedValue('hashedPassword');
            UserModel.prototype.save.mockRejectedValue({ code: 11000 });

            const res = await request(app).post('/user/add').send(user);

            expect(res.status).toBe(400);
            expect(res.body).toBe("Un compte avec cet email existe déjà!");
            done();
        });
    });

    describe('DELETE /user/delete', () => {
        it('should delete the current user', async (done) => {
            TodoModel.deleteMany.mockResolvedValue({});
            UserModel.findOneAndDelete.mockResolvedValue({});

            const res = await request(app).delete('/user/delete').set('Cookie', [`token=${token}`]);

            expect(res.status).toBe(200);
            expect(res.body).toBeNull();
            done();
        });

        it('should return error if token is invalid', async (done) => {
            jsonwebtoken.verify.mockImplementation(() => { throw new Error('Invalid token'); });

            const res = await request(app).delete('/user/delete').set('Cookie', [`token=${token}`]);

            expect(res.status).toBe(400);
            expect(res.body).toBe("Erreur lors de la suppression de l'utilisateur");
            done();
        });
    });

    describe('PATCH /user/edit', () => {
        it('should update the current user', async (done) => {
            const updates = { name: 'Jane' };
            UserModel.findOneAndUpdate.mockResolvedValue({ name: 'Jane', email: 'jane@example.com' });

            const res = await request(app).patch('/user/edit').set('Cookie', [`token=${token}`]).send(updates);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ name: 'Jane', email: 'jane@example.com' });
            done();
        });

        it('should return error if token is invalid', async (done) => {
            jsonwebtoken.verify.mockImplementation(() => { throw new Error('Invalid token'); });

            const res = await request(app).patch('/user/edit').set('Cookie', [`token=${token}`]).send({ name: 'Jane' });

            expect(res.status).toBe(400);
            expect(res.body).toBeNull();
            done();
        });
    });

    describe('GET /user', () => {
        it('should get the current user', async (done) => {
            UserModel.findById.mockResolvedValue({ name: 'John', email: 'john@example.com' });

            const res = await request(app).get('/user').set('Cookie', [`token=${token}`]);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ name: 'John', email: 'john@example.com' });
            done();
        });

        it('should return error if token is invalid', async (done) => {
            jsonwebtoken.verify.mockImplementation(() => { throw new Error('Invalid token'); });

            const res = await request(app).get('/user').set('Cookie', [`token=${token}`]);

            expect(res.status).toBe(400);
            expect(res.body).toBeNull();
            done();
        });
    });

    describe('POST /user/login', () => {
        it('should return test message', async (done) => {
            const res = await request(app).post('/user/login');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'test' });
            done();
        });
    });
});