const { Pool } = require('pg');

const pool = new Pool({
  user: 'stormihashimoto',
  host: 'localhost',
  database: 'sdc',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 0,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};