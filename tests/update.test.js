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

describe('GET /update', () => {
  it('returns 401 for wrong password', async () => {
    await createUser(user.name, user.email, user.password, user.repeatPassword);
    await supertest(app).post('/login').send(goodLogin);

    const result = await supertest(app).get('/update').send({});
    expect(result.body).toEqual({
      message:
        'Você não está logado. Por favor, faça seu login e tente novamente.'
    });
    expect(result.status).toEqual(401);
  });

  it('returns 403 for invalid token', async () => {
    await createUser(user.name, user.email, user.password, user.repeatPassword);
    await supertest(app).post('/login').send(goodLogin);

    const result = await supertest(app)
      .get('/update')
      .set('Authorization', 'Bearer TOKEN')
      .send({});
    expect(result.body).toEqual({
      message:
        'Você não está logado ou seu token expirou. Por favor, faça seu login e tente novamente.'
    });
    expect(result.status).toEqual(403);
  });

  it('returns 200 when login is successful', async () => {
    await createUser(user.name, user.email, user.password, user.repeatPassword);
    const login = await supertest(app).post('/login').send(goodLogin);
    console.log(login);
    const result = await supertest(app)
      .get('/update')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({});
    expect(result.status).toEqual(200);
  });
});
