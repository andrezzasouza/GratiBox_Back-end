import connection from '../database/database.js';
import { tokenSchema } from '../validation/enterValidations.js';

async function update(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const isCorrectToken = tokenSchema.validate(token);

  if (isCorrectToken.error) {
    return res
      .status(400)
      .send({ message: isCorrectToken.error.details[0].message });
  }

  try {
    const getInfo = await connection.query(
      `
        SELECT
          sessions.*, users.*
        FROM
          sessions
        JOIN
          users ON sessions.user_id = users.id
        WHERE token = $1;
      `,
      [token]
    );

    const userInfo = getInfo.rows[0];

    return res
      .status(200)
      .send({ token, name: userInfo.name, plan: userInfo.plan_id });
  } catch (err) {
    return res.status(500).send({
      message: 'Não foi possível acessar a base de dados. Tente novamente.'
    });
  }
}

export default update;
