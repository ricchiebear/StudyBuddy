const db = require('./config/database');

async function run() {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    db.end();
  }
}

run();