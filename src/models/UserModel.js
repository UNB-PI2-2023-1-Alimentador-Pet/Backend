// const DataTypes = require('sequelize').DataTypes

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define( "USUARIO", {
      nome: {
          type: DataTypes.STRING,
          allowNull: false
      },
      email: {
          type: DataTypes.STRING,
          unique: true,
          isEmail: true, //checks for email format
          allowNull: false
      },
      senha: {
          type: DataTypes.STRING,
          allowNull: false
      },
      userHash: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      passwordresettoken: {
        type: DataTypes.STRING,
        select: false,
      },
      passwordresetexpires: {
        type: DataTypes.DATE,
        select: false,
      }
  }, {timestamps: true})

  return User;
}