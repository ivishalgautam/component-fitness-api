"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk, { QueryTypes } from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let CustomerMembershipModel = null;

const init = async (sequelize) => {
  CustomerMembershipModel = await sequelize.define(
    constants.models.CUSTOMER_MEMBERSHIP_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.CUSTOMER_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
      membership_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.MEMBERSHIP_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
      trainer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.TRAINER_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: "Please enter valid date!" },
        },
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: "Please enter valid date!" },
        },
      },
      discount_in_percent: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Enter valid discount!",
          },
        },
      },
      is_expired: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      is_freezed: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await CustomerMembershipModel.sync({ alter: true });
};

const create = async (req) => {
  return await CustomerMembershipModel.create({
    customer_id: req.body.customer_id,
    membership_id: req.body.membership_id,
    trainer_id: req.body.trainer_id,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    discount_in_percent: req.body.discount_in_percent,
  });
};

const update = async (req, id) => {
  return await CustomerMembershipModel.update(
    {
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      discount_in_percent: req.body.discount_in_percent,
      is_freezed: req.body.is_freezed,
    },
    { where: { id: req.params.id || id } }
  );
};

const get = async (req) => {
  let whereQuery = "";

  if (req.user_data.role === "customer") {
    whereQuery = `WHERE cm.user_id = '${req.user_data.id}'`;
  }

  let query = `
  SELECT 
      cm.*,
      usr.fullname as customer_name,
      s.name as subscription_name
    FROM ${constants.models.CUSTOMER_MEMBERSHIP_TABLE} cm
    LEFT JOIN users usr ON usr.id = cm.user_id
    LEFT JOIN subscriptions s ON s.id = cm.membership_id
    ${whereQuery}
  `;

  return await CustomerMembershipModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getById = async (req, id) => {
  return await CustomerMembershipModel.findOne({
    where: {
      id: req.params.id || id,
    },
  });
};

const deleteById = async (req, id) => {
  return await CustomerMembershipModel.destroy({
    where: { id: req.params.id || id },
  });
};

export default {
  init: init,
  create: create,
  update: update,
  get: get,
  getById: getById,
  deleteById: deleteById,
};
