module.exports = (sequelize, Sequelize) => {
    const ThirdParty = sequelize.define("thirdparty", {
        thirdPartyId: {
            type: Sequelize.UINT,
            allowNull: false,
        },
        userId: {
            type: Sequelize.UINT,
            allowNull: false,
        }
    });
    return ThirdParty;
};