'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Alternatif extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Rel_Alternatif, {
        as: "rel_alternatif",
        foreignKey: "kode_alternatif",
        sourceKey: "kode_alternatif"
      })
    }
  }
  Alternatif.init({
    kode_alternatif: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Kode alternatif already exist"
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "kode alternatif is required"
        }
      }
    },
    nama_alternatif: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "nama alternatif is required"
        }
      }
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "keterangan is required"
        }
      }
    },
    vikor_total: {
      type: DataTypes.DOUBLE,
      validate: {
        notEmpty: {
          args: true,
          msg: "balance is required"
        },
      }
    },
    vikor_rank: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "vikor_rank is required"
        },
        isInt: {
          args: true,
          msg: "vikor_rank must be integer"
        }
      }
    },
    vikor_harga: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "vikor_harga is required"
        },
        isInt: {
          args: true,
          msg: "vikor_harga must be integer"
        }
      }
    },
    moora_total: {
      type: DataTypes.DOUBLE,
      validate: {
        notEmpty: {
          args: true,
          msg: "moora_total is required"
        }
      }
    },
    moora_rank: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "moora_rank is required"
        },
        isInt: {
          args: true,
          msg: "moora_rank must be integer"
        }
      }
    },
    moora_harga: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "moora_harga is required"
        },
        isInt: {
          args: true,
          msg: "moora_harga must be integer"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Alternatif',
    hooks: {
      beforeCreate: (alternatif, opt) => {
        const vikorTotal = 0;
        const vikorRank = 0;
        const vikorHarga = 0;
        alternatif.vikor_total = vikorTotal;
        alternatif.vikor_rank = vikorRank;
        alternatif.vikor_harga = vikorHarga;

        const mooraTotal = 0;
        const mooraRank = 0;
        const mooraHarga = 0;
        alternatif.moora_total = mooraTotal;
        alternatif.moora_rank = mooraRank
        alternatif.moora_harga = mooraHarga
      }
    }
  });
  return Alternatif;
};