const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file

// Create a new Sequelize instance using the DATABASE_URL from .env
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres', // Specify PostgreSQL as the database dialect
    logging: false, // Disable logging of SQL queries, optional
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Export the sequelize instance
module.exports = sequelize;
