module.exports = (sequelize, Sequelize) => {
    const Quest = sequelize.define("quest", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        address: {
            type: Sequelize.STRING,
            defaultValue: null,
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
    },
    {
      initialAutoIncrement: 0
    });
    return Quest;
};