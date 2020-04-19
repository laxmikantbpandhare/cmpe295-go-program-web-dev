const dotenv = require('dotenv').config();

module.exports = {
    'secret': 'sjsu_secret_go_key_program_engg',
    database: process.env.DATABASE,
    'frontendURL': 'http://localhost:3000',
    // 'frontendURL': 'http://10.0.0.210:3000',
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    'AWS_S3_BUCKET_NAME': 'twitter-prototype-project',
    'AWS_S3_BUCKET_REGION': 'us-west-1'
}