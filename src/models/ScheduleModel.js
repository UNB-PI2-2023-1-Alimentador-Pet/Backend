module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define("CRONOGRAMA", {
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true
    },
    quantidade: {
      type: DataTypes.FLOAT,
      allowNull: false,
      primaryKey: true
    },
    recorrencia: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },
    horario: {
      type: DataTypes.TIME,
      allowNull: false,
      primaryKey: true
    },
    tempoBandeja: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userHash: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {timestamps: true});

  return Schedule;
}