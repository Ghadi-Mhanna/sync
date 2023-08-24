module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    "Categories",
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
      descriptions: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      initialAutoIncrement: 1,
      timestamps: true,
      name: {
        singular: "category",
        plural: "categories",
      },
    }
  );

  //Relations
  Categories.associate = function (models) {
    Categories.hasMany(models["News"], {
      foreignKey: "category_id",
      sourceKey: "id",
      onUpdate: "cascade",
    });
  };

  return Categories;
};
