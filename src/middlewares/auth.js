/* eslint-disable consistent-return */
import connection from '../database/database.js';

async function checkToken(req, res, next) {
  const notLoggedIn =
    'Você não está logado. Por favor, faça seu login e tente novamente.';

  const { authorization } = req.headers;
  const token = authorization.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send({ message: notLoggedIn });
  }

  const session = await connection.query(
    `
      SELECT * FROM sessions WHERE token = $1;

    `,
    [token]
  );

  if (session.rowCount === 0) {
    return res.status(403).send({ message: tokenNotFound });
  }

  next();
}

export default checkToken;
