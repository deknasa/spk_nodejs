'use strict';
const { Model } = require('sequelize');
const {hashedPassword} = require('../helpers/bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "full_name is required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email address already in use. Try another one!"
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Email is required"
        },
        isEmail: {
          args: true,
          msg: "email must be valid"
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [7, 10],
          msg: "The password length should be between 7 and 10 characters!"
        },
        notEmpty: {
          args: true,
          msg: "Password is required"
        },
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ["admin", "user"],
      validate: {
        isIn: {
          args: [
            ["admin", "user"]
          ],
          msg: "role must be admin or user",
        },
        notEmpty: {
          args: true,
          msg: "role is required"
        },
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, opt) => {
        const hashPassword = hashedPassword(user.password);
        user.password = hashPassword
      },
      beforeUpdate: (user, opt) => {
        const hashPasswordBeforeUpdate = hashedPassword(user.password);
        user.password = hashPasswordBeforeUpdate
      },
    }
  });
  return User;
};

 // function encryptPasswordIfChanged(user, options) {
  //   if (user.changed('password')) {
  //     encryptPassword(user.get('password'));
  //   }
  // },
  // {
  //   sequelize,
  //   modelName: 'User',
  //   hooks: {
  //     beforeCreate: (user, opt) => {
  //       const hashPassword = hashedPassword(user.password);
  //       user.password = hashPassword
  //     },
  //     // beforeUpdate: (user, opt) => {
  //     //   if (user.password) {
  //     //     // const hashPasswordBeforeUpdate = hashedPassword(user.password);
  //     //     user.password = bcrypt.hashSync(user.previous.password, bcrypt.genSaltSync(10), null)
  //     //   }
  //     //   console.log(user.previous.password);
  //     //   // const hashPasswordBeforeUpdate = hashedPassword(user.password);
  //     //   // // user.password = hashPasswzzzzzzzzzzzzzzordBeforeUpdate
  //     //   // user.setDataValue("password", hashPasswordBeforeUpdate)
  //     // },