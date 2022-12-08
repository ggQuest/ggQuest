const { Model, DataTypes } = require('sequelize');

class ThirdParty extends Model {
  static init(sequelize) {
    return super.init({
      thirdPartyId: {
        type: DataTypes.UINT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UINT,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'thirdParty',
    });
  }
}

module.exports = ThirdParty;