import connection from '../../src/database/database.js';

const del = 'DELETE FROM';

const clearDatabase = async () => {
  await connection.query(`
    ${del} sessions;
    ${del} users;
    ${del} addresses;
  `);
};

export default clearDatabase;
