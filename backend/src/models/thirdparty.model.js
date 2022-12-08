module.exports = (sequelize, Sequelize) => {
    const ThirdParty = sequelize.define("thirdparty", {
        thirdPartyId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    });
    return ThirdParty;
};