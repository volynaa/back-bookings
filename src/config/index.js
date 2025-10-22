const path = require('node:path');
require('dotenv').config({path: path.join(__dirname,'..','..','.env')});
module.exports = {
    bd:{
        host: process.env.BD_HOST,
        user: process.env.BD_USER,
        password: process.env.BD_PASSWORD,
        database: process.env.BD_DATABASE,
        connectionLimit: process.env.BD_LIMIT,
    },
    server:{
        key: process.env.SERVER_KEY
    }
};