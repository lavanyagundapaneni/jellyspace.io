const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bid = sequelize.define('Bid', {
  id: {
    type: DataTypes.UUID,  // or DataTypes.INTEGER if you are using integers as primary keys
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4  // or use autoIncrement: true if using integers
  },
  projectId: DataTypes.STRING,
  projectName: DataTypes.STRING,
  projectEmail: DataTypes.STRING,
  rupeesId: DataTypes.STRING,
  bidAmount: DataTypes.FLOAT,
  status: DataTypes.STRING,
  bidDescription: DataTypes.TEXT,
  userEmail: DataTypes.STRING
}, {
  timestamps: true
});

module.exports = Bid;
