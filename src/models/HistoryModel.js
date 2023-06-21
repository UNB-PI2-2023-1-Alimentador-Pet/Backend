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
            type: DataTypes.DATE,
            allowNull: false,
        },
        horario: {
            type: DataTypes.TIME,
            allowNull: false
        },
        foto: {
            type: DataTypes.BLOB('long'),
            allowNull: true
        }
    }, {timestamps: true});

    return History;
}