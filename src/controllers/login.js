import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database/database.js';
import { loginSchema } from '../validation/enterValidations.js';

async function login(req, res) {
  const { email, password } = req.body;

  const errors = loginSchema.validate({
    email,
    password
  }).error;

  if (errors) {
    return res.status(400).send({ message: errors.details[0].message });
  }

  try {
    const checkUser = await connection.query(
      'SELECT * FROM users WHERE email = $1;',
      [email]
    );

    if (checkUser.rowCount === 0) {
      return res.status(404).send({
        message: 'Você ainda não tem uma conta. Clique abaixo para criar a sua!'
      });
    }

    const user = checkUser.rows[0];

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({
        message:
          'Combinação de e-mail e senha incorreta. Verifique e tente novamente.'
      });
    }

    const token = uuid();

    await connection.query(
      'INSERT INTO sessions (user_id, token) VALUES ($1, $2)',
      [user.id, token]
    );

    return res.status(201).send({ token, name: user.name });
  } catch (err) {
    return res.status(500).send({
      message: 'Não foi possível acessar a base de dados. Tente novamente.'
    });
  }
}

export default login;
