module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 255] // Name should be between 3 and 255 characters
        }
      },
      projectDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      skills: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings for skills
        allowNull: true
      },
      billingProcess: {
        type: DataTypes.ENUM('Hourly', 'Fixed'), // Example enum for billing process
        allowNull: true
      },
      budget: {
        type: DataTypes.DECIMAL(10, 2), // Use DECIMAL for monetary values
        allowNull: true
      },
      projectType: {
        type: DataTypes.ENUM('Web Development', 'Mobile App', 'Consulting'), // Example enum for project types
        allowNull: true
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true, // Validate email format
          notEmpty: true
        }
      }
    }, {
      timestamps: true, // Automatically add createdAt and updatedAt fields
      paranoid: true, // Enable soft deletes if needed
      tableName:'projects'
    });
  
    return Project;
  };
  