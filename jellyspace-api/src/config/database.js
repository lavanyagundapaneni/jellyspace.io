const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file

// Create a new Sequelize instance using the DATABASE_URL from .env
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres', // Specify PostgreSQL as the database dialect
    logging: false, // Enable logging of SQL queries to the console
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test the connection and log details
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        console.log('Connected to database:', sequelize.getDatabaseName()); // Log the database name
        console.log('Search path:', sequelize.query('SHOW data_directory;')) // Log the active schema
    })
    .catch(err => console.log('Error: ' + err));

// Sync models with the database
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // 'force: false' avoids dropping existing tables
        console.log('Database & tables synced successfully.');
    } catch (err) {
        console.error('Error syncing database:', err);
    }
};

// Export the sequelize instance and sync function
module.exports = {
    sequelize,
    syncDatabase
};
