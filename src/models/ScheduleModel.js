module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define("CRONOGRAMA", {
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true
    },
    quantidade: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    recorrencia: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    horario: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tempoBandeja: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userHash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {timestamps: true});

  return Schedule;
}