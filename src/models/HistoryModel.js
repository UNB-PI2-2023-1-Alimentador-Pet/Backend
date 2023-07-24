module.exports = (sequelize, DataTypes) => {
    const History = sequelize.define("HISTORICO", {
        quantidadeConsumida: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantidadeTotal: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        data: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        horario: {
            type: DataTypes.TIME,
            allowNull: false
        },
        foto: {
            type: DataTypes.ARRAY(DataTypes.BLOB('long')),
            allowNull: true
        },
        userHash: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {timestamps: true});

    return History;
}