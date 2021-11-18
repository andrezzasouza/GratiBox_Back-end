import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import clearDatabase from './factories/tableFactory.js';

beforeEach(async () => {
  await clearDatabase();
});

describe('...', () => {
  /* ... */
});
