require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./config/db');

const password = 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Hashing error:', err);
    process.exit(1);
  }
  
  pool.query(
    'UPDATE users SET password = $1 WHERE email = $2',
    [hash, 'chaitanyapawar077@gmail.com'],
    (err, result) => {
      if (err) {
        console.error('DB error:', err);
        process.exit(1);
      }
      console.log('Password reset for chaitanyapawar077@gmail.com to: admin123');
      process.exit(0);
    }
  );
});
