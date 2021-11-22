import express from 'express';
import cors from 'cors';

import signUp from './controllers/sign-up.js';
import login from './controllers/login.js';
import placeOrder from './controllers/place-order.js';
import details from './controllers/details.js';
import checkToken from './middlewares/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', signUp);
app.post('/login', login);
app.post('/place-order', checkToken, placeOrder);
app.get('/details', checkToken, details);

export default app;
