import express from 'express';
import cors from 'cors';

import signUp from './controllers/sign-up.js';
import login from './controllers/login.js';
import placeOrder from './controllers/place-order.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', signUp);
app.post('/login', login);
// add middleware here
app.post('/place-order', placeOrder);
// app.get('/details', details);

export default app;
