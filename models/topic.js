module.exports = (sequelize, DataTypes) => sequelize.define(
  'topic',
  {
    topic: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    season: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    timestamps: true
  }
);
