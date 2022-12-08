module.exports = (sequelize, Sequelize) => {
    const Player = sequelize.define("player", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pseudo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        profilePictureURL: {
            type: Sequelize.STRING,
            allowNull: true
        },
        coverPictureURL: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isRegistered: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        gainedReputation: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        lostReputation: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
    }, {
        hasMany: {
            model: 'ThirdParty',
            foreignKey: 'userId',
            as: 'linkedThirdParties',
        }
    });
    return Player;
};
