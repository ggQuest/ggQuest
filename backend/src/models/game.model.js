module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("game", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        websiteURL: {
            type: Sequelize.STRING,
            allowNull: false
        },
        thumbnailImageURL: {
            type: Sequelize.STRING,
            allowNull: false
        },
        imageURL: {
            type: Sequelize.STRING,
            allowNull: false
        },
        coverImageURL: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dateCreated: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });
    return Game;
};