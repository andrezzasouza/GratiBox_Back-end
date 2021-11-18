import '../src/setup.js';
import supertest from 'supertest';
import connection from '../src/database/database.js';
import app from '../src/app.js';
import clearDatabase from './factories/tableFactory.js';

describe('POST /login', () => {
  it('returns 200 when login is successful', async () => {
    const result = await supertest(app)
      .post('/login')
      .send({});
    expect(result.status).toEqual(200);
  })
});
