const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const UserModel = require('../database/models/user.model');
const { key, keyPub } = require('../env/keys');
const userApi = require('./user.api');

const app = express();
app.use(express.json());
app.use('/api/user', userApi);

describe('User API', () => {
    let server;

    beforeEach(async () => {
        await UserModel.deleteMany({}); // Réinitialise la base pour éviter les conflits

        // Créer un utilisateur et stocker la référence dans une variable
        await UserModel.create({
            name: 'Existing User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 8),
        });

    });

    describe('POST /api/user/add', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/api/user/add')
                .send({
                    email: 'newuser@example.com',
                    password: 'password123',
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual('newuser@example.com');
        });



        it('should not create a user with an existing email', async () => {
            const res = await request(app)
                .post('/api/user/add')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual('Un compte avec cet email existe déjà!');
        });
    });
    
    it("Should allow a user to delete their own account", async () => {
        const user = { email: "test@gmail.com", password: "Etml2024." };

        const newUser = await UserModel.create(user);

        const token = jsonwebtoken.sign({}, key, {
            subject: newUser._id.toString(),
            expiresIn: 60 * 60 * 24 * 30 * 6,
            algorithm: "RS256",
        });

        await request(app)
            .delete("/api/user/delete")
            .set("Cookie", `token=${token}`)
            .expect(200);

        const userInDb = await UserModel.findById(newUser._id);
        expect(userInDb).toBeNull();
    });

});