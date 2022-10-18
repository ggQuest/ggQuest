module.exports = (sequelize, Sequelize) => {
    const ApiCredentials = sequelize.define("apiCredentials", {
        key: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        active: {
            type: Sequelize.BOOLEAN,
        }
    });
    return ApiCredentials;
};