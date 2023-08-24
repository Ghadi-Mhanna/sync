module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define(
    "Images",
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
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      news_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      initialAutoIncrement: 1,
      timestamps: true,
      name: {
        singular: "image",
        plural: "images",
      },
    }
  );

  //Relations
  Images.associate = function (models) {
    Images.belongsTo(models["News"], {
      foreignKey: "news_id",
      sourceKey: "id",
      onUpdate: "cascade",
      onDelete: "cascade",
    });
  };

  return Images;
};
