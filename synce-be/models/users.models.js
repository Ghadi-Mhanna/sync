const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
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
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
        required: true,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          is: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        },
        allowNull: false,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      initialAutoIncrement: 1,
      timestamps: true,
      name: {
        singular: "user",
        plural: "users",
      },
      hooks: {
        beforeCreate: (user) => {
          user.password = bcrypt.hashSync(user.password, 10);
          return user;
        },
        beforeBulkUpdate: (user) => {
          if (user.attributes.password) {
            user.attributes.password = bcrypt.hashSync(
              user.attributes.password,
              10
            );
          }
          return user;
        },
      },
    }
  );

  //Relations
  Users.associate = function (models) {
    Users.hasMany(models["News"], {
      foreignKey: "added_by",
      sourceKey: "id",
      onUpdate: "cascade",
    });
  };

  return Users;
};
