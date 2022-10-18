module.exports = (sequelize, Sequelize) => {
    const Quest = sequelize.define("quest", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        onchainId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
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
        }
    });
    return Quest;
};