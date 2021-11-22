import connection from '../database/database.js';
import { tokenSchema } from '../validation/enterValidations.js';
import { dataSchema } from '../validation/dataValidations.js';

async function placeOrder(req, res, next) {
  const serverError =
    'Não foi possível acessar a base de dados. Por favor, atualize e tente novamente.';
  const noState =
    'O estado ou distrito enviado não existe. Por favor, escolha um estado ou distrito válido e tente novamente.';
  const alreadySubscribing =
    'Você já assinou um plano. Estamos te redirecionando pra página de login!';

  const token = req.headers.authorization?.replace('Bearer ', '');

  const isCorrectToken = tokenSchema.validate(token);
  const isCorrectData = dataSchema.validate(req.body);

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

    const userId = checkToken.rows[0].user_id;

    const checkPlans = await connection.query(
      `
        SELECT plan_id FROM users WHERE id = $1;
      `,
      [userId]
    );

    if (checkPlans.rows[0].plan_id) {
      return res.status(409).send({ message: alreadySubscribing });
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

    const teaValue = 'Chás';
    const incenseValue = 'Incensos';
    const organicValue = 'Produtos orgânicos';

    if (tea) {
      const getProductsId = await connection.query(
        `
        SELECT * FROM products WHERE name = $1;
        `,
        [teaValue]
      );

      await connection.query(
        `
          INSERT INTO plans_products (products_id, plan_id) VALUES ($1, $2);
        `,
        [getProductsId.rows[0].id, planId]
      );
    }

    if (incense) {
      const getProductsId = await connection.query(
        `
        SELECT * FROM products WHERE name = $1;
        `,
        [incenseValue]
      );

      await connection.query(
        `
        INSERT INTO plans_products (products_id, plan_id) VALUES ($1, $2);
        `,
        [getProductsId.rows[0].id, planId]
      );
    }

    if (organic) {
      const getProductsId = await connection.query(
        `
        SELECT * FROM products WHERE name = $1;
        `,
        [organicValue]
      );

      await connection.query(
        `
        INSERT INTO plans_products (products_id, plan_id) VALUES ($1, $2);
        `,
        [getProductsId.rows[0].id, planId]
      );
    }

    await connection.query(
      `
        UPDATE users SET plan_id = $1 WHERE id = $2;
      `,
      [planId, userId]
    );
    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send({ message: serverError });
  }
}

export default placeOrder;
