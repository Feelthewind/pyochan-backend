module.exports = (sequelize, DataTypes) => sequelize.define(
  'subscription',
  {
    endpoint: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    p256dh: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    auth: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    timestamps: true
  }
);
