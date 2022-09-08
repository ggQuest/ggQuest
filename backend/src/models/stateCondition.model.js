module.exports = (sequelize, Sequelize) => {
    const StateCondition = sequelize.define("stateCondition", {
        contract: {
            type: Sequelize.STRING,
            allowNull: false
        },
        function: {
            type: Sequelize.STRING,
            allowNull: false
        },
        parameters: {
            type: Sequelize.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('parameters').split(',')
            },
            set(val) {
               this.setDataValue('parameters',val.join(','));
            }
        },
        compareWith: {
            type: Sequelize.STRING,
            allowNull: false
        },
        operator: {
            type: Sequelize.STRING,
            allowNull: false
        }     
    });
    return StateCondition;
};