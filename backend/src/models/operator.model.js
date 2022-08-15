module.exports = (sequelize, Sequelize) => {
    const Operator = sequelize.define("operator", {
        value: {
            type: Sequelize.STRING,
            allowNull: false
        }        
    });
    return Operator;
};