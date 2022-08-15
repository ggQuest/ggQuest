module.exports = (sequelize, Sequelize) => {
    const StateCondition = sequelize.define("stateCondition", {
        from: {
            type: Sequelize.STRING,
            allowNull: false
        },
        to: {
            type: Sequelize.STRING,
            allowNull: false
        },
        data: {
            type: Sequelize.STRING,
            allowNull: false
        },
        data: {
            type: Sequelize.STRING,
            allowNull: false
        },
        compareWith: {
            type: Sequelize.STRING,
            allowNull: false
        }        
    });
    return StateCondition;
};