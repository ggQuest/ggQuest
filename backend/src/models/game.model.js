module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("game", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: false,
            primaryKey: true
        },
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
        }
    });
    return Game;
};