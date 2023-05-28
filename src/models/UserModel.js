module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define( "user", {
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
  }, {timestamps: true}, )

  return User
}