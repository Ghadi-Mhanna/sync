module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define(
    "News",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      added_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      initialAutoIncrement: 1,
      timestamps: true,
      name: {
        singular: "news",
        plural: "news",
      },
    }
  );

  //Relations
  News.associate = function (models) {
    News.belongsTo(models["Categories"], {
      foreignKey: "category_id",
      sourceKey: "id",
      onUpdate: "cascade",
    });
    News.belongsTo(models["Users"], {
      foreignKey: "added_by",
      sourceKey: "id",
      onUpdate: "cascade",
    });
    News.hasMany(models["Images"], {
      foreignKey: "news_id",
      sourceKey: "id",
      onUpdate: "cascade",
    });
  };

  return News;
};
