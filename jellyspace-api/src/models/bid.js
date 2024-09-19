module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', {
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Projects', // Ensure this matches your actual table name
        key: 'id'
      },
      allowNull: false // Ensure projectId is always required
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    projectEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    rupeesId: {
      type: DataTypes.STRING,
      allowNull: true // Adjust this based on your business logic
    },
    bidAmount: {
      type: DataTypes.DECIMAL(10, 2), // Better precision for monetary values
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', // Default status, adjust based on your use case
      validate: {
        isIn: [['pending', 'approved', 'rejected']] // Set allowed statuses
      }
    },
    bidDescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    paranoid: true, // Enable soft deletes
    timestamps: true, // Automatically manage createdAt and updatedAt
    tableName: 'bids'
  });

  // Define relationships
  Bid.associate = function(models) {
    Bid.belongsTo(models.Project, { foreignKey: 'projectId' });
  };

  return Bid;
};