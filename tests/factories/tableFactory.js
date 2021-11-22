import connection from '../../src/database/database.js';

const del = 'DELETE FROM';

// add other tables here as well

const clearDatabase = async () => {
  await connection.query(`
    ${del} sessions;
    ${del} users;
  `);
};

export default clearDatabase;
