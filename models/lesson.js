module.exports = (sequelize, DataTypes) => sequelize.define(
  'lesson',
  {
    jap: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    kor: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    diction: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    isReview: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    timestamps: true
  }
);
