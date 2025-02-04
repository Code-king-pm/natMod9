import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

const db = new Pool({
  user: 'postgres',
  password: 'N080904c',
  host: 'localhost',
  database: 'employee_db',
  port: 5432,
});




export { db,};
