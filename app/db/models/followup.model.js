"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes, Deferrable } from "sequelize";

let NoteModel = null;

const init = async (sequelize) => {
  NoteModel = sequelize.define(
    constants.models.FOLLOW_UP_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: "Title is required!",
          notEmpty: "Title is required!",
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: "Content is required!",
          notEmpty: "Content is required!",
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: "Please select valid date!",
          notNull: "Please select valid date!",
          notEmpty: "Please select valid date!",
        },
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
      sales_person_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.SALES_PERSON_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await NoteModel.sync({ alter: true });
};

const create = async (req) => {
  return await NoteModel.create({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    user_id: req.body.user_id,
    sales_person_id: req.user_data.id,
  });
};

const update = async (req, id) => {
  return await NoteModel.update(
    {
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
    },
    {
      where: {
        id: req.params.id || id,
      },
      returning: true,
      raw: true,
    }
  );
};

const get = async (req) => {
  let whereQuery = "";
  if (req.user_data.role === "customer") {
    whereQuery = `fu.user_id = '${req.user_data.id}'`;
  }

  let query = `
  SELECT
    *
    FROM followups fu
    ${whereQuery}
  `;

  return await NoteModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getById = async (req, id) => {
  return await NoteModel.findOne({
    where: { id: req.params.id || id },
    raw: true,
  });
};

const getByUserId = async (req, user_id) => {
  let query = `
    SELECT
      *
      FROM followups fu
      fu.sales_person_id = '${req.user_data.id}' AND fu.user_id = '${
    req.params.id || user_id
  }'
    `;

  return await NoteModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const deleteById = async (req, id) => {
  return await NoteModel.destroy({
    where: { id: req.params.id || id },
  });
};

export default {
  init: init,
  create: create,
  update: update,
  getById: getById,
  getByUserId: getByUserId,
  deleteById: deleteById,
  get: get,
};
