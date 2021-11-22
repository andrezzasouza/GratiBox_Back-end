import connection from '../database/database.js';
import { tokenSchema } from '../validation/enterValidations.js';

async function details(req, res) {
  const serverError =
    'Não foi possível acessar a base de dados. Por favor, atualize e tente novamente.';

  const token = req.headers.authorization?.replace('Bearer ', '');
  const isCorrectToken = tokenSchema.validate(token);

  if (isCorrectToken.error) {
    return res
      .status(400)
      .send({ message: isCorrectToken.error.details[0].message });
  }

  try {
    const checkToken = await connection.query(
      `
        SELECT * FROM sessions WHERE token = $1;
      `,
      [token]
    );

    const userId = checkToken.rows[0].user_id;

    const sendPlanData = await connection.query(
      `
        SELECT
          users.plan_id, plans.subscription_date, products.name, delivery_days.day
        FROM
          users
        JOIN
          plans ON plans.id = users.plan_id
        JOIN
          delivery_days ON delivery_days.id = plans.delivery_day_id
        JOIN
          plans_products ON plans_products.plan_id = plans.id
        JOIN
          products ON products.id = plans_products.products_id
        WHERE
          users.id = $1;
      `,
      [userId]
    );
    return res.status(200).send(sendPlanData.rows);
  } catch (err) {
    return res.status(500).send({ message: serverError });
  }
}

export default details;
