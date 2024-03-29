import '../src/setup.js';
import supertest from 'supertest';
import connection from '../src/database/database.js';
import app from '../src/app.js';
import clearDatabase from './factories/tableFactory.js';
import {
  user,
  createUser,
  noUser,
  wrongPass,
  noPass,
  goodLogin
} from './factories/userFactory.js';

beforeEach(async () => {
  await clearDatabase();
});

afterAll(() => {
  connection.end();
});

describe('POST /login', () => {
  it('returns 400 for incorrect body', async () => {
    await createUser(user.name, user.email, user.password, user.repeatPassword);
    const result = await supertest(app).post('/login').send(noPass);
    expect(result.body).toEqual({
      message: expect.any(String)
    });
    expect(result.status).toEqual(400);
  });

  it('returns 404 for email not registered', async () => {
    const result = await supertest(app).post('/login').send(noUser);
    expect(result.body).toEqual({
      message: 'Você ainda não tem uma conta. Clique abaixo para criar a sua!'
    });
    expect(result.status).toEqual(404);
  });

  it('returns 401 for wrong password', async () => {
    await createUser(user.name, user.email, user.password, user.repeatPassword);

    const result = await supertest(app).post('/login').send(wrongPass);
    expect(result.body).toEqual({
      message:
        'Combinação de e-mail e senha incorreta. Verifique e tente novamente.'
    });
    expect(result.status).toEqual(401);
  });

  it('returns 200 when login is successful', async () => {
    await createUser(user.name, user.email, user.password, user.repeatPassword);
    const result = await supertest(app).post('/login').send(goodLogin);
    expect(result.body).toEqual({
      token: expect.any(String),
      name: user.name,
      plan: null
    });
    expect(result.status).toEqual(200);
  });
});
