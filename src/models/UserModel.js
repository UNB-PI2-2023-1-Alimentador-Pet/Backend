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
      resetpToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resetpExpires: {
        type: DataTypes.DATE, 
        allowNull: true
      }
  }, {timestamps: true})

  return User;
}