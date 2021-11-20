import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import clearDatabase from './factories/tableFactory.js';
import { user, createUser, noPass } from './factories/userFactory.js';

beforeEach(async () => {
  await clearDatabase();
});

afterAll(() => {
  connection.end();
});

describe('POST /sign-up', () => {
  it('returns 201 for signing up sucess', async () => {
    const result = await supertest(app).post('/sign-up').send(user);
    expect(result.status).toEqual(201);
  });

  it('returns 400 for incorrect body', async () => {
    const result = await supertest(app).post('/sign-up').send(noPass);

    expect(result.body).toEqual({
      message: expect.any(String)
    });
    expect(result.status).toEqual(400);
  });

  it('returns 409 for email already registered', async () => {
    await createUser(user.name, user.email, user.password, user.repeatPassword);

    const result = await supertest(app).post('/sign-up').send(user);
    expect(result.body).toEqual({
      message: 'Você já tem uma conta. Faça o login, por favor.'
    });
    expect(result.status).toEqual(409);
  });
});
