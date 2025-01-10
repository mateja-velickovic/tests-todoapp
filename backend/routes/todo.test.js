// const request = require('supertest');
// const express = require('express');
// const mongoose = require('mongoose');
// const jsonwebtoken = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');

// const router = require('./todo.api');
// const TodoModel = require('../database/models/todo.model');
// const { keyPub } = require('../env/keys');

// const app = express();
// app.use(express.json());
// app.use(cookieParser());
// app.use('/api/todo', router);

// jest.mock('../database/models/todo.model');
// jest.mock('jsonwebtoken');

// describe('Todo API', () => {
//   let token;
//   let decodedToken;

//   beforeEach(() => {
//     token = 'test-token';
//     decodedToken = { sub: new mongoose.Types.ObjectId().toString() };
//     jsonwebtoken.verify.mockReturnValue(decodedToken);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('POST /api/todo/add', () => {
//     it('should create a new todo', async () => {
//       const todo = { text: 'Test todo', completed: false, user_id: decodedToken.sub };
//       TodoModel.prototype.save.mockResolvedValue(todo);

//       const res = await request(app)
//         .post('/api/todo/add')
//         .set('Cookie', `token=${token}`)
//         .send({ text: 'Test todo' });

//       expect(res.status).toBe(200);
//       expect(TodoModel.prototype.save).toHaveBeenCalled();
//     });

//     it('should return 400 if token is invalid', async () => {
//       jsonwebtoken.verify.mockImplementation(() => { throw new Error('Invalid token'); });

//       const res = await request(app)
//         .post('/api/todo/add')
//         .set('Cookie', `token=${token}`)
//         .send({ text: 'Test todo' });

//       expect(res.status).toBe(400);
//     });
//   });

//   describe('PATCH /api/todo/:id', () => {
//     it('should update a todo', async () => {
//       const todoId = new mongoose.Types.ObjectId().toString();
//       const updates = { text: 'Updated todo' };
//       TodoModel.updateOne.mockResolvedValue({ nModified: 1 });

//       const res = await request(app)
//         .patch(`/api/todo/${todoId}`)
//         .send(updates);

//       expect(res.status).toBe(200);
//       expect(TodoModel.updateOne).toHaveBeenCalledWith({ _id: new mongoose.Types.ObjectId(todoId) }, { $set: updates });
//     });

//     it('should return 400 if id is invalid', async () => {
//       const res = await request(app)
//         .patch('/api/todo/invalid-id')
//         .send({ text: 'Updated todo' });

//       expect(res.status).toBe(400);
//     });
//   });

//   describe('POST /api/todo/:id', () => {
//     it('should delete a todo', async () => {
//       const todoId = new mongoose.Types.ObjectId().toString();
//       TodoModel.findOneAndDelete.mockResolvedValue(null);

//       const res = await request(app)
//         .post(`/api/todo/${todoId}`);

//       expect(res.status).toBe(200);
//       expect(TodoModel.findOneAndDelete).toHaveBeenCalledWith({ _id: new mongoose.Types.ObjectId(todoId) });
//     });

//     it('should return 400 if id is invalid', async () => {
//       const res = await request(app)
//         .post('/api/todo/invalid-id');

//       expect(res.status).toBe(400);
//     });
//   });

//   describe('GET /api/todo', () => {
//     it('should get all todos of user', async () => {
//       const todos = [{ text: 'Test todo', completed: false, user_id: decodedToken.sub }];
//       TodoModel.find.mockResolvedValue(todos);

//       const res = await request(app)
//         .get('/api/todo')
//         .set('Cookie', `token=${token}`);

//       expect(res.status).toBe(200);
//       expect(res.body).toEqual(todos);
//       expect(TodoModel.find).toHaveBeenCalledWith({ user_id: new mongoose.Types.ObjectId(decodedToken.sub) });
//     });

//     it('should return 400 if token is invalid', async () => {
//       jsonwebtoken.verify.mockImplementation(() => { throw new Error('Invalid token'); });

//       const res = await request(app)
//         .get('/api/todo')
//         .set('Cookie', `token=${token}`);

//       expect(res.status).toBe(400);
//     });
//   });
// });