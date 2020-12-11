const dotenv = require('dotenv').config();

module.exports = {
    'secret': 'sjsu_secret_go_key_program_engg',
    database: process.env.DATABASE,
    'frontendURL': 'http://localhost:3000',
  //  'frontendURL': 'http://10.31.4.85:443',
    // 'frontendURL': 'http://10.0.0.214:3000',
}