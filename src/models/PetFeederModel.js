module.exports = (sequelize, DataTypes) => {
  const PetFeeder = sequelize.define("ALIMENTADORPET", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    nomeAlimentador: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nomePet: {
      type: DataTypes.STRING,
      allowNull: true
    },
    audio: {
      type: DataTypes.BLOB("long"),
      allowNull: true
    },
    audioHabilitado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    },
    especie: {
      type: DataTypes.STRING,
      allowNull: true
    },
    raca: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fotoPet: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    },
    userHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reservatory_level: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    open: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {timestamps: true});

  return PetFeeder;
}