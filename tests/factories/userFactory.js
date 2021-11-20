import faker from 'faker';
import bcrypt from 'bcrypt';
import connection from '../../src/database/database.js';

const fakerPass = faker.internet.password();

const user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: fakerPass,
  repeatPassword: fakerPass
};

const createUser = async (name, email, password) => {
  const hash = bcrypt.hashSync(password, 10);
  await connection.query(
    `
      INSERT INTO users
      (name, email, password)
      VALUES ($1, $2, $3);
    `,
    [name, email, hash]
  );
};

export { user, createUser };
