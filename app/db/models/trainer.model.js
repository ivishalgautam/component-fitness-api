"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let TrainerModel = null;

const init = async (sequelize) => {
  TrainerModel = await sequelize.define(
    constants.models.TRAINER_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.USER_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
      type: {
        type: DataTypes.ENUM("personal", "general"),
        defaultValue: "general",
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await TrainerModel.sync({ alter: true });
};

const create = async (req) => {
  return await TrainerModel.create({
    user_id: req.body.user_id,
    type: req.body.type,
  });
};

const update = async (req, id) => {
  return await TrainerModel.update(
    {
      user_id: req.body.user_id,
      type: req.body.type,
    },
    { where: { id: req.params.id || id } }
  );
};

const get = async (req) => {
  return await TrainerModel.findAll({
    order: [["created_at", "DESC"]],
  });
};

const getById = async (req, id) => {
  return await TrainerModel.findOne({
    where: {
      id: req.params.id || id,
    },
  });
};

const deleteById = async (req, id) => {
  return await TrainerModel.destroy({
    where: { id: req.params.id || id },
  });
};

export default {
  init: init,
  create: create,
  get: get,
  getById: getById,
  deleteById: deleteById,
  update: update,
};
