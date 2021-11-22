import connection from '../database/database.js';
import { tokenSchema } from '../validation/enterValidations.js';
import { dataSchema } from '../validation/dataValidations.js';

async function placeOrder(req, res) {
  const notLoggedIn =
    'Você não está logado. Por favor, faça seu login e tente novamente.';
  const invalidData =
    'Algo deu errado com seu pedido. Por favor, atualize e tente novamente.';
  const serverError =
    'Não foi possível acessar a base de dados. Por favor, atualize e tente novamente.';
  const tokenNotFound =
    'Sua sessão expirou ou você não está logado. Por favor, atualize a página e tente novamente.';
  const noState =
    'O estado ou distrito enviado não existe. Por favor, escolha um estado ou distrito válido e tente novamente.';

  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) return res.status(401).send({ message: notLoggedIn });

  const isCorrectToken = tokenSchema.validate(token);
  const isCorrectData = dataSchema.validate(req.body);
  // verify if state exists?

  if (isCorrectToken.error) {
    return res
      .status(400)
      .send({ message: isCorrectToken.error.details[0].message });
  }

  if (isCorrectData.error) {
    return res
      .status(400)
      .send({ message: isCorrectData.error.details[0].message });
  }

  const {
    day,
    tea,
    incense,
    organic,
    name,
    street,
    formattedCep,
    city,
    state
  } = req.body;

  try {
    const checkToken = await connection.query(
      `
        SELECT * FROM sessions WHERE token = $1;
      `,
      [token]
    );

    if (checkToken.rowCount === 0) {
      return res.status(403).send({ message: tokenNotFound });
    }

    const findStateId = await connection.query(
      `
        SELECT id FROM states WHERE name = $1;
      `,
      [state]
    );

    if (findStateId.rowCount === 0) {
      return res.status(400).send({ message: noState });
    }

    const stateId = findStateId.rows[0].id;

    const addAddress = await connection.query(
      `
        INSERT INTO addresses (state_id, city, cep, street, addressee) VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `,
      [stateId, city, formattedCep, street, name]
    );

    console.log(addAddress);

    const addressId = addAddress.rows[0].id;

    const findDayId = await connection.query(
      `
        SELECT id FROM delivery_days WHERE day = $1;
      `,
      [day]
    );

    const dayId = findDayId.rows[0].id;

    const createPlan = await connection.query(
      `
        INSERT INTO plans (delivery_day_id, address_id) VALUES ($1, $2) RETURNING id;
      `,
      [dayId, addressId]
    );

    const planId = createPlan.rows[0].id;

    const getProductsId = await connection.query(`SELECT * FROM products;`);

    const allProductsId = getProductsId.rows;
    console.log(allProductsId);

    // [
    //   { id: 1, name: 'Chá' },
    //   { id: 2, name: 'Incenso' },
    //   { id: 3, name: 'Produtos orgânicos' }
    // ];

    if (tea) {
      // what should I do?
      console.log(tea);
    }

    const addProducts = await connection.query(
      `
        INSERT INTO plans_products (products_id, plan_id ) VALUES ($1, $2);
      `,
      [productId, planId]
    );

    // ADDRESSES
    // id | state_id | city | cep | street | addressee;

    // DELIVERY_DAYS
    //  id |   day
    // ----+---------
    //   1 | Segunda
    //   3 | Quarta
    //   4 | Sexta
    //   5 | Dia 01
    //   6 | Dia 10

    // PRODUCTS
    //  id |        name
    // ----+--------------------
    //   1 | Chá
    //   2 | Incenso
    //   3 | Produtos orgânicos

    // PLANS_PRODUCTS
    //  id | products_id | plan_id
    // ----+-------------+---------
    //   (0 rows)

    // PLANS
    //  id | delivery_day_id | subscription_date | address_id | cancel_date
    // ----+-----------------+-------------------+------------+-------------
    // (0 rows)

    const userId = checkToken.rows[0].user_id;

    await connection.query(
      `
        UPDATE users SET plan_id = $1 WHERE id = $2;
      `,
      [planId, userId]
    );
  } catch (err) {
    return res.status(500).send({ message: serverError });
  }

  return res.sendStatus(201);
}

export default placeOrder;

// body: {
//     type: 'Semanal',
//     day: 'Quarta',
//     tea: false,
//     incense: true,
//     organic: false,
//     name: 'Andrezza Souza',
//     street: 'Rua A, 123',
//     formattedCep: '12345678',
//     city: 'Rio',
//     state: 'AC'
//   },
// }
