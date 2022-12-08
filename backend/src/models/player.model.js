const { Model, DataTypes } = require('sequelize');

class Player extends Model {
  static init(sequelize) {
    return super.init({
      pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePictureURL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coverPictureURL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isRegistered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      gainedReputation: {
        type: DataTypes.UINT,
        defaultValue: 0,
      },
      lostReputation: {
        type: DataTypes.UINT,
        defaultValue: 0,
      },
    }, {
      sequelize,
      modelName: 'player',
    });
  }

  static associate(models) {
    this.hasMany(models.ThirdParty, {
      foreignKey: 'userId',
      as: 'linkedThirdParties',
    });
  }
}

module.exports = Player;